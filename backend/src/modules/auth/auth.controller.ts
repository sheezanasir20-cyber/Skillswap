import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service.js';
import { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } from './auth.validation.js';
import { sendSuccess } from '../../utils/response.js';
import { ValidationError } from '../../utils/errors.js';

export class AuthController {
  public static async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const parsed = registerSchema.safeParse(req.body);
      if (!parsed.success) {
        const fields: Record<string, string> = {};
        for (const issue of parsed.error.issues) {
          fields[issue.path.join('.')] = issue.message;
        }
        throw new ValidationError('Please check the highlighted fields.', fields);
      }

      const { user, token } = await AuthService.register(parsed.data);

      res.cookie('skillswap_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      sendSuccess(res, { user, token }, undefined, 201);
    } catch (err) {
      next(err);
    }
  }

  public static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const parsed = loginSchema.safeParse(req.body);
      if (!parsed.success) {
        const fields: Record<string, string> = {};
        for (const issue of parsed.error.issues) {
          fields[issue.path.join('.')] = issue.message;
        }
        throw new ValidationError('Please check the highlighted fields.', fields);
      }

      const { user, token } = await AuthService.login(parsed.data);

      res.cookie('skillswap_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      sendSuccess(res, { user, token });
    } catch (err) {
      next(err);
    }
  }

  public static async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      res.clearCookie('skillswap_token');
      sendSuccess(res, { message: 'Logged out successfully.' });
    } catch (err) {
      next(err);
    }
  }

  public static async forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const parsed = forgotPasswordSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new ValidationError('Please enter a valid email address.');
      }

      await AuthService.forgotPassword(parsed.data.email);
      sendSuccess(res, { message: 'If this email is registered, you will receive password reset instructions.' });
    } catch (err) {
      next(err);
    }
  }

  public static async resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const parsed = resetPasswordSchema.safeParse(req.body);
      if (!parsed.success) {
        const fields: Record<string, string> = {};
        for (const issue of parsed.error.issues) {
          fields[issue.path.join('.')] = issue.message;
        }
        throw new ValidationError('Please check the highlighted fields.', fields);
      }

      await AuthService.resetPassword(parsed.data);
      sendSuccess(res, { message: 'Password has been successfully updated. You can now sign in.' });
    } catch (err) {
      next(err);
    }
  }

  public static async getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        sendSuccess(res, { user: null });
        return;
      }
      const user = await AuthService.getMe(req.user.id);
      sendSuccess(res, { user });
    } catch (err) {
      next(err);
    }
  }
}
