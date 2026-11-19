import { Request, Response, NextFunction } from 'express';
import { MessagingService } from './messaging.service.js';
import { sendMessageSchema } from './messaging.validation.js';
import { sendSuccess } from '../../utils/response.js';
import { ValidationError, UnauthorizedError } from '../../utils/errors.js';

export class MessagingController {
  public static async getConversations(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) throw new UnauthorizedError();
      const conversations = await MessagingService.getMyConversations(req.user.id);
      sendSuccess(res, { conversations });
    } catch (err) {
      next(err);
    }
  }

  public static async getMessages(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) throw new UnauthorizedError();
      const { id } = req.params;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 50;
      const before = req.query.before as string | undefined;

      const result = await MessagingService.getMessages(req.user.id, id, limit, before);
      sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  }

  public static async sendMessage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) throw new UnauthorizedError();
      const { id } = req.params;

      const parsed = sendMessageSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new ValidationError('Message content is invalid.');
      }

      const message = await MessagingService.sendMessage(req.user.id, id, parsed.data.body);
      sendSuccess(res, { message }, undefined, 201);
    } catch (err) {
      next(err);
    }
  }
}
