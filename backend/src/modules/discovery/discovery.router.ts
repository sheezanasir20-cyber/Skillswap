import { Router } from 'express';
import { DiscoveryController } from './discovery.controller.js';
import { authenticate } from '../../middleware/auth.js';

const router = Router();

router.get('/members/search', authenticate(true), DiscoveryController.search);

export { router as discoveryRouter };
