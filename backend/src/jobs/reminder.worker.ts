import { inMemoryDb } from '../services/db.js';
import { NotificationsService } from '../modules/notifications/notifications.service.js';
import { emailService } from '../services/email.service.js';
import { logger } from '../utils/logger.js';

export class ReminderWorker {
  private static timer: NodeJS.Timeout | null = null;

  public static async processDueJobs(): Promise<number> {
    const now = new Date();
    let processed = 0;

    for (const job of inMemoryDb.notificationJobs.values()) {
      if (job.status !== 'pending') continue;
      if (job.runAt.getTime() > now.getTime()) continue;

      job.status = 'running';
      job.attempts += 1;

      try {
        const session = inMemoryDb.sessions.get(job.resourceId);
        if (!session || session.status !== 'confirmed') {
          // Invalidate stale reminder
          job.status = 'cancelled';
          job.updatedAt = new Date();
          inMemoryDb.notificationJobs.set(job.id, job);
          continue;
        }

        const conn = inMemoryDb.connections.get(session.connectionId);
        if (!conn) {
          job.status = 'failed';
          job.lastError = 'Connection not found';
          continue;
        }

        const user1 = inMemoryDb.users.get(conn.requesterId);
        const user2 = inMemoryDb.users.get(conn.recipientId);

        const reminderLabel = job.type === 'session_reminder_24h' ? '24 hours' : '1 hour';
        const formattedDate = session.startsAt.toLocaleString();

        const participants = [user1, user2].filter(Boolean);
        for (const p of participants) {
          if (!p) continue;

          // Send in-app notification
          await NotificationsService.create({
            userId: p.id,
            type: 'session_reminder',
            title: `Session reminder: starts in ${reminderLabel}`,
            body: `Your session "${session.title}" starts on ${formattedDate} (${session.timezone}).`,
            resourceType: 'session',
            resourceId: session.id,
          });

          // Send email notification
          await emailService.sendMail({
            to: p.email,
            subject: `Reminder: SkillSwap session starts in ${reminderLabel}`,
            text: `Hello ${p.displayName},\n\nThis is a reminder that your session "${session.title}" is scheduled to begin in ${reminderLabel} on ${formattedDate} (${session.timezone}).`,
          });
        }

        job.status = 'completed';
        job.updatedAt = new Date();
        inMemoryDb.notificationJobs.set(job.id, job);
        processed++;
      } catch (err: any) {
        job.status = 'failed';
        job.lastError = err.message || 'Worker processing error';
        job.updatedAt = new Date();
        inMemoryDb.notificationJobs.set(job.id, job);
        logger.error(`Error processing job ${job.id}: ${err.message}`);
      }
    }

    return processed;
  }

  public static start(intervalMs = 30000): void {
    if (this.timer) return;
    this.timer = setInterval(async () => {
      try {
        await this.processDueJobs();
      } catch (err: any) {
        logger.error(`Reminder worker loop error: ${err.message}`);
      }
    }, intervalMs);
    logger.info(`Reminder worker started with interval ${intervalMs}ms`);
  }

  public static stop(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
}
