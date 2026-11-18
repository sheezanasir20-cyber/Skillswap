import { Router, Request, Response, NextFunction } from 'express';
import { AuditService } from '../../services/audit.service.js';
import { sendSuccess } from '../../utils/response.js';

const router = Router();

router.get('/activity', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const actorId = req.query.actorId as string | undefined;
    const action = req.query.action as string | undefined;
    const targetType = req.query.targetType as string | undefined;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 50;
    const offset = req.query.offset ? parseInt(req.query.offset as string, 10) : 0;

    const result = await AuditService.getLogs({ actorId, action, targetType, limit, offset });
    sendSuccess(res, { activity: result.logs }, { total: result.total, limit, offset });
  } catch (err) {
    next(err);
  }
});

export { router as auditRouter };
