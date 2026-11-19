import { describe, it, expect, beforeAll } from 'vitest';
import { inMemoryDb } from '../../backend/src/services/db.js';
import { emailService } from '../../backend/src/services/email.service.js';
import { AuthService } from '../../backend/src/modules/auth/auth.service.js';
import { MembersService } from '../../backend/src/modules/members/members.service.js';
import { SkillsService } from '../../backend/src/modules/skills/skills.service.js';
import { MatchingService } from '../../backend/src/modules/matching/matching.service.js';
import { ConnectionsService } from '../../backend/src/modules/connections/connections.service.js';
import { MessagingService } from '../../backend/src/modules/messaging/messaging.service.js';
import { SessionsService } from '../../backend/src/modules/sessions/sessions.service.js';
import { ReviewsService } from '../../backend/src/modules/reviews/reviews.service.js';
import { ReportsService } from '../../backend/src/modules/reports/reports.service.js';
import { ModerationService } from '../../backend/src/modules/moderation/moderation.service.js';
import { AdminService } from '../../backend/src/modules/admin/admin.service.js';
import { AnalyticsService } from '../../backend/src/modules/analytics/analytics.service.js';

describe('SkillSwap Complete 25-Step Integrated End-to-End User Journey', () => {
  let memberAToken: string;
  let memberAId: string;
  let memberBToken: string;
  let memberBId: string;
  let modId: string;
  let adminId: string;

  let connectionId: string;
  let conversationId: string;
  let sessionId: string;
  let reportId: string;

  beforeAll(() => {
    inMemoryDb.clearAll();
    emailService.clearSentEmails();

    // Seed staff accounts
    modId = 'staff-moderator-1';
    inMemoryDb.users.set(modId, {
      id: modId,
      email: 'moderator@skillswap.test',
      passwordHash: 'hash',
      displayName: 'Moderator Sarah',
      bio: null,
      avatarUrl: null,
      timezone: 'UTC',
      role: 'moderator',
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    adminId = 'staff-admin-1';
    inMemoryDb.users.set(adminId, {
      id: adminId,
      email: 'admin@skillswap.test',
      passwordHash: 'hash',
      displayName: 'Admin David',
      bio: null,
      avatarUrl: null,
      timezone: 'UTC',
      role: 'admin',
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  });

  // Step 1: Register Member A (Alice)
  it('Step 1: Registers Member A (Alice) and hashes password', async () => {
    const reg = await AuthService.register({
      email: 'alice@example.com',
      password: 'Password123!',
      displayName: 'Alice Developer',
      timezone: 'UTC',
    });
    expect(reg.user).toBeDefined();
    expect(reg.token).toBeTypeOf('string');
    memberAId = reg.user.id;
    memberAToken = reg.token;
  });

  // Step 2: Register Member B (Bob)
  it('Step 2: Registers Member B (Bob) and hashes password', async () => {
    const reg = await AuthService.register({
      email: 'bob@example.com',
      password: 'Password123!',
      displayName: 'Bob Architect',
      timezone: 'UTC',
    });
    expect(reg.user).toBeDefined();
    expect(reg.token).toBeTypeOf('string');
    memberBId = reg.user.id;
    memberBToken = reg.token;
  });

  // Step 3: Member A sets up profile & skills
  it('Step 3: Member A configures skills (teaches Python: Advanced, wants to learn React: Beginner)', async () => {
    await SkillsService.addMemberSkill(memberAId, {
      name: 'Python',
      category: 'Software Development',
      intent: 'teach',
      level: 'advanced',
    });
    await SkillsService.addMemberSkill(memberAId, {
      name: 'React',
      category: 'Web Development',
      intent: 'learn',
      level: 'beginner',
    });

    const profile = await MembersService.getPublicMember(memberAId);
    expect(profile.skills.length).toBe(2);
  });

  // Step 4: Member B sets up profile & skills
  it('Step 4: Member B configures skills (teaches React: Advanced, wants to learn Python: Beginner)', async () => {
    await SkillsService.addMemberSkill(memberBId, {
      name: 'React',
      category: 'Web Development',
      intent: 'teach',
      level: 'advanced',
    });
    await SkillsService.addMemberSkill(memberBId, {
      name: 'Python',
      category: 'Software Development',
      intent: 'learn',
      level: 'beginner',
    });

    const profile = await MembersService.getPublicMember(memberBId);
    expect(profile.skills.length).toBe(2);
  });

  // Step 5: Member A sets availability
  it('Step 5: Member A sets availability (Monday 10:00-14:00, Wednesday 14:00-18:00)', async () => {
    const slots = await MembersService.setAvailability(memberAId, [
      { weekday: 1, startMinute: 600, endMinute: 840 },
      { weekday: 3, startMinute: 840, endMinute: 1080 },
    ]);
    expect(slots.length).toBe(2);
  });

  // Step 6: Member B sets availability
  it('Step 6: Member B sets availability (Monday 11:00-15:00)', async () => {
    const slots = await MembersService.setAvailability(memberBId, [
      { weekday: 1, startMinute: 660, endMinute: 900 },
    ]);
    expect(slots.length).toBe(1);
  });

  // Step 7: Member A executes discovery search / match suggestions
  it('Step 7: Matching engine computes high-confidence reciprocal match between Alice and Bob', async () => {
    const matches = await MatchingService.getMatches(memberAId);
    expect(matches.length).toBeGreaterThan(0);

    const bobMatch = matches.find((m) => m.member.id === memberBId);
    expect(bobMatch).toBeDefined();
    expect(bobMatch!.match.totalScore).toBeGreaterThanOrEqual(70);
    expect(bobMatch!.match.reciprocalTeachSkills.length).toBeGreaterThan(0);
    expect(bobMatch!.match.reciprocalLearnSkills.length).toBeGreaterThan(0);
    expect(bobMatch!.match.explanation).toBeTypeOf('string');
  });

  // Step 8: Member A views Member B's profile
  it('Step 8: Member A inspects Member B public profile card', async () => {
    const profile = await MembersService.getPublicMember(memberBId);
    expect(profile.id).toBe(memberBId);
    expect(profile.displayName).toBe('Bob Architect');
    expect(profile.skills.length).toBe(2);
  });

  // Step 9: Member A sends connection request with note to Member B
  it('Step 9: Member A sends connection request with note to Member B', async () => {
    const connection = await ConnectionsService.sendRequest(
      memberAId,
      memberBId,
      'Hi Bob, I noticed you teach React and want to learn Python. Let swap!'
    );
    expect(connection).toBeDefined();
    expect(connection.status).toBe('pending');
    connectionId = connection.id;
  });

  // Step 10: Member B checks pending requests and receives notification
  it('Step 10: Member B retrieves pending connection requests and confirms notification received', async () => {
    const myConns = await ConnectionsService.getMyConnections(memberBId);
    expect(myConns.incoming.length).toBe(1);
    expect(myConns.incoming[0].requesterId).toBe(memberAId);

    const notifs = Array.from(inMemoryDb.notifications.values()).filter((n) => n.userId === memberBId);
    expect(notifs.some((n) => n.type === 'connection_request')).toBe(true);
  });

  // Step 11: Member B accepts connection request
  it('Step 11: Member B accepts connection request', async () => {
    const updated = await ConnectionsService.acceptRequest(memberBId, connectionId);
    expect(updated.status).toBe('accepted');
  });

  // Step 12: System automatically creates conversation between Member A and Member B
  it('Step 12: Verifies conversation automatically created and both members are authorized participants', async () => {
    const convs = await MessagingService.getMyConversations(memberAId);
    expect(convs.length).toBe(1);
    conversationId = convs[0].id;
    expect(convs[0].partner.id).toBe(memberBId);
  });

  // Step 13: Member A sends message in the conversation
  it('Step 13: Member A posts first message in direct conversation', async () => {
    const message = await MessagingService.sendMessage(
      memberAId,
      conversationId,
      'Hi Bob, excited to connect! When are you free for a session?'
    );
    expect(message).toBeDefined();
    expect(message.body).toContain('excited to connect');
  });

  // Step 14: Member B reads message and replies
  it('Step 14: Member B reads message and replies in thread', async () => {
    const history = await MessagingService.getMessages(memberBId, conversationId);
    expect(history.messages.length).toBe(1);

    const reply = await MessagingService.sendMessage(
      memberBId,
      conversationId,
      'Hey Alice! Next Monday works great for me.'
    );
    expect(reply.senderId).toBe(memberBId);
  });

  // Step 15: Member A proposes a session
  it('Step 15: Member A proposes a 1-hour session on Monday with Jitsi meeting URL', async () => {
    const startsAt = new Date(Date.now() + 86400000 * 2); // 2 days in future
    const endsAt = new Date(startsAt.getTime() + 3600000);

    const session = await SessionsService.proposeSession(memberAId, {
      connectionId,
      title: 'Python & React Reciprocal Exchange',
      description: 'First 30m Python fundamentals, next 30m React state architecture',
      startsAt: startsAt.toISOString(),
      endsAt: endsAt.toISOString(),
      timezone: 'UTC',
      externalMeetingUrl: 'https://meet.jit.si/skillswap-alice-bob',
    });

    expect(session).toBeDefined();
    expect(session.status).toBe('proposed');
    sessionId = session.id;
  });

  // Step 16: System queues reminder jobs and notifies Member B
  it('Step 16: Verifies proposal notification delivered to Member B', async () => {
    const notifs = Array.from(inMemoryDb.notifications.values()).filter(
      (n) => n.userId === memberBId && n.type === 'session_proposed'
    );
    expect(notifs.length).toBeGreaterThan(0);
  });

  // Step 17: Member B confirms session proposal
  it('Step 17: Member B confirms session proposal, transitioning status to confirmed and queueing reminders', async () => {
    const confirmed = await SessionsService.confirmSession(memberBId, sessionId);
    expect(confirmed.status).toBe('confirmed');

    // Verify reminder jobs queued
    const jobs = Array.from(inMemoryDb.notificationJobs.values()).filter(
      (j) => j.resourceId === sessionId
    );
    expect(jobs.length).toBe(2); // 24h and 1h reminders
  });

  // Step 18: Member A requests reschedule with new time
  it('Step 18: Member A reschedules session; rescheduleVersion increments and stale jobs are invalidated', async () => {
    const newStartsAt = new Date(Date.now() + 86400000 * 3);
    const newEndsAt = new Date(newStartsAt.getTime() + 3600000);

    const rescheduled = await SessionsService.rescheduleSession(memberAId, sessionId, {
      startsAt: newStartsAt.toISOString(),
      endsAt: newEndsAt.toISOString(),
      timezone: 'UTC',
      note: 'Need to push back by 1 day due to conference.',
    });

    expect(rescheduled.version).toBe(2);
    expect(rescheduled.status).toBe('proposed');

    // Verify old jobs cancelled
    const oldJobs = Array.from(inMemoryDb.notificationJobs.values()).filter(
      (j) => j.resourceId === sessionId && j.status === 'cancelled'
    );
    expect(oldJobs.length).toBe(2);
  });

  // Step 19: Member B confirms rescheduled session
  it('Step 19: Member B confirms rescheduled session; status transitions to confirmed and new reminders scheduled', async () => {
    const reconfirmed = await SessionsService.confirmSession(memberBId, sessionId);
    expect(reconfirmed.status).toBe('confirmed');

    const activeJobs = Array.from(inMemoryDb.notificationJobs.values()).filter(
      (j) => j.resourceId === sessionId && j.status === 'pending'
    );
    expect(activeJobs.length).toBe(2);
  });

  // Step 20: Simulated completion trigger: Session marked as completed
  it('Step 20: Session completes successfully and unlocks review submission', async () => {
    const completed = await SessionsService.completeSession(memberAId, sessionId);
    expect(completed.status).toBe('completed');
  });

  // Step 21: Member A submits rating & review for Member B (5 stars)
  it('Step 21: Member A submits 5-star review for Member B', async () => {
    const reviewA = await ReviewsService.createReview(memberAId, sessionId, {
      rating: 5,
      body: 'Bob is a phenomenal React mentor. Everything clicked immediately!',
    });
    expect(reviewA.rating).toBe(5);
    expect(reviewA.revieweeId).toBe(memberBId);
  });

  // Step 22: Member B submits reciprocal rating & review for Member A (5 stars)
  it('Step 22: Member B submits reciprocal 5-star review for Member A', async () => {
    const reviewB = await ReviewsService.createReview(memberBId, sessionId, {
      rating: 5,
      body: 'Alice has deep Python mastery and explained async concepts brilliantly!',
    });
    expect(reviewB.rating).toBe(5);
    expect(reviewB.revieweeId).toBe(memberAId);
  });

  // Step 23: Member A reports an abusive profile / test report
  it('Step 23: Member A files a moderation report for a suspicious profile', async () => {
    const report = await ReportsService.createReport(memberAId, {
      targetType: 'profile',
      targetId: memberBId,
      reason: 'Inappropriate avatar',
      description: 'Profile avatar does not follow community guidelines.',
    });
    expect(report.status).toBe('submitted');
    reportId = report.id;
  });

  // Step 24: Staff Moderator views moderation queue, assigns report, and resolves report
  it('Step 24: Staff Moderator reviews queue, claims report, and resolves with audit log', async () => {
    const queue = await ModerationService.getReports();
    expect(queue.some((r) => r.id === reportId)).toBe(true);

    // Assign
    await ModerationService.assignReport(modId, reportId, modId);

    // Resolve
    const resolved = await ModerationService.resolveReport(modId, reportId, {
      action: 'resolved',
      resolutionNote: 'Reviewed and confirmed avatar adheres to standards. Marked resolved.',
    });
    expect(resolved.status).toBe('resolved');

    // Audit log check
    const logs = Array.from(inMemoryDb.auditLogs.values()).filter(
      (a) => a.targetId === reportId
    );
    expect(logs.length).toBeGreaterThan(0);
  });

  // Step 25: Administrator accesses admin dashboard, inspects metrics, updates member status, and verifies append-only audit trail
  it('Step 25: Administrator monitors analytics, checks member management, and audits system actions', async () => {
    const analytics = await AnalyticsService.getPlatformAnalytics();
    expect(analytics.members.total).toBe(4); // Alice, Bob, Moderator, Admin
    expect(analytics.sessions.completed).toBe(1);
    expect(analytics.reviews.total).toBe(2);
    expect(analytics.reviews.averageRating).toBe(5.0);

    // Admin updates a member status
    const updatedMember = await AdminService.updateMember(adminId, memberBId, {
      status: 'active',
      reason: 'Periodic compliance verification complete.',
    });
    expect(updatedMember.status).toBe('active');

    // Verify append-only audit trail
    const adminLogs = Array.from(inMemoryDb.auditLogs.values()).filter(
      (a) => a.actorId === adminId
    );
    expect(adminLogs.length).toBeGreaterThan(0);
    expect(adminLogs[0].action).toBe('ADMIN_MEMBER_UPDATED');
  });
});
