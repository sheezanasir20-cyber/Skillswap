import { Router } from 'express';
import { MembersController } from './members.controller.js';
import { DiscoveryController } from '../discovery/discovery.controller.js';
import { authenticate } from '../../middleware/auth.js';

const router = Router();

router.get('/me', authenticate(), MembersController.getMe);
router.patch('/me', authenticate(), MembersController.updateMe);
router.put('/me/availability', authenticate(), MembersController.setAvailability);
router.get('/search', authenticate(true), DiscoveryController.search);
router.get('/:memberId', authenticate(true), MembersController.getMemberById);

export { router as membersRouter };
