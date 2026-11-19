import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Please enter a valid email address.').trim().toLowerCase(),
  password: z.string().min(8, 'Password must be at least 8 characters long.'),
  displayName: z.string().min(2, 'Display name must be at least 2 characters.').max(60, 'Display name must not exceed 60 characters.').trim(),
  timezone: z.string().default('UTC'),
});

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address.').trim().toLowerCase(),
  password: z.string().min(1, 'Password is required.'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address.').trim().toLowerCase(),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required.'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters long.'),
});
