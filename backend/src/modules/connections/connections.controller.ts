import { Request, Response, NextFunction } from 'express';
import { ConnectionsService } from './connections.service.js';
import { createConnectionSchema } from './connections.validation.js';
import { sendSuccess } from '../../utils/response.js';
import { ValidationError, UnauthorizedError } from '../../utils/errors.js';

export class ConnectionsController {
  public static async sendRequest(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) throw new UnauthorizedError();

      const parsed = createConnectionSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new ValidationError('Invalid request payload.');
      }

      const connection = await ConnectionsService.sendRequest(
        req.user.id,
        parsed.data.recipientId,
        parsed.data.requestNote
      );

      sendSuccess(res, { connection }, undefined, 201);
    } catch (err) {
      next(err);
    }
  }

  public static async acceptRequest(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) throw new UnauthorizedError();
      const { id } = req.params;
      const connection = await ConnectionsService.acceptRequest(req.user.id, id);
      sendSuccess(res, { connection });
    } catch (err) {
      next(err);
    }
  }

  public static async rejectRequest(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) throw new UnauthorizedError();
      const { id } = req.params;
      const connection = await ConnectionsService.rejectRequest(req.user.id, id);
      sendSuccess(res, { connection });
    } catch (err) {
      next(err);
    }
  }

  public static async cancelRequest(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) throw new UnauthorizedError();
      const { id } = req.params;
      const connection = await ConnectionsService.cancelRequest(req.user.id, id);
      sendSuccess(res, { connection });
    } catch (err) {
      next(err);
    }
  }

  public static async getMyConnections(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) throw new UnauthorizedError();
      const connections = await ConnectionsService.getMyConnections(req.user.id);
      sendSuccess(res, { connections });
    } catch (err) {
      next(err);
    }
  }
}
