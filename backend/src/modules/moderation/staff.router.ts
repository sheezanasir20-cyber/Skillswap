import { Router } from 'express';
import { ModerationController } from './moderation.controller.js';
import { AdminController } from '../admin/admin.controller.js';
import { AnalyticsController } from '../analytics/analytics.controller.js';
import { auditRouter } from '../audit/audit.router.js';
import { authenticate, requireRole } from '../../middleware/auth.js';

const router = Router();

// All staff endpoints require authentication and staff role (moderator or admin)
router.use(authenticate());
router.use(requireRole('moderator', 'admin'));

// Moderation reports
router.get('/reports', ModerationController.getReports);
router.get('/reports/:id', ModerationController.getReportById);
router.post('/reports/:id/assign', ModerationController.assignReport);
router.post('/reports/:id/resolve', ModerationController.resolveReport);

// Member moderation actions
router.post('/members/:id/warn', ModerationController.warnMember);
router.post('/members/:id/suspend', ModerationController.suspendMember);

// Staff members list
router.get('/members', AdminController.listMembers);

// Admin-only member management (role elevation, status changes)
router.patch('/members/:id', requireRole('admin'), AdminController.updateMember);

// Staff analytics
router.get('/analytics', AnalyticsController.getAnalytics);

// Staff activity logs — restricted to Administrator per SRS UC-16
router.use('/', requireRole('admin'), auditRouter);

export { router as staffRouter };
