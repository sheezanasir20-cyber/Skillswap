import { Router } from 'express';
import { MatchingController } from './matching.controller.js';
import { authenticate } from '../../middleware/auth.js';

const router = Router();

router.get('/matches', authenticate(), MatchingController.getMatches);

export { router as matchingRouter };
