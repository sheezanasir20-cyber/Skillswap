import { Router } from 'express';
import { SessionsController } from './sessions.controller.js';
import { authenticate } from '../../middleware/auth.js';

const router = Router();

router.get('/sessions', authenticate(), SessionsController.getMySessions);
router.post('/sessions', authenticate(), SessionsController.propose);
router.get('/sessions/:id', authenticate(), SessionsController.getById);
router.post('/sessions/:id/confirm', authenticate(), SessionsController.confirm);
router.post('/sessions/:id/decline', authenticate(), SessionsController.decline);
router.patch('/sessions/:id/reschedule', authenticate(), SessionsController.reschedule);
router.post('/sessions/:id/cancel', authenticate(), SessionsController.cancel);
router.post('/sessions/:id/complete', authenticate(), SessionsController.complete);

export { router as sessionsRouter };
