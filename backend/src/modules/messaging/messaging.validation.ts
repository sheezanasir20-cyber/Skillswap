import { z } from 'zod';

export const sendMessageSchema = z.object({
  body: z
    .string()
    .min(1, 'Message body cannot be empty.')
    .max(4000, 'Message body must not exceed 4000 characters.')
    .trim(),
});
