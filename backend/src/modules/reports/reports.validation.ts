import { z } from 'zod';

export const createReportSchema = z.object({
  targetType: z.enum(['profile', 'message', 'review'], {
    errorMap: () => ({ message: 'Target type must be "profile", "message", or "review".' }),
  }),
  targetId: z.string().min(1, 'Target ID is required.'),
  reason: z.string().min(2, 'Reason is required.').max(100),
  description: z.string().max(1000, 'Description must not exceed 1000 characters.').optional(),
});
