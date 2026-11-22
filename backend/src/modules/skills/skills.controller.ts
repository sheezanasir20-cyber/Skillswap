import { Request, Response, NextFunction } from 'express';
import { SkillsService } from './skills.service.js';
import { addSkillSchema, updateSkillSchema } from './skills.validation.js';
import { sendSuccess } from '../../utils/response.js';
import { ValidationError, UnauthorizedError } from '../../utils/errors.js';

export class SkillsController {
  public static async getCatalogue(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const q = req.query.q as string | undefined;
      const skills = await SkillsService.getCatalogue(q);
      sendSuccess(res, { skills });
    } catch (err) {
      next(err);
    }
  }

  public static async addMemberSkill(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new UnauthorizedError();
      }
      const parsed = addSkillSchema.safeParse(req.body);
      if (!parsed.success) {
        const fields: Record<string, string> = {};
        for (const issue of parsed.error.issues) {
          fields[issue.path.join('.')] = issue.message;
        }
        throw new ValidationError('Validation failed.', fields);
      }

      const created = await SkillsService.addMemberSkill(req.user.id, parsed.data as any);
      sendSuccess(res, { skill: created }, undefined, 201);
    } catch (err) {
      next(err);
    }
  }

  public static async updateMemberSkill(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new UnauthorizedError();
      }
      const { id } = req.params;
      const parsed = updateSkillSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new ValidationError('Invalid skill update data.');
      }

      const updated = await SkillsService.updateMemberSkill(req.user.id, id, parsed.data);
      sendSuccess(res, { skill: updated });
    } catch (err) {
      next(err);
    }
  }

  public static async deleteMemberSkill(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new UnauthorizedError();
      }
      const { id } = req.params;
      await SkillsService.deleteMemberSkill(req.user.id, id);
      sendSuccess(res, { message: 'Skill removed successfully.' });
    } catch (err) {
      next(err);
    }
  }
}
