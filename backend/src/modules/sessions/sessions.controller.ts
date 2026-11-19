import { Request, Response, NextFunction } from 'express';
import { SessionsService } from './sessions.service.js';
import { proposeSessionSchema, rescheduleSessionSchema } from './sessions.validation.js';
import { sendSuccess } from '../../utils/response.js';
import { ValidationError, UnauthorizedError } from '../../utils/errors.js';

export class SessionsController {
  public static async propose(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) throw new UnauthorizedError();
      const parsed = proposeSessionSchema.safeParse(req.body);
      if (!parsed.success) {
        const fields: Record<string, string> = {};
        for (const issue of parsed.error.issues) {
          fields[issue.path.join('.')] = issue.message;
        }
        throw new ValidationError('Please check the highlighted fields.', fields);
      }

      const session = await SessionsService.proposeSession(req.user.id, parsed.data);
      sendSuccess(res, { session }, undefined, 201);
    } catch (err) {
      next(err);
    }
  }

  public static async confirm(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) throw new UnauthorizedError();
      const { id } = req.params;
      const session = await SessionsService.confirmSession(req.user.id, id);
      sendSuccess(res, { session });
    } catch (err) {
      next(err);
    }
  }

  public static async decline(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) throw new UnauthorizedError();
      const { id } = req.params;
      const session = await SessionsService.declineSession(req.user.id, id);
      sendSuccess(res, { session });
    } catch (err) {
      next(err);
    }
  }

  public static async reschedule(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) throw new UnauthorizedError();
      const { id } = req.params;
      const parsed = rescheduleSessionSchema.safeParse(req.body);
      if (!parsed.success) {
        const fields: Record<string, string> = {};
        for (const issue of parsed.error.issues) {
          fields[issue.path.join('.')] = issue.message;
        }
        throw new ValidationError('Validation failed.', fields);
      }

      const session = await SessionsService.rescheduleSession(req.user.id, id, parsed.data);
      sendSuccess(res, { session });
    } catch (err) {
      next(err);
    }
  }

  public static async cancel(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) throw new UnauthorizedError();
      const { id } = req.params;
      const session = await SessionsService.cancelSession(req.user.id, id);
      sendSuccess(res, { session });
    } catch (err) {
      next(err);
    }
  }

  public static async complete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) throw new UnauthorizedError();
      const { id } = req.params;
      const session = await SessionsService.completeSession(req.user.id, id);
      sendSuccess(res, { session });
    } catch (err) {
      next(err);
    }
  }

  public static async getMySessions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) throw new UnauthorizedError();
      const status = req.query.status as string | undefined;
      const sessions = await SessionsService.getMySessions(req.user.id, { status });
      sendSuccess(res, { sessions });
    } catch (err) {
      next(err);
    }
  }

  public static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) throw new UnauthorizedError();
      const { id } = req.params;
      const session = await SessionsService.getSessionById(req.user.id, id);
      sendSuccess(res, { session });
    } catch (err) {
      next(err);
    }
  }
}
