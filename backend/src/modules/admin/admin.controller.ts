import { Request, Response, NextFunction } from 'express';
import { AdminService } from './admin.service.js';
import { sendSuccess } from '../../utils/response.js';
import { UnauthorizedError } from '../../utils/errors.js';

export class AdminController {
  public static async listMembers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const search = req.query.search as string | undefined;
      const role = req.query.role as string | undefined;
      const status = req.query.status as string | undefined;

      const members = await AdminService.listMembers({ search, role, status });
      sendSuccess(res, { members }, { total: members.length });
    } catch (err) {
      next(err);
    }
  }

  public static async updateMember(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) throw new UnauthorizedError();
      const { id } = req.params;
      const { role, status, reason } = req.body;

      const updated = await AdminService.updateMember(req.user.id, id, { role, status, reason });
      sendSuccess(res, { member: updated });
    } catch (err) {
      next(err);
    }
  }
}
