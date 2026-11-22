import { Request, Response, NextFunction } from 'express';
import { AnalyticsService } from './analytics.service.js';
import { sendSuccess } from '../../utils/response.js';

export class AnalyticsController {
  public static async getAnalytics(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const days = req.query.days ? parseInt(String(req.query.days), 10) : undefined;
      const data = await AnalyticsService.getPlatformAnalytics(days && days > 0 ? { days } : undefined);
      sendSuccess(res, { analytics: data });
    } catch (err) {
      next(err);
    }
  }
}
