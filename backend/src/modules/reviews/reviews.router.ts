import { Router } from 'express';
import { ReviewsController } from './reviews.controller.js';
import { authenticate } from '../../middleware/auth.js';

const router = Router();

router.post('/sessions/:id/reviews', authenticate(), ReviewsController.create);
router.get('/members/:id/reviews', authenticate(true), ReviewsController.getMemberReviews);

export { router as reviewsRouter };
