import { Router } from 'express';
import { ReportsController } from './reports.controller.js';
import { authenticate } from '../../middleware/auth.js';

const router = Router();

router.post('/reports', authenticate(), ReportsController.create);

export { router as reportsRouter };
