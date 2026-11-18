import { logger } from '../utils/logger.js';

export interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

export interface SentEmailRecord extends EmailOptions {
  id: string;
  sentAt: Date;
}

class EmailService {
  private sentMails: SentEmailRecord[] = [];

  public async sendMail(options: EmailOptions): Promise<boolean> {
    const record: SentEmailRecord = {
      ...options,
      id: `mail-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      sentAt: new Date(),
    };

    this.sentMails.push(record);

    logger.info(`[Email Service] Sent email to: ${options.to} - Subject: ${options.subject}`, {
      mailId: record.id,
      to: options.to,
      subject: options.subject,
    });

    return true;
  }

  public getSentEmails(): SentEmailRecord[] {
    return [...this.sentMails];
  }

  public getEmailsFor(email: string): SentEmailRecord[] {
    return this.sentMails.filter((m) => m.to.toLowerCase() === email.toLowerCase());
  }

  public clearSentEmails(): void {
    this.sentMails = [];
  }
}

export const emailService = new EmailService();
