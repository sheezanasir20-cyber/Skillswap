import { Request, Response, NextFunction } from 'express';
import { ModerationService } from './moderation.service.js';
import { sendSuccess } from '../../utils/response.js';
import { ValidationError, UnauthorizedError } from '../../utils/errors.js';

export class ModerationController {
  public static async getReports(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const status = req.query.status as string | undefined;
      const reports = await ModerationService.getReports({ status });
      sendSuccess(res, { reports });
    } catch (err) {
      next(err);
    }
  }

  public static async getReportById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const report = await ModerationService.getReportById(id);
      sendSuccess(res, { report });
    } catch (err) {
      next(err);
    }
  }

  public static async assignReport(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) throw new UnauthorizedError();
      const { id } = req.params;
      const assigneeId = req.body.assigneeId || req.user.id;
      const report = await ModerationService.assignReport(req.user.id, id, assigneeId);
      sendSuccess(res, { report });
    } catch (err) {
      next(err);
    }
  }

  public static async resolveReport(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) throw new UnauthorizedError();
      const { id } = req.params;
      const { action, resolutionNote } = req.body;
      if (!action || !resolutionNote) {
        throw new ValidationError('Action and resolutionNote are required.');
      }
      const report = await ModerationService.resolveReport(req.user.id, id, {
        action,
        resolutionNote,
      });
      sendSuccess(res, { report });
    } catch (err) {
      next(err);
    }
  }

  public static async warnMember(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) throw new UnauthorizedError();
      const { id } = req.params;
      const { reason } = req.body;
      if (!reason) throw new ValidationError('Reason is required for issuing a warning.');
      await ModerationService.warnMember(req.user.id, id, reason);
      sendSuccess(res, { message: 'Warning has been issued to the member.' });
    } catch (err) {
      next(err);
    }
  }

  public static async suspendMember(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) throw new UnauthorizedError();
      const { id } = req.params;
      const { reason } = req.body;
      if (!reason) throw new ValidationError('Reason is required for account suspension.');
      await ModerationService.suspendMember(req.user.id, id, reason);
      sendSuccess(res, { message: 'Member account has been suspended.' });
    } catch (err) {
      next(err);
    }
  }
}
