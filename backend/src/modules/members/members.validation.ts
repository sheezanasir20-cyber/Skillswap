import { z } from 'zod';

export const updateProfileSchema = z.object({
  displayName: z.string().min(2, 'Display name must be at least 2 characters.').max(60).optional(),
  bio: z.string().max(500, 'Bio must not exceed 500 characters.').nullable().optional(),
  avatarUrl: z.string().url('Avatar must be a valid URL.').nullable().optional(),
  timezone: z.string().optional(),
});

export const updateAvailabilitySchema = z.object({
  weekday: z.number().int().min(0).max(6),
  startMinute: z.number().int().min(0).max(1439),
  endMinute: z.number().int().min(1).max(1440),
  timezone: z.string().default('UTC'),
});
