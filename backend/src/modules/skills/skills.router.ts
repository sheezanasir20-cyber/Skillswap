import { Router } from 'express';
import { SkillsController } from './skills.controller.js';
import { authenticate } from '../../middleware/auth.js';

const router = Router();

// Public / Authenticated skills catalogue
router.get('/skills', SkillsController.getCatalogue);

// Member skills management
router.post('/members/me/skills', authenticate(), SkillsController.addMemberSkill);
router.patch('/members/me/skills/:id', authenticate(), SkillsController.updateMemberSkill);
router.delete('/members/me/skills/:id', authenticate(), SkillsController.deleteMemberSkill);

export { router as skillsRouter };
