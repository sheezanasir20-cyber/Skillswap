import { Request, Response, NextFunction } from 'express';
import { ReportsService } from './reports.service.js';
import { createReportSchema } from './reports.validation.js';
import { sendSuccess } from '../../utils/response.js';
import { ValidationError, UnauthorizedError } from '../../utils/errors.js';

export class ReportsController {
  public static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) throw new UnauthorizedError();
      const parsed = createReportSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new ValidationError('Invalid report payload.');
      }

      const report = await ReportsService.createReport(req.user.id, parsed.data as any);
      sendSuccess(res, { report }, undefined, 201);
    } catch (err) {
      next(err);
    }
  }
}
