import { inMemoryDb, SessionEntity, NotificationJobEntity, UserEntity } from '../../services/db.js';
import { SessionStateMachine } from './session.state-machine.js';
import { NotFoundError, ForbiddenError, ValidationError, ConflictError } from '../../utils/errors.js';
import { NotificationsService } from '../notifications/notifications.service.js';

export interface EnrichedSession extends SessionEntity {
  partner: Omit<UserEntity, 'passwordHash'>;
  isProposer: boolean;
  canReview: boolean;
}

export class SessionsService {
  private static assertNoClash(userIds: string[], startsAt: string, endsAt: string, excludeSessionId?: string): void {
    const s = new Date(startsAt).getTime();
    const e = new Date(endsAt).getTime();
    for (const existing of inMemoryDb.sessions.values()) {
      if (existing.id === excludeSessionId) continue;
      if (existing.status !== 'proposed' && existing.status !== 'confirmed') continue;
      const other = this.participantIds(existing);
      if (!other.some((id) => userIds.includes(id))) continue;
      if (s < existing.endsAt.getTime() && e > existing.startsAt.getTime()) {
        throw new ConflictError(
          `Time clash: one of the participants already has "${existing.title}" scheduled from ${existing.startsAt.toISOString()} to ${existing.endsAt.toISOString()}. Please pick a new time.`
        );
      }
    }
  }

  private static participantIds(session: SessionEntity): string[] {
    const conn = inMemoryDb.connections.get(session.connectionId);
    if (!conn) return [session.proposedBy];
    return [conn.requesterId, conn.recipientId];
  }

