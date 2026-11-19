import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { inMemoryDb, UserEntity } from '../../services/db.js';
import { emailService } from '../../services/email.service.js';
import { AuditService } from '../../services/audit.service.js';
import { config } from '../../config/index.js';
import { ValidationError, UnauthorizedError, ConflictError, NotFoundError } from '../../utils/errors.js';
import { AuthUser } from '../../middleware/auth.js';

interface ResetTokenData {
  userId: string;
  expiresAt: number;
}

// In-memory token store for password resets
const resetTokens = new Map<string, ResetTokenData>();

export class AuthService {
  public static async register(data: {
    email: string;
    password: string;
    displayName: string;
    timezone?: string;
  }): Promise<{ user: Omit<UserEntity, 'passwordHash'>; token: string }> {
    const normalizedEmail = data.email.toLowerCase().trim();

    // Check if email already exists
    const existing = Array.from(inMemoryDb.users.values()).find(
      (u) => u.email.toLowerCase() === normalizedEmail
    );

    if (existing) {
      throw new ConflictError('An account with this email already exists.');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(data.password, salt);

    const user: UserEntity = {
      id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      email: normalizedEmail,
      passwordHash,
      displayName: data.displayName.trim(),
      bio: null,
      avatarUrl: null,
      timezone: data.timezone || 'UTC',
      role: 'member',
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
      lastLoginAt: new Date(),
    };

    inMemoryDb.users.set(user.id, user);

    // Send welcome email
    await emailService.sendMail({
      to: user.email,
      subject: 'Welcome to SkillSwap',
      text: `Hello ${user.displayName},\n\nWelcome to SkillSwap! Start by listing what skills you can teach and what you want to learn.`,
    });

    const tokenPayload: AuthUser = {
      id: user.id,
      email: user.email,
      role: user.role,
      status: user.status,
    };

    const token = jwt.sign(tokenPayload, config.jwtSecret, { expiresIn: '7d' });

    const { passwordHash: _, ...safeUser } = user;
    return { user: safeUser, token };
  }

  public static async login(data: {
    email: string;
    password: string;
  }): Promise<{ user: Omit<UserEntity, 'passwordHash'>; token: string }> {
    const normalizedEmail = data.email.toLowerCase().trim();

    const user = Array.from(inMemoryDb.users.values()).find(
      (u) => u.email.toLowerCase() === normalizedEmail
    );

    if (!user) {
      throw new UnauthorizedError('Invalid email or password.');
    }

    if (user.status === 'suspended') {
      throw new UnauthorizedError('Your account has been suspended by moderation.');
    }

    if (user.status === 'deleted') {
      throw new UnauthorizedError('This account no longer exists.');
    }

    const isMatch = await bcrypt.compare(data.password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedError('Invalid email or password.');
    }

    user.lastLoginAt = new Date();
    user.updatedAt = new Date();
    inMemoryDb.users.set(user.id, user);

    const tokenPayload: AuthUser = {
      id: user.id,
      email: user.email,
      role: user.role,
      status: user.status,
    };

    const token = jwt.sign(tokenPayload, config.jwtSecret, { expiresIn: '7d' });

    const { passwordHash: _, ...safeUser } = user;
    return { user: safeUser, token };
  }

  public static async forgotPassword(email: string): Promise<void> {
    const normalizedEmail = email.toLowerCase().trim();
    const user = Array.from(inMemoryDb.users.values()).find(
      (u) => u.email.toLowerCase() === normalizedEmail
    );

    // Always succeed silently to prevent user enumeration per SECURITY.md
    if (!user || user.status !== 'active') {
      return;
    }

    const resetToken = `reset-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    const expiresAt = Date.now() + 60 * 60 * 1000; // 1 hour validity

    resetTokens.set(resetToken, { userId: user.id, expiresAt });

    await emailService.sendMail({
      to: user.email,
      subject: 'Reset your SkillSwap password',
      text: `Hello ${user.displayName},\n\nYou requested a password reset. Use this token to reset your password:\n\n${resetToken}\n\nThis token will expire in 1 hour.`,
    });
  }

  public static async resetPassword(data: {
    token: string;
    newPassword: string;
  }): Promise<void> {
    const tokenInfo = resetTokens.get(data.token);
    if (!tokenInfo || tokenInfo.expiresAt < Date.now()) {
      resetTokens.delete(data.token);
      throw new ValidationError('Invalid or expired password reset token.');
    }

    const user = inMemoryDb.users.get(tokenInfo.userId);
    if (!user) {
      throw new NotFoundError('User not found.');
    }

    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(data.newPassword, salt);
    user.updatedAt = new Date();
    inMemoryDb.users.set(user.id, user);

    resetTokens.delete(data.token);

    await AuditService.log({
      actorId: user.id,
      action: 'PASSWORD_RESET',
      targetType: 'user',
      targetId: user.id,
      reason: 'Password reset completed via token',
    });
  }

  public static async getMe(userId: string): Promise<Omit<UserEntity, 'passwordHash'>> {
    const user = inMemoryDb.users.get(userId);
    if (!user) {
      throw new NotFoundError('User not found.');
    }
    const { passwordHash: _, ...safeUser } = user;
    return safeUser;
  }
}
