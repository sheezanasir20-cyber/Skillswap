import { describe, it, expect, beforeEach } from 'vitest';
import { ReminderWorker } from '../../backend/src/jobs/reminder.worker.js';
import { inMemoryDb } from '../../backend/src/services/db.js';
import { emailService } from '../../backend/src/services/email.service.js';

describe('White-Box Testing: Scheduled Background Reminder Worker', () => {
  const memberA = 'user-rem-a';
  const memberB = 'user-rem-b';
  const connId = 'conn-rem-1';
  const sessionId = 'session-rem-1';

  beforeEach(() => {
    inMemoryDb.clearAll();
    emailService.clearSentEmails();

    // Seed members
    inMemoryDb.users.set(memberA, {
      id: memberA,
      email: 'alex@example.com',
      passwordHash: 'hash',
      displayName: 'Alex Student',
      bio: null,
      avatarUrl: null,
      timezone: 'UTC',
      role: 'member',
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    inMemoryDb.users.set(memberB, {
      id: memberB,
      email: 'sam@example.com',
      passwordHash: 'hash',
      displayName: 'Sam Mentor',
      bio: null,
      avatarUrl: null,
      timezone: 'UTC',
      role: 'member',
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Seed connection
    inMemoryDb.connections.set(connId, {
      id: connId,
      requesterId: memberA,
      recipientId: memberB,
      status: 'accepted',
      requestNote: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Seed confirmed session
    inMemoryDb.sessions.set(sessionId, {
      id: sessionId,
      connectionId: connId,
      proposerId: memberA,
      title: 'Distributed Systems Deep Dive',
      description: 'Consensus algorithms and Paxos',
      startsAt: new Date(Date.now() + 3600000), // starts in 1 hour
      endsAt: new Date(Date.now() + 7200000),
      timezone: 'UTC',
      status: 'confirmed',
      externalMeetingUrl: 'https://meet.jit.si/skillswap-test',
      rescheduleVersion: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  });

  describe('1. Reminder Execution & Dual-Participant Dispatch', () => {
    it('processes due reminder jobs, notifies both participants, and sends emails', async () => {
      // Seed due job (scheduled in the past)
      const dueJob = {
        id: 'job-due-1',
        type: 'session_reminder_1h' as const,
        resourceType: 'session',
        resourceId: sessionId,
        runAt: new Date(Date.now() - 60000), // 1 min ago
        status: 'pending' as const,
        attempts: 0,
        maxAttempts: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      inMemoryDb.notificationJobs.set(dueJob.id, dueJob);

      const processedCount = await ReminderWorker.processDueJobs();
      expect(processedCount).toBe(1);

      // Verify job marked completed
      const updatedJob = inMemoryDb.notificationJobs.get(dueJob.id);
      expect(updatedJob?.status).toBe('completed');

      // Verify in-app notifications generated for both members
      const notifA = Array.from(inMemoryDb.notifications.values()).find((n) => n.userId === memberA);
      const notifB = Array.from(inMemoryDb.notifications.values()).find((n) => n.userId === memberB);

      expect(notifA).toBeDefined();
      expect(notifB).toBeDefined();
      expect(notifA?.type).toBe('session_reminder');
      expect(notifB?.type).toBe('session_reminder');
      expect(notifA?.body).toContain('Distributed Systems Deep Dive');

      // Verify outbox emails dispatched to both
      const emailsA = emailService.getEmailsFor('alex@example.com');
      const emailsB = emailService.getEmailsFor('sam@example.com');
      expect(emailsA.length).toBe(1);
      expect(emailsB.length).toBe(1);
      expect(emailsA[0].subject).toContain('Reminder: SkillSwap session starts in 1 hour');
    });

    it('ignores future jobs that are not yet due', async () => {
      const futureJob = {
        id: 'job-future-1',
        type: 'session_reminder_24h' as const,
        resourceType: 'session',
        resourceId: sessionId,
        runAt: new Date(Date.now() + 86400000), // tomorrow
        status: 'pending' as const,
        attempts: 0,
        maxAttempts: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      inMemoryDb.notificationJobs.set(futureJob.id, futureJob);

      const processedCount = await ReminderWorker.processDueJobs();
      expect(processedCount).toBe(0);

      // Job remains pending
      expect(inMemoryDb.notificationJobs.get(futureJob.id)?.status).toBe('pending');
      expect(inMemoryDb.notifications.size).toBe(0);
    });

    it('cancels reminder if session was canceled before job ran', async () => {
      const session = inMemoryDb.sessions.get(sessionId)!;
      session.status = 'canceled';
      inMemoryDb.sessions.set(session.id, session);

      const job = {
        id: 'job-canceled-session',
        type: 'session_reminder_1h' as const,
        resourceType: 'session',
        resourceId: sessionId,
        runAt: new Date(Date.now() - 10000),
        status: 'pending' as const,
        attempts: 0,
        maxAttempts: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      inMemoryDb.notificationJobs.set(job.id, job);

      const processedCount = await ReminderWorker.processDueJobs();
      expect(processedCount).toBe(0);

      // Job marked cancelled, no emails or notifications dispatched
      expect(inMemoryDb.notificationJobs.get(job.id)?.status).toBe('cancelled');
      expect(inMemoryDb.notifications.size).toBe(0);
      expect(emailService.getSentEmails().length).toBe(0);
    });
  });
});
