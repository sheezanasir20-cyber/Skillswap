import { describe, it, expect, beforeEach } from 'vitest';
import { SessionsService } from '../../backend/src/modules/sessions/sessions.service.js';
import { SessionStateMachine } from '../../backend/src/modules/sessions/session.state-machine.js';
import { inMemoryDb, UserEntity, ConnectionEntity } from '../../backend/src/services/db.js';

describe('White-Box Testing: Session State Machine & Scheduling Logic', () => {
  let userA: UserEntity;
  let userB: UserEntity;
  let connection: ConnectionEntity;

  beforeEach(() => {
    inMemoryDb.clearAll();

    userA = {
      id: 'user-a',
      email: 'a@example.com',
      passwordHash: 'hash',
      displayName: 'Teacher Alice',
      timezone: 'UTC',
      role: 'member',
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    userB = {
      id: 'user-b',
      email: 'b@example.com',
      passwordHash: 'hash',
      displayName: 'Learner Bob',
      timezone: 'UTC',
      role: 'member',
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    connection = {
      id: 'conn-ab',
      requesterId: userA.id,
      recipientId: userB.id,
      status: 'accepted',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    inMemoryDb.users.set(userA.id, userA);
    inMemoryDb.users.set(userB.id, userB);
    inMemoryDb.connections.set(connection.id, connection);
  });

  describe('1. Session State Machine Permitted & Disallowed Transitions', () => {
    it('validates permitted state machine transitions', () => {
      expect(SessionStateMachine.canTransition('proposed', 'confirmed')).toBe(true);
      expect(SessionStateMachine.canTransition('proposed', 'declined')).toBe(true);
      expect(SessionStateMachine.canTransition('proposed', 'cancelled')).toBe(true);
      expect(SessionStateMachine.canTransition('confirmed', 'completed')).toBe(true);
      expect(SessionStateMachine.canTransition('confirmed', 'cancelled')).toBe(true);
      expect(SessionStateMachine.canTransition('confirmed', 'proposed')).toBe(true); // Reschedule
    });

    it('rejects forbidden state machine transitions with ValidationError', () => {
      // Completed is terminal
      expect(SessionStateMachine.canTransition('completed', 'proposed')).toBe(false);
      expect(SessionStateMachine.canTransition('completed', 'cancelled')).toBe(false);
      expect(() => SessionStateMachine.transition('completed', 'cancelled')).toThrow(
        'Cannot transition session from "completed" to "cancelled".'
      );

      // Cancelled is terminal
      expect(SessionStateMachine.canTransition('cancelled', 'confirmed')).toBe(false);

      // Declined is terminal
      expect(SessionStateMachine.canTransition('declined', 'confirmed')).toBe(false);
    });
  });

  describe('2. Session Proposal & Confirmation Lifecycle', () => {
    it('executes successful session proposal and sends partner notification', async () => {
      const startsAt = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString();
      const endsAt = new Date(Date.now() + 49 * 60 * 60 * 1000).toISOString();

      const session = await SessionsService.proposeSession(userA.id, {
        connectionId: connection.id,
        title: 'JavaScript Async Patterns',
        description: 'Deep dive into promises and microtasks',
        startsAt,
        endsAt,
        timezone: 'UTC',
        externalMeetingUrl: 'https://meet.google.com/abc-defg-hij',
      });

      expect(session).toBeDefined();
      expect(session.status).toBe('proposed');
      expect(session.version).toBe(1);
      expect(session.proposedBy).toBe(userA.id);

      // Partner notification
      const notifs = Array.from(inMemoryDb.notifications.values());
      const partnerNotif = notifs.find((n) => n.userId === userB.id);
      expect(partnerNotif?.type).toBe('session_proposed');
    });

    it('rejects proposal if connection is not accepted', async () => {
      connection.status = 'pending';
      inMemoryDb.connections.set(connection.id, connection);

      const startsAt = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString();
      const endsAt = new Date(Date.now() + 49 * 60 * 60 * 1000).toISOString();

      await expect(
        SessionsService.proposeSession(userA.id, {
          connectionId: connection.id,
          title: 'Title',
          startsAt,
          endsAt,
        })
      ).rejects.toThrow('Sessions can only be scheduled for accepted connections.');
    });

    it('rejects proposal from non-participant', async () => {
      const startsAt = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString();
      const endsAt = new Date(Date.now() + 49 * 60 * 60 * 1000).toISOString();

      await expect(
        SessionsService.proposeSession('outsider', {
          connectionId: connection.id,
          title: 'Title',
          startsAt,
          endsAt,
        })
      ).rejects.toThrow('You are not a participant in this connection.');
    });

    it('confirms session, sets status to confirmed, and queues 24h & 1h reminder jobs', async () => {
      const startsAt = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString();
      const endsAt = new Date(Date.now() + 49 * 60 * 60 * 1000).toISOString();

      const session = await SessionsService.proposeSession(userA.id, {
        connectionId: connection.id,
        title: 'Python Workshop',
        startsAt,
        endsAt,
      });

      // Proposer cannot confirm own session
      await expect(SessionsService.confirmSession(userA.id, session.id)).rejects.toThrow(
        'You cannot confirm a session you proposed. Wait for your partner.'
      );

      // Partner confirms session
      const confirmed = await SessionsService.confirmSession(userB.id, session.id);
      expect(confirmed.status).toBe('confirmed');

      // Verify reminder jobs queued per NOTIFICATIONS.md
      const jobs = Array.from(inMemoryDb.notificationJobs.values()).filter(
        (j) => j.resourceId === session.id && j.status === 'pending'
      );
      expect(jobs.length).toBe(2);
      expect(jobs.some((j) => j.type === 'session_reminder_24h')).toBe(true);
      expect(jobs.some((j) => j.type === 'session_reminder_1h')).toBe(true);
    });
  });

  describe('3. Reschedule, Cancel, and Complete State Transitions', () => {
    let session: any;

    beforeEach(async () => {
      const startsAt = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString();
      const endsAt = new Date(Date.now() + 49 * 60 * 60 * 1000).toISOString();
      session = await SessionsService.proposeSession(userA.id, {
        connectionId: connection.id,
        title: 'Design Critique',
        startsAt,
        endsAt,
      });
      await SessionsService.confirmSession(userB.id, session.id);
    });

    it('reschedules session, increments version, resets to proposed, and cancels previous reminder jobs', async () => {
      const newStartsAt = new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString();
      const newEndsAt = new Date(Date.now() + 73 * 60 * 60 * 1000).toISOString();

      const rescheduled = await SessionsService.rescheduleSession(userB.id, session.id, {
        startsAt: newStartsAt,
        endsAt: newEndsAt,
        note: 'Rescheduling due to conflict',
      });

      expect(rescheduled.status).toBe('proposed');
      expect(rescheduled.version).toBe(2);
      expect(rescheduled.proposedBy).toBe(userB.id);

      // Verify previous jobs marked as cancelled
      const staleJobs = Array.from(inMemoryDb.notificationJobs.values()).filter(
        (j) => j.resourceId === session.id && j.status === 'cancelled'
      );
      expect(staleJobs.length).toBe(2);
    });

    it('cancels session and cancels pending reminder jobs', async () => {
      const cancelled = await SessionsService.cancelSession(userA.id, session.id);
      expect(cancelled.status).toBe('cancelled');

      const activeJobs = Array.from(inMemoryDb.notificationJobs.values()).filter(
        (j) => j.resourceId === session.id && j.status === 'pending'
      );
      expect(activeJobs.length).toBe(0);
    });

    it('completes session and unlocks review capability', async () => {
      const completed = await SessionsService.completeSession(userA.id, session.id);
      expect(completed.status).toBe('completed');

      // Check session details from both participants' perspective
      const aView = await SessionsService.getSessionById(userA.id, session.id);
      expect(aView.canReview).toBe(true);

      const bView = await SessionsService.getSessionById(userB.id, session.id);
      expect(bView.canReview).toBe(true);
    });
  });
});
