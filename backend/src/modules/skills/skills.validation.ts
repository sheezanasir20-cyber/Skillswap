import { z } from 'zod';

export const addSkillSchema = z.object({
  skillId: z.string().optional(),
  name: z.string().min(2, 'Skill name must be at least 2 characters.').max(50).trim().optional(),
  category: z.string().max(50).optional(),
  intent: z.enum(['teach', 'learn'], {
    errorMap: () => ({ message: 'Intent must be either "teach" or "learn".' }),
  }),
  level: z.enum(['beginner', 'intermediate', 'advanced'], {
    errorMap: () => ({ message: 'Level must be "beginner", "intermediate", or "advanced".' }),
  }),
}).refine((data) => data.skillId || data.name, {
  message: 'Either skillId or name must be provided.',
  path: ['name'],
});

export const updateSkillSchema = z.object({
  level: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  intent: z.enum(['teach', 'learn']).optional(),
});
