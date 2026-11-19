import { Request, Response, NextFunction } from 'express';
import { AnalyticsService } from './analytics.service.js';
import { sendSuccess } from '../../utils/response.js';

export class AnalyticsController {
  public static async getAnalytics(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await AnalyticsService.getPlatformAnalytics();
      sendSuccess(res, { analytics: data });
    } catch (err) {
      next(err);
    }
  }
}
