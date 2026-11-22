import { inMemoryDb, ReportEntity, UserEntity } from '../../services/db.js';
import { NotFoundError, ValidationError } from '../../utils/errors.js';
import { AuditService } from '../../services/audit.service.js';
import { NotificationsService } from '../notifications/notifications.service.js';

export interface EnrichedReport extends Omit<ReportEntity, 'reporter' | 'assignee'> {
  reporter?: Omit<UserEntity, 'passwordHash'>;
  assignee?: Omit<UserEntity, 'passwordHash'> | null;
  targetPreview?: any;
}

export class ModerationService {
  public static async getReports(filters?: { status?: string }): Promise<EnrichedReport[]> {
    let reports = Array.from(inMemoryDb.reports.values());
    if (filters?.status) {
      reports = reports.filter((r) => r.status === filters.status);
    }

    const enriched: EnrichedReport[] = [];
    for (const rep of reports) {
      const reporter = inMemoryDb.users.get(rep.reporterId);
      const assignee = rep.assignedTo ? inMemoryDb.users.get(rep.assignedTo) : null;

      let targetPreview: any = null;
      if (rep.targetType === 'profile') {
        const u = inMemoryDb.users.get(rep.targetId);
        targetPreview = u ? { displayName: u.displayName, email: u.email, status: u.status } : null;
      } else if (rep.targetType === 'message') {
        const m = inMemoryDb.messages.get(rep.targetId);
        targetPreview = m ? { body: m.body, senderId: m.senderId } : null;
      } else if (rep.targetType === 'review') {
        const r = inMemoryDb.reviews.get(rep.targetId);
        targetPreview = r ? { rating: r.rating, body: r.body } : null;
      }

      const safeReporter = reporter ? (({ passwordHash: _, ...s }) => s)(reporter) : undefined;
      const safeAssignee = assignee ? (({ passwordHash: _, ...s }) => s)(assignee) : null;

      enriched.push({
        ...rep,
        reporter: safeReporter,
        assignee: safeAssignee,
        targetPreview,
      });
    }

    return enriched.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  public static async getReportById(reportId: string): Promise<EnrichedReport> {
    const rep = inMemoryDb.reports.get(reportId);
    if (!rep) throw new NotFoundError('Report not found.');

    const reporter = inMemoryDb.users.get(rep.reporterId);
    const assignee = rep.assignedTo ? inMemoryDb.users.get(rep.assignedTo) : null;

    let targetPreview: any = null;
    if (rep.targetType === 'profile') {
      const u = inMemoryDb.users.get(rep.targetId);
      targetPreview = u ? { displayName: u.displayName, email: u.email, status: u.status } : null;
    } else if (rep.targetType === 'message') {
      const m = inMemoryDb.messages.get(rep.targetId);
      targetPreview = m ? { body: m.body, senderId: m.senderId } : null;
    } else if (rep.targetType === 'review') {
      const r = inMemoryDb.reviews.get(rep.targetId);
      targetPreview = r ? { rating: r.rating, body: r.body } : null;
    }

    const safeReporter = reporter ? (({ passwordHash: _, ...s }) => s)(reporter) : undefined;
    const safeAssignee = assignee ? (({ passwordHash: _, ...s }) => s)(assignee) : null;

    return {
      ...rep,
      reporter: safeReporter,
      assignee: safeAssignee,
      targetPreview,
    };
  }

  public static async assignReport(staffId: string, reportId: string, assigneeId: string): Promise<ReportEntity> {
    const report = inMemoryDb.reports.get(reportId);
    if (!report) throw new NotFoundError('Report not found.');

    report.assignedTo = assigneeId;
    report.status = 'under_review';
    report.updatedAt = new Date();
    inMemoryDb.reports.set(report.id, report);

    await AuditService.log({
      actorId: staffId,
      action: 'REPORT_ASSIGNED',
      targetType: 'report',
      targetId: report.id,
      metadata: { assignedTo: assigneeId },
    });

    return report;
  }

  public static async resolveReport(
    staffId: string,
    reportId: string,
    data: { action: 'resolved' | 'dismissed'; resolutionNote: string }
  ): Promise<ReportEntity> {
    const report = inMemoryDb.reports.get(reportId);
    if (!report) throw new NotFoundError('Report not found.');

    report.status = data.action;
    report.resolutionNote = data.resolutionNote.trim();
    report.resolvedAt = new Date();
    report.updatedAt = new Date();
    inMemoryDb.reports.set(report.id, report);

    await AuditService.log({
      actorId: staffId,
      action: `REPORT_${data.action.toUpperCase()}`,
      targetType: 'report',
      targetId: report.id,
      reason: data.resolutionNote,
    });

    await NotificationsService.create({
      userId: report.reporterId,
      type: 'report_update',
      title: data.action === 'resolved' ? 'Your Report Was Resolved' : 'Your Report Was Dismissed',
      body: `Your report was marked as ${data.action}. Note: ${report.resolutionNote}`,
      resourceType: 'report',
      resourceId: report.id,
    });

    return report;
  }

  public static async warnMember(
    staffId: string,
    memberId: string,
    warningReason: string
  ): Promise<void> {
    const user = inMemoryDb.users.get(memberId);
    if (!user) throw new NotFoundError('Member not found.');

    await NotificationsService.create({
      userId: memberId,
      type: 'moderation_warning',
      title: 'Warning from SkillSwap Moderation',
      body: warningReason,
      resourceType: 'moderation',
    });

    await AuditService.log({
      actorId: staffId,
      action: 'MEMBER_WARNED',
      targetType: 'user',
      targetId: memberId,
      reason: warningReason,
    });
  }

  public static async suspendMember(
    staffId: string,
    memberId: string,
    suspensionReason: string
  ): Promise<void> {
    const user = inMemoryDb.users.get(memberId);
    if (!user) throw new NotFoundError('Member not found.');

    user.status = 'suspended';
    user.updatedAt = new Date();
    inMemoryDb.users.set(user.id, user);

    await NotificationsService.create({
      userId: memberId,
      type: 'moderation_suspended',
      title: 'Account Suspended',
      body: `Your account has been suspended: ${suspensionReason}`,
      resourceType: 'moderation',
    });

    await AuditService.log({
      actorId: staffId,
      action: 'MEMBER_SUSPENDED',
      targetType: 'user',
      targetId: memberId,
      reason: suspensionReason,
    });
  }
}
