import { Router } from 'express';
import { MessagingController } from './messaging.controller.js';
import { authenticate } from '../../middleware/auth.js';

const router = Router();

router.get('/conversations', authenticate(), MessagingController.getConversations);
router.get('/conversations/:id/messages', authenticate(), MessagingController.getMessages);
router.post('/conversations/:id/messages', authenticate(), MessagingController.sendMessage);

export { router as messagingRouter };
