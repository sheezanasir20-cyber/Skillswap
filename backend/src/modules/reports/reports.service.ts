import { inMemoryDb, ReportEntity } from '../../services/db.js';
import { ValidationError, NotFoundError, ConflictError } from '../../utils/errors.js';

export class ReportsService {
  public static async createReport(
    reporterId: string,
    data: {
      targetType: 'profile' | 'message' | 'review';
      targetId: string;
      reason: string;
      description?: string;
    }
  ): Promise<ReportEntity> {
    // Validate target exists
    if (data.targetType === 'profile') {
      const user = inMemoryDb.users.get(data.targetId);
      if (!user) throw new NotFoundError('Reported user profile not found.');
    } else if (data.targetType === 'message') {
      const message = inMemoryDb.messages.get(data.targetId);
      if (!message) throw new NotFoundError('Reported message not found.');
    } else if (data.targetType === 'review') {
      const review = inMemoryDb.reviews.get(data.targetId);
      if (!review) throw new NotFoundError('Reported review not found.');
    }

    if (!data.reason || data.reason.trim().length === 0) {
      throw new ValidationError('Please select a reason for the report.');
    }

    for (const existing of inMemoryDb.reports.values()) {
      if (
        existing.reporterId === reporterId &&
        existing.targetType === data.targetType &&
        existing.targetId === data.targetId &&
        (existing.status === 'submitted' || existing.status === 'under_review')
      ) {
        throw new ConflictError('You have already reported this content. It is pending moderator review.');
      }
    }

    const report: ReportEntity = {
      id: `rep-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      reporterId,
      targetType: data.targetType,
      targetId: data.targetId,
      reason: data.reason.trim(),
      description: data.description ? data.description.trim() : null,
      status: 'submitted',
      assignedTo: null,
      resolutionNote: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      resolvedAt: null,
    };

    inMemoryDb.reports.set(report.id, report);
    return report;
  }
}
