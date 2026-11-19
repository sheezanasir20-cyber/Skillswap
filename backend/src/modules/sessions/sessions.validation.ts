import { z } from 'zod';

export const proposeSessionSchema = z
  .object({
    connectionId: z.string().min(1, 'Connection ID is required.'),
    title: z.string().min(3, 'Title must be at least 3 characters.').max(100, 'Title must not exceed 100 characters.').trim(),
    description: z.string().max(1000, 'Description must not exceed 1000 characters.').optional(),
    startsAt: z.string().datetime({ message: 'Start time must be a valid ISO 8601 UTC date string.' }),
    endsAt: z.string().datetime({ message: 'End time must be a valid ISO 8601 UTC date string.' }),
    timezone: z.string().default('UTC'),
    externalMeetingUrl: z.string().url('External meeting URL must be a valid URL.').optional().nullable(),
  })
  .refine(
    (data) => new Date(data.endsAt).getTime() > new Date(data.startsAt).getTime(),
    {
      message: 'End time must be after start time.',
      path: ['endsAt'],
    }
  );

export const rescheduleSessionSchema = z
  .object({
    startsAt: z.string().datetime({ message: 'Start time must be a valid ISO 8601 UTC date string.' }),
    endsAt: z.string().datetime({ message: 'End time must be a valid ISO 8601 UTC date string.' }),
    timezone: z.string().optional(),
    note: z.string().max(500).optional(),
  })
  .refine(
    (data) => new Date(data.endsAt).getTime() > new Date(data.startsAt).getTime(),
    {
      message: 'End time must be after start time.',
      path: ['endsAt'],
    }
  );