  public static async proposeSession(
    userId: string,
    data: {
      connectionId: string;
      title: string;
      description?: string;
      startsAt: string;
      endsAt: string;
      timezone?: string;
      externalMeetingUrl?: string | null;
    }
  ): Promise<SessionEntity> {
    const conn = inMemoryDb.connections.get(data.connectionId);
    if (!conn) {
      throw new NotFoundError('Connection not found.');
    }

    if (conn.status !== 'accepted') {
      throw new ForbiddenError('Sessions can only be scheduled for accepted connections.');
    }

    if (conn.requesterId !== userId && conn.recipientId !== userId) {
      throw new ForbiddenError('You are not a participant in this connection.');
    }

    this.assertNoClash([conn.requesterId, conn.recipientId], data.startsAt, data.endsAt);

    const session: SessionEntity = {
      id: `sess-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      connectionId: data.connectionId,
      proposedBy: userId,
      title: data.title.trim(),
      description: data.description ? data.description.trim() : null,
      startsAt: new Date(data.startsAt),
      endsAt: new Date(data.endsAt),
      timezone: data.timezone || 'UTC',
      externalMeetingUrl: data.externalMeetingUrl || null,
      status: 'proposed',
      version: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    inMemoryDb.sessions.set(session.id, session);

    const partnerId = conn.requesterId === userId ? conn.recipientId : conn.requesterId;
    const proposer = inMemoryDb.users.get(userId);

    // Notify partner of proposal
    await NotificationsService.create({
      userId: partnerId,
      type: 'session_proposed',
      title: 'Session Proposed',
      body: `${proposer?.displayName || 'Your partner'} proposed a session: "${session.title}".`,
      resourceType: 'session',
      resourceId: session.id,
    });

    return session;
  }

  public static async confirmSession(userId: string, sessionId: string): Promise<SessionEntity> {
    const session = inMemoryDb.sessions.get(sessionId);
    if (!session) throw new NotFoundError('Session not found.');

    const conn = inMemoryDb.connections.get(session.connectionId);
    if (!conn || (conn.requesterId !== userId && conn.recipientId !== userId)) {
      throw new ForbiddenError('You are not a participant in this session.');
    }

    if (session.proposedBy === userId) {
      throw new ValidationError('You cannot confirm a session you proposed. Wait for your partner.');
    }

    session.status = SessionStateMachine.transition(session.status, 'confirmed');
    session.updatedAt = new Date();
    inMemoryDb.sessions.set(session.id, session);

    // Queue reminder jobs per NOTIFICATIONS.md (24 hours and 1 hour before startsAt)
    const startsTime = session.startsAt.getTime();
    const now = Date.now();

    const time24h = new Date(startsTime - 24 * 60 * 60 * 1000);
    const time1h = new Date(startsTime - 60 * 60 * 1000);

    if (time24h.getTime() > now) {
      const job24: NotificationJobEntity = {
        id: `job-${Date.now()}-24h`,
        type: 'session_reminder_24h',
        resourceId: session.id,
        runAt: time24h,
        status: 'pending',
        attempts: 0,
        lastError: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      inMemoryDb.notificationJobs.set(job24.id, job24);
    }

    if (time1h.getTime() > now) {
      const job1: NotificationJobEntity = {
        id: `job-${Date.now()}-1h`,
        type: 'session_reminder_1h',
        resourceId: session.id,
        runAt: time1h,
        status: 'pending',
        attempts: 0,
        lastError: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      inMemoryDb.notificationJobs.set(job1.id, job1);
    }

    // Notify proposer
    const partner = inMemoryDb.users.get(userId);
    await NotificationsService.create({
      userId: session.proposedBy,
      type: 'session_confirmed',
      title: 'Session Confirmed',
      body: `${partner?.displayName || 'Your partner'} confirmed your session: "${session.title}".`,
      resourceType: 'session',
      resourceId: session.id,
    });

    return session;
  }

  public static async declineSession(userId: string, sessionId: string): Promise<SessionEntity> {
    const session = inMemoryDb.sessions.get(sessionId);
    if (!session) throw new NotFoundError('Session not found.');

    const conn = inMemoryDb.connections.get(session.connectionId);
    if (!conn || (conn.requesterId !== userId && conn.recipientId !== userId)) {
      throw new ForbiddenError('You are not a participant in this session.');
    }

    if (session.proposedBy === userId) {
      throw new ValidationError('You cannot decline your own proposed session. Cancel it instead.');
    }

    session.status = SessionStateMachine.transition(session.status, 'declined');
    session.updatedAt = new Date();
    inMemoryDb.sessions.set(session.id, session);

    return session;
  }

  public static async rescheduleSession(
    userId: string,
    sessionId: string,
    data: { startsAt: string; endsAt: string; timezone?: string; note?: string }
  ): Promise<SessionEntity> {
    const session = inMemoryDb.sessions.get(sessionId);
    if (!session) throw new NotFoundError('Session not found.');

    const conn = inMemoryDb.connections.get(session.connectionId);
    if (!conn || (conn.requesterId !== userId && conn.recipientId !== userId)) {
      throw new ForbiddenError('You are not a participant in this session.');
    }

    // Valid from proposed or confirmed
    this.assertNoClash(this.participantIds(session), data.startsAt, data.endsAt, session.id);
    session.status = SessionStateMachine.transition(session.status, 'proposed');
    session.proposedBy = userId;
    session.startsAt = new Date(data.startsAt);
    session.endsAt = new Date(data.endsAt);
    if (data.timezone) session.timezone = data.timezone;
    if (data.note) session.description = data.note;
    session.version += 1;
    session.updatedAt = new Date();
    inMemoryDb.sessions.set(session.id, session);

    // Cancel previously queued reminder jobs
    this.cancelSessionJobs(session.id);

    // Notify partner
    const partnerId = conn.requesterId === userId ? conn.recipientId : conn.requesterId;
    const user = inMemoryDb.users.get(userId);
    await NotificationsService.create({
      userId: partnerId,
      type: 'session_rescheduled',
      title: 'Session Rescheduled',
      body: `${user?.displayName || 'Your partner'} proposed a new time for "${session.title}".`,
      resourceType: 'session',
      resourceId: session.id,
    });

    return session;
  }

  public static async cancelSession(userId: string, sessionId: string): Promise<SessionEntity> {
    const session = inMemoryDb.sessions.get(sessionId);
    if (!session) throw new NotFoundError('Session not found.');

    const conn = inMemoryDb.connections.get(session.connectionId);
    if (!conn || (conn.requesterId !== userId && conn.recipientId !== userId)) {
      throw new ForbiddenError('You are not a participant in this session.');
    }

    session.status = SessionStateMachine.transition(session.status, 'cancelled');
    session.updatedAt = new Date();
    inMemoryDb.sessions.set(session.id, session);

    // Cancel pending reminder jobs
    this.cancelSessionJobs(session.id);

    // Notify partner
    const partnerId = conn.requesterId === userId ? conn.recipientId : conn.requesterId;
    const user = inMemoryDb.users.get(userId);
    await NotificationsService.create({
      userId: partnerId,
      type: 'session_cancelled',
      title: 'Session Cancelled',
      body: `${user?.displayName || 'Your partner'} cancelled the session "${session.title}".`,
      resourceType: 'session',
      resourceId: session.id,
    });

    return session;
  }

  public static async completeSession(userId: string, sessionId: string): Promise<SessionEntity> {
    const session = inMemoryDb.sessions.get(sessionId);
    if (!session) throw new NotFoundError('Session not found.');

    const conn = inMemoryDb.connections.get(session.connectionId);
    if (!conn || (conn.requesterId !== userId && conn.recipientId !== userId)) {
      throw new ForbiddenError('You are not a participant in this session.');
    }

    session.status = SessionStateMachine.transition(session.status, 'completed');
    session.updatedAt = new Date();
    inMemoryDb.sessions.set(session.id, session);

    // Cancel any remaining reminder jobs
    this.cancelSessionJobs(session.id);

    // Notify both participants that they can now leave a review
    const partnerId = conn.requesterId === userId ? conn.recipientId : conn.requesterId;
    await NotificationsService.create({
      userId: partnerId,
      type: 'session_completed',
      title: 'Session Completed',
      body: `"${session.title}" has been marked completed. You can now leave feedback.`,
      resourceType: 'session',
      resourceId: session.id,
    });

    return session;
  }

  public static async getMySessions(
    userId: string,
    filters?: { status?: string }
  ): Promise<EnrichedSession[]> {
    const list: EnrichedSession[] = [];

    for (const session of inMemoryDb.sessions.values()) {
      const conn = inMemoryDb.connections.get(session.connectionId);
      if (!conn || (conn.requesterId !== userId && conn.recipientId !== userId)) {
        continue;
      }

      if (filters?.status && session.status !== filters.status) {
        continue;
      }

      const partnerId = conn.requesterId === userId ? conn.recipientId : conn.requesterId;
      const partner = inMemoryDb.users.get(partnerId);
      if (!partner) continue;

      const hasReviewed = Array.from(inMemoryDb.reviews.values()).some(
        (r) => r.sessionId === session.id && r.reviewerId === userId
      );

      const { passwordHash: _, ...safePartner } = partner;
      list.push({
        ...session,
        partner: safePartner,
        isProposer: session.proposedBy === userId,
        canReview: session.status === 'completed' && !hasReviewed,
      });
    }

    return list.sort((a, b) => b.startsAt.getTime() - a.startsAt.getTime());
  }

  public static async getSessionById(userId: string, sessionId: string): Promise<EnrichedSession> {
    const session = inMemoryDb.sessions.get(sessionId);
    if (!session) throw new NotFoundError('Session not found.');

    const conn = inMemoryDb.connections.get(session.connectionId);
    if (!conn || (conn.requesterId !== userId && conn.recipientId !== userId)) {
      throw new ForbiddenError('You are not a participant in this session.');
    }

    const partnerId = conn.requesterId === userId ? conn.recipientId : conn.requesterId;
    const partner = inMemoryDb.users.get(partnerId);
    if (!partner) throw new NotFoundError('Partner user not found.');

    const hasReviewed = Array.from(inMemoryDb.reviews.values()).some(
      (r) => r.sessionId === session.id && r.reviewerId === userId
    );

    const { passwordHash: _, ...safePartner } = partner;
    return {
      ...session,
      partner: safePartner,
      isProposer: session.proposedBy === userId,
      canReview: session.status === 'completed' && !hasReviewed,
    };
  }

  private static cancelSessionJobs(sessionId: string): void {
    for (const job of inMemoryDb.notificationJobs.values()) {
      if (job.resourceId === sessionId && job.status === 'pending') {
        job.status = 'cancelled';
        job.updatedAt = new Date();
        inMemoryDb.notificationJobs.set(job.id, job);
      }
    }
  }
}
