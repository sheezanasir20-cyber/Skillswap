import { Request, Response, NextFunction } from 'express';
import { DiscoveryService } from './discovery.service.js';
import { sendSuccess } from '../../utils/response.js';

export class DiscoveryController {
  public static async search(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const q = req.query.q as string | undefined;
      const skillId = req.query.skillId as string | undefined;
      const intent = req.query.intent as 'teach' | 'learn' | undefined;
      const level = req.query.level as 'beginner' | 'intermediate' | 'advanced' | undefined;
      const weekday = req.query.weekday ? parseInt(req.query.weekday as string, 10) : undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 20;
      const offset = req.query.offset ? parseInt(req.query.offset as string, 10) : 0;

      const { members, total } = await DiscoveryService.searchMembers(req.user?.id, {
        q,
        skillId,
        intent,
        level,
        weekday,
        limit,
        offset,
      });

      sendSuccess(res, { members }, { total, limit, offset });
    } catch (err) {
      next(err);
    }
  }
}
