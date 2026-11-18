import express, { Express, Request, Response, NextFunction } from 'express';
import http from 'http';
import path from 'path';
import fs from 'fs';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { config } from './config/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import { initSocketIO } from './realtime/socket.handler.js';
import { authRouter } from './modules/auth/auth.router.js';
import { membersRouter } from './modules/members/members.router.js';
import { skillsRouter } from './modules/skills/skills.router.js';
import { matchingRouter } from './modules/matching/matching.router.js';
import { discoveryRouter } from './modules/discovery/discovery.router.js';
import { connectionsRouter } from './modules/connections/connections.router.js';
import { messagingRouter } from './modules/messaging/messaging.router.js';
import { sessionsRouter } from './modules/sessions/sessions.router.js';
import { reviewsRouter } from './modules/reviews/reviews.router.js';
import { reportsRouter } from './modules/reports/reports.router.js';
import { notificationsRouter } from './modules/notifications/notifications.router.js';
import { staffRouter } from './modules/moderation/staff.router.js';
import { ReminderWorker } from './jobs/reminder.worker.js';
import { logger } from './utils/logger.js';

export function createApp(): { app: Express; server: http.Server } {
  const app = express();
  const server = http.createServer(app);

  // Initialize WebSockets
  initSocketIO(server);

  // Security & parsing middleware
  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(
    cors({
      origin: config.corsOrigin,
      credentials: true,
    })
  );
  app.use(cookieParser(config.cookieSecret));
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));

  // Health check endpoint
  app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // REST API v1 routes per API.md
  app.use('/api/v1/auth', authRouter);
  app.use('/api/v1/members', membersRouter);
  app.use('/api/v1', skillsRouter);
  app.use('/api/v1', matchingRouter);
  app.use('/api/v1', discoveryRouter);
  app.use('/api/v1', connectionsRouter);
  app.use('/api/v1', messagingRouter);
  app.use('/api/v1', sessionsRouter);
  app.use('/api/v1', reviewsRouter);
  app.use('/api/v1', reportsRouter);
  app.use('/api/v1', notificationsRouter);
  app.use('/api/v1/staff', staffRouter);

  // Serve frontend static assets if dist exists
  const rootDir = process.cwd();
  const frontendDist = path.join(rootDir, 'frontend', 'dist');
  if (fs.existsSync(frontendDist)) {
    app.use(express.static(frontendDist));
    app.get('*', (req: Request, res: Response, next: NextFunction) => {
      if (req.path.startsWith('/api') || req.path === '/health') {
        return next();
      }
      res.sendFile(path.join(frontendDist, 'index.html'));
    });
  }

  // Centralized Error Handling
  app.use(errorHandler);

  return { app, server };
}

// Start standalone server when executed directly
if (process.env.NODE_ENV !== 'test') {
  const { server } = createApp();
  ReminderWorker.start(config.reminderIntervalMs);

  server.listen(config.port, () => {
    logger.info(`SkillSwap API Server listening on port ${config.port} in ${config.env} mode`);
  });
}
