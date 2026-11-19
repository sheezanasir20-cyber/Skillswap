import { describe, it, expect, beforeEach } from 'vitest';
import { ReportsService } from '../../backend/src/modules/reports/reports.service.js';
import { ModerationService } from '../../backend/src/modules/moderation/moderation.service.js';
import { inMemoryDb } from '../../backend/src/services/db.js';
import { NotFoundError, ValidationError } from '../../backend/src/utils/errors.js';
import { createReportSchema } from '../../backend/src/modules/reports/reports.validation.js';

describe('White-Box Testing: Reporting & Moderation State Workflows', () => {
  const reporterId = 'user-reporter';
  const targetUserId = 'user-target';
  const moderatorId = 'staff-mod';
  const messageId = 'msg-reported-1';
  const reviewId = 'rev-reported-1';

  beforeEach(() => {
    inMemoryDb.clearAll();

    // Seed reporter
    inMemoryDb.users.set(reporterId, {
      id: reporterId,
      email: 'reporter@test.com',
      passwordHash: 'hash',
      displayName: 'Reporter User',
      bio: null,
      avatarUrl: null,
      timezone: 'UTC',
      role: 'member',
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Seed target member
    inMemoryDb.users.set(targetUserId, {
      id: targetUserId,
      email: 'target@test.com',
      passwordHash: 'hash',
      displayName: 'Target User',
      bio: 'Target bio',
      avatarUrl: null,
      timezone: 'UTC',
      role: 'member',
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Seed moderator
    inMemoryDb.users.set(moderatorId, {
      id: moderatorId,
      email: 'mod@test.com',
      passwordHash: 'hash',
      displayName: 'Staff Moderator',
      bio: null,
      avatarUrl: null,
      timezone: 'UTC',
      role: 'moderator',
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Seed message
    inMemoryDb.messages.set(messageId, {
      id: messageId,
      conversationId: 'conv-1',
      senderId: targetUserId,
      body: 'Inappropriate content',
      readAt: null,
      createdAt: new Date(),
    });

    // Seed review
    inMemoryDb.reviews.set(reviewId, {
      id: reviewId,
      sessionId: 'sess-1',
      reviewerId: targetUserId,
      revieweeId: reporterId,
      rating: 1,
      body: 'Spam review',
      status: 'visible',
      createdAt: new Date(),
    });
  });

  describe('1. Report Validation & Target Existence Verification', () => {
    it('validates report schema correctly', () => {
      const valid = createReportSchema.parse({
        targetType: 'profile',
        targetId: targetUserId,
        reason: 'Harassment',
        description: 'Repeated offensive messages',
      });
      expect(valid.targetType).toBe('profile');
      expect(valid.reason).toBe('Harassment');

      // Invalid targetType
      expect(() =>
        createReportSchema.parse({
          targetType: 'invalid_type' as any,
          targetId: '123',
          reason: 'Test',
        })
      ).toThrow();
    });

    it('creates profile report when target profile exists', async () => {
      const report = await ReportsService.createReport(reporterId, {
        targetType: 'profile',
        targetId: targetUserId,
        reason: 'Spam Profile',
      });

      expect(report).toBeDefined();
      expect(report.reporterId).toBe(reporterId);
      expect(report.targetType).toBe('profile');
      expect(report.status).toBe('submitted');
      expect(report.assignedTo).toBeNull();
    });

    it('creates message report when message exists', async () => {
      const report = await ReportsService.createReport(reporterId, {
        targetType: 'message',
        targetId: messageId,
        reason: 'Abusive language',
      });

      expect(report.targetType).toBe('message');
      expect(report.targetId).toBe(messageId);
    });

    it('creates review report when review exists', async () => {
      const report = await ReportsService.createReport(reporterId, {
        targetType: 'review',
        targetId: reviewId,
        reason: 'Fake review',
      });

      expect(report.targetType).toBe('review');
      expect(report.targetId).toBe(reviewId);
    });

    it('rejects report when target does not exist (NotFoundError)', async () => {
      await expect(
        ReportsService.createReport(reporterId, {
          targetType: 'profile',
          targetId: 'non-existent-user',
          reason: 'Spam',
        })
      ).rejects.toThrow(NotFoundError);

      await expect(
        ReportsService.createReport(reporterId, {
          targetType: 'message',
          targetId: 'non-existent-message',
          reason: 'Spam',
        })
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe('2. Moderation Queue & Lifecycle State Transitions', () => {
    it('retrieves reports with filter and enriches with preview', async () => {
      await ReportsService.createReport(reporterId, {
        targetType: 'profile',
        targetId: targetUserId,
        reason: 'Misleading skills',
      });

      const queue = await ModerationService.getReports();
      expect(queue.length).toBe(1);
      expect(queue[0].targetPreview).toBeDefined();
      expect(queue[0].targetPreview.displayName).toBe('Target User');
    });

    it('assigns report to moderator and updates state to under_review', async () => {
      const report = await ReportsService.createReport(reporterId, {
        targetType: 'profile',
        targetId: targetUserId,
        reason: 'Impersonation',
      });

      const assigned = await ModerationService.assignReport(moderatorId, report.id, moderatorId);
      expect(assigned.assignedTo).toBe(moderatorId);
      expect(assigned.status).toBe('under_review');

      // Verify audit log
      const audit = Array.from(inMemoryDb.auditLogs.values()).find((a) => a.action === 'REPORT_ASSIGNED');
      expect(audit).toBeDefined();
      expect(audit?.actorId).toBe(moderatorId);
    });

    it('resolves report with resolutionNote and updates state to resolved', async () => {
      const report = await ReportsService.createReport(reporterId, {
        targetType: 'profile',
        targetId: targetUserId,
        reason: 'Rules violation',
      });

      await ModerationService.assignReport(moderatorId, report.id, moderatorId);

      const resolved = await ModerationService.resolveReport(moderatorId, report.id, {
        action: 'resolved',
        resolutionNote: 'User warned and skills corrected.',
      });

      expect(resolved.status).toBe('resolved');
      expect(resolved.resolutionNote).toBe('User warned and skills corrected.');
      expect(resolved.resolvedAt).toBeInstanceOf(Date);

      // Verify audit log
      const audit = Array.from(inMemoryDb.auditLogs.values()).find((a) => a.action === 'REPORT_RESOLVED');
      expect(audit).toBeDefined();
    });

    it('dismisses report with resolutionNote and updates state to dismissed', async () => {
      const report = await ReportsService.createReport(reporterId, {
        targetType: 'profile',
        targetId: targetUserId,
        reason: 'False alarm',
      });

      const dismissed = await ModerationService.resolveReport(moderatorId, report.id, {
        action: 'dismissed',
        resolutionNote: 'No violation found upon inspection.',
      });

      expect(dismissed.status).toBe('dismissed');
      expect(dismissed.resolutionNote).toBe('No violation found upon inspection.');
    });
  });

  describe('3. Moderation Actions: Warnings and Suspensions', () => {
    it('moderator warns member, sends notification, and records audit trail', async () => {
      await ModerationService.warnMember(moderatorId, targetUserId, 'Please update your profile details');

      // Member receives warning notification
      const notifications = Array.from(inMemoryDb.notifications.values()).filter(
        (n) => n.userId === targetUserId
      );
      expect(notifications.some((n) => n.title.includes('Warning from SkillSwap Moderation'))).toBe(true);

      // Audit trail recorded
      const audit = Array.from(inMemoryDb.auditLogs.values()).find((a) => a.action === 'MEMBER_WARNED');
      expect(audit).toBeDefined();
      expect(audit?.targetId).toBe(targetUserId);
    });

    it('moderator suspends member, updates member status, and logs audit', async () => {
      const target = inMemoryDb.users.get(targetUserId);
      expect(target?.status).toBe('active');

      await ModerationService.suspendMember(moderatorId, targetUserId, 'Repeated policy violations');

      const suspended = inMemoryDb.users.get(targetUserId);
      expect(suspended?.status).toBe('suspended');

      // Audit trail recorded
      const audit = Array.from(inMemoryDb.auditLogs.values()).find((a) => a.action === 'MEMBER_SUSPENDED');
      expect(audit).toBeDefined();
      expect(audit?.reason).toBe('Repeated policy violations');
    });
  });
});
