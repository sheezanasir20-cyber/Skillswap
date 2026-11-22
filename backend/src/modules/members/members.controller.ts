import { Request, Response, NextFunction } from 'express';
import { MembersService } from './members.service.js';
import { updateProfileSchema, updateAvailabilitySchema } from './members.validation.js';
import { sendSuccess } from '../../utils/response.js';
import { ValidationError, UnauthorizedError } from '../../utils/errors.js';
import { z } from 'zod';

export class MembersController {
  public static async getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new UnauthorizedError();
      }
      const user = await MembersService.getProfile(req.user.id);
      const publicData = await MembersService.getPublicMember(req.user.id);
      const { passwordHash: _, ...safeUser } = user;

      sendSuccess(res, {
        ...safeUser,
        skills: publicData.skills,
        availability: publicData.availability,
        averageRating: publicData.averageRating,
        reviewCount: publicData.reviewCount,
      });
    } catch (err) {
      next(err);
    }
  }

  public static async updateMe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new UnauthorizedError();
      }
      const parsed = updateProfileSchema.safeParse(req.body);
      if (!parsed.success) {
        const fields: Record<string, string> = {};
        for (const issue of parsed.error.issues) {
          fields[issue.path.join('.')] = issue.message;
        }
        throw new ValidationError('Validation failed.', fields);
      }

      const updated = await MembersService.updateProfile(req.user.id, parsed.data);
      sendSuccess(res, { user: updated });
    } catch (err) {
      next(err);
    }
  }

  public static async getMemberById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { memberId } = req.params;
      const profile = await MembersService.getPublicMember(memberId);
      sendSuccess(res, { member: profile });
    } catch (err) {
      next(err);
    }
  }

  public static async setAvailability(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new UnauthorizedError();
      }
      const arraySchema = z.array(updateAvailabilitySchema);
      const parsed = arraySchema.safeParse(req.body);
      if (!parsed.success) {
        throw new ValidationError('Invalid availability payload.');
      }

      const slots = await MembersService.setAvailability(req.user.id, parsed.data as any);
      sendSuccess(res, { availability: slots });
    } catch (err) {
      next(err);
    }
  }
}
