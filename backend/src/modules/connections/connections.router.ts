import { Router } from 'express';
import { ConnectionsController } from './connections.controller.js';
import { authenticate } from '../../middleware/auth.js';

const router = Router();

router.get('/connections', authenticate(), ConnectionsController.getMyConnections);
router.post('/connections', authenticate(), ConnectionsController.sendRequest);
router.post('/connections/:id/accept', authenticate(), ConnectionsController.acceptRequest);
router.post('/connections/:id/reject', authenticate(), ConnectionsController.rejectRequest);
router.post('/connections/:id/cancel', authenticate(), ConnectionsController.cancelRequest);

export { router as connectionsRouter };
