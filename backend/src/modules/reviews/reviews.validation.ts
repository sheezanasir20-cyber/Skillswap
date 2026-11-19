import { z } from 'zod';

export const createReviewSchema = z.object({
  rating: z.number().int().min(1, 'Rating must be at least 1 star.').max(5, 'Rating cannot exceed 5 stars.'),
  body: z.string().max(1000, 'Review cannot exceed 1000 characters.').optional(),
});
