import { Router } from 'express';
import { NotificationsController } from './notifications.controller.js';
import { authenticate } from '../../middleware/auth.js';

const router = Router();

router.get('/notifications', authenticate(), NotificationsController.getMyNotifications);
router.post('/notifications/:id/read', authenticate(), NotificationsController.markRead);
router.post('/notifications/read-all', authenticate(), NotificationsController.markAllRead);

export { router as notificationsRouter };
