import { Request, Response, NextFunction } from 'express';
import { NotificationsService } from './notifications.service.js';
import { sendSuccess } from '../../utils/response.js';
import { UnauthorizedError } from '../../utils/errors.js';

export class NotificationsController {
  public static async getMyNotifications(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) throw new UnauthorizedError();
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 50;
      const offset = req.query.offset ? parseInt(req.query.offset as string, 10) : 0;

      const result = await NotificationsService.getForUser(req.user.id, limit, offset);
      sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  }

  public static async markRead(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) throw new UnauthorizedError();
      const { id } = req.params;
      const updated = await NotificationsService.markAsRead(req.user.id, id);
      sendSuccess(res, { notification: updated });
    } catch (err) {
      next(err);
    }
  }

  public static async markAllRead(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) throw new UnauthorizedError();
      await NotificationsService.markAllAsRead(req.user.id);
      sendSuccess(res, { message: 'All notifications marked as read.' });
    } catch (err) {
      next(err);
    }
  }
}
