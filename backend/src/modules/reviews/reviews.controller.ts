import { Request, Response, NextFunction } from 'express';
import { ReviewsService } from './reviews.service.js';
import { createReviewSchema } from './reviews.validation.js';
import { sendSuccess } from '../../utils/response.js';
import { ValidationError, UnauthorizedError } from '../../utils/errors.js';

export class ReviewsController {
  public static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) throw new UnauthorizedError();
      const { id } = req.params; // session id
      const parsed = createReviewSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new ValidationError('Invalid review payload.');
      }

      const review = await ReviewsService.createReview(req.user.id, id, parsed.data as any);
      sendSuccess(res, { review }, undefined, 201);
    } catch (err) {
      next(err);
    }
  }

  public static async getMemberReviews(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params; // member id
      const reviews = await ReviewsService.getMemberReviews(id);
      sendSuccess(res, { reviews });
    } catch (err) {
      next(err);
    }
  }
}
