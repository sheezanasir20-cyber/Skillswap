import { z } from 'zod';

export const createConnectionSchema = z.object({
  recipientId: z.string().min(1, 'Recipient ID is required.'),
  requestNote: z.string().max(300, 'Request note must not exceed 300 characters.').optional(),
});
