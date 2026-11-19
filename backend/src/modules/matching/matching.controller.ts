import { Request, Response, NextFunction } from 'express';
import { MatchingService } from './matching.service.js';
import { sendSuccess } from '../../utils/response.js';
import { UnauthorizedError } from '../../utils/errors.js';

export class MatchingController {
  public static async getMatches(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new UnauthorizedError();
      }
      const matches = await MatchingService.getMatches(req.user.id);
      sendSuccess(res, { matches }, { total: matches.length });
    } catch (err) {
      next(err);
    }
  }
}
