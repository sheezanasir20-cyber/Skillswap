import { describe, it, expect, beforeEach } from 'vitest';
import { AuthService } from '../../backend/src/modules/auth/auth.service.js';
import { inMemoryDb } from '../../backend/src/services/db.js';
import { emailService } from '../../backend/src/services/email.service.js';
import { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } from '../../backend/src/modules/auth/auth.validation.js';

describe('White-Box Testing: Authentication Logic & Validation', () => {
  beforeEach(() => {
    inMemoryDb.clearAll();
    emailService.clearSentEmails();
  });

  describe('1. Registration Statements, Branches & Boundaries', () => {
    it('executes successful registration path and hashes password', async () => {
      const result = await AuthService.register({
        email: 'alice@example.com',
        password: 'Password123!',
        displayName: 'Alice Engineer',
        timezone: 'UTC',
      });

      expect(result.user).toBeDefined();
      expect(result.user.email).toBe('alice@example.com');
      expect(result.user.displayName).toBe('Alice Engineer');
      expect(result.user.role).toBe('member');
      expect(result.user.status).toBe('active');
      expect(result.token).toBeTypeOf('string');

      // Verify password is not exposed in returned safe user
      expect((result.user as any).passwordHash).toBeUndefined();

      // Verify user persisted in database with bcrypt hash
      const stored = inMemoryDb.users.get(result.user.id);
      expect(stored).toBeDefined();
      expect(stored?.passwordHash).not.toBe('Password123!');
      expect(stored?.passwordHash.startsWith('$2')).toBe(true);

      // Verify welcome email triggered
      const emails = emailService.getEmailsFor('alice@example.com');
      expect(emails.length).toBe(1);
      expect(emails[0].subject).toContain('Welcome to SkillSwap');
    });

    it('branches to ConflictError when registering with existing email (case-insensitive)', async () => {
      await AuthService.register({
        email: 'duplicate@example.com',
        password: 'Password123!',
        displayName: 'First User',
      });

      // Branch check: duplicate lowercase
      await expect(
        AuthService.register({
          email: 'DUPLICATE@EXAMPLE.COM',
          password: 'Password456!',
          displayName: 'Second User',
        })
      ).rejects.toThrow('An account with this email already exists.');
    });

    it('tests register schema validation boundaries', () => {
      // Empty email
      expect(registerSchema.safeParse({ email: '', password: 'Password123!', displayName: 'Test' }).success).toBe(false);
      // Invalid email
      expect(registerSchema.safeParse({ email: 'not-an-email', password: 'Password123!', displayName: 'Test' }).success).toBe(false);
      // Short password (< 8 chars)
      expect(registerSchema.safeParse({ email: 'a@b.com', password: '123', displayName: 'Test' }).success).toBe(false);
      // Display name too short (< 2 chars)
      expect(registerSchema.safeParse({ email: 'a@b.com', password: 'Password123!', displayName: 'A' }).success).toBe(false);
      // Display name too long (> 60 chars)
      const longName = 'A'.repeat(61);
      expect(registerSchema.safeParse({ email: 'a@b.com', password: 'Password123!', displayName: longName }).success).toBe(false);
      // Valid boundary
      expect(registerSchema.safeParse({ email: 'valid@example.com', password: 'Password123!', displayName: 'Valid User' }).success).toBe(true);
    });
  });

  describe('2. Login Paths, Conditions & Security Gates', () => {
    beforeEach(async () => {
      await AuthService.register({
        email: 'member@example.com',
        password: 'CorrectPassword123!',
        displayName: 'Member Test',
      });
    });

    it('executes successful login path and returns valid token', async () => {
      const result = await AuthService.login({
        email: 'member@example.com',
        password: 'CorrectPassword123!',
      });

      expect(result.user.email).toBe('member@example.com');
      expect(result.token).toBeTypeOf('string');
      expect(result.user.lastLoginAt).toBeDefined();
    });

    it('branches to UnauthorizedError on non-existent email', async () => {
      await expect(
        AuthService.login({
          email: 'unknown@example.com',
          password: 'SomePassword!',
        })
      ).rejects.toThrow('Invalid email or password.');
    });

    it('branches to UnauthorizedError on incorrect password', async () => {
      await expect(
        AuthService.login({
          email: 'member@example.com',
          password: 'WrongPassword!',
        })
      ).rejects.toThrow('Invalid email or password.');
    });

    it('branches to UnauthorizedError when account status is suspended', async () => {
      const user = Array.from(inMemoryDb.users.values()).find((u) => u.email === 'member@example.com')!;
      user.status = 'suspended';
      inMemoryDb.users.set(user.id, user);

      await expect(
        AuthService.login({
          email: 'member@example.com',
          password: 'CorrectPassword123!',
        })
      ).rejects.toThrow('Your account has been suspended by moderation.');
    });

    it('branches to UnauthorizedError when account status is deleted', async () => {
      const user = Array.from(inMemoryDb.users.values()).find((u) => u.email === 'member@example.com')!;
      user.status = 'deleted';
      inMemoryDb.users.set(user.id, user);

      await expect(
        AuthService.login({
          email: 'member@example.com',
          password: 'CorrectPassword123!',
        })
      ).rejects.toThrow('This account no longer exists.');
    });
  });

  describe('3. Password Reset Flow & Account Enumeration Protection', () => {
    it('executes forgotPassword for registered member and sends reset token email', async () => {
      await AuthService.register({
        email: 'resetme@example.com',
        password: 'OldPassword123!',
        displayName: 'Reset User',
      });

      await AuthService.forgotPassword('resetme@example.com');

      const emails = emailService.getEmailsFor('resetme@example.com');
      const resetMail = emails.find((m) => m.subject.includes('Reset your SkillSwap password'));
      expect(resetMail).toBeDefined();
      expect(resetMail?.text).toContain('reset-');
    });

    it('prevents account enumeration by silently succeeding on unknown email', async () => {
      await expect(AuthService.forgotPassword('nonexistent@example.com')).resolves.not.toThrow();
      const emails = emailService.getEmailsFor('nonexistent@example.com');
      expect(emails.length).toBe(0);
    });

    it('executes password reset with valid token and rejects expired/invalid token', async () => {
      await AuthService.register({
        email: 'target@example.com',
        password: 'OldPassword123!',
        displayName: 'Target User',
      });

      await AuthService.forgotPassword('target@example.com');
      const emails = emailService.getEmailsFor('target@example.com');
      const resetMail = emails.find((m) => m.subject.includes('Reset your SkillSwap password'))!;
      const match = resetMail.text.match(/reset-[a-z0-9-]+/);
      const token = match![0];

      // Reset password successfully
      await AuthService.resetPassword({
        token,
        newPassword: 'BrandNewPassword123!',
      });

      // Login with new password succeeds
      const loginRes = await AuthService.login({
        email: 'target@example.com',
        password: 'BrandNewPassword123!',
      });
      expect(loginRes.user.email).toBe('target@example.com');

      // Attempting to reuse the same reset token is rejected
      await expect(
        AuthService.resetPassword({
          token,
          newPassword: 'AnotherPassword123!',
        })
      ).rejects.toThrow('Invalid or expired password reset token.');
    });
  });

  describe('4. getMe Profile Retrieval', () => {
    it('returns safe user object for existing user', async () => {
      const reg = await AuthService.register({
        email: 'testme@example.com',
        password: 'Password123!',
        displayName: 'Test Me',
      });

      const me = await AuthService.getMe(reg.user.id);
      expect(me.id).toBe(reg.user.id);
      expect((me as any).passwordHash).toBeUndefined();
    });

    it('throws NotFoundError for non-existent user ID', async () => {
      await expect(AuthService.getMe('invalid-id')).rejects.toThrow('User not found.');
    });
  });
});
