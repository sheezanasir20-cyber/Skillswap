import { describe, it, expect, beforeEach } from 'vitest';
import { authenticate, requireRole } from '../../backend/src/middleware/auth.js';
import { inMemoryDb } from '../../backend/src/services/db.js';
import jwt from 'jsonwebtoken';
import { config } from '../../backend/src/config/index.js';

describe('White-Box Testing: Role-Based Access Control (RBAC) & Route Security', () => {
  const memberUser = {
    id: 'user-member-1',
    email: 'member@test.com',
    passwordHash: 'hash',
    displayName: 'Regular Member',
    bio: null,
    avatarUrl: null,
    timezone: 'UTC',
    role: 'member' as const,
    status: 'active' as const,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const modUser = {
    id: 'user-mod-1',
    email: 'mod@test.com',
    passwordHash: 'hash',
    displayName: 'Moderator Staff',
    bio: null,
    avatarUrl: null,
    timezone: 'UTC',
    role: 'moderator' as const,
    status: 'active' as const,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const adminUser = {
    id: 'user-admin-1',
    email: 'admin@test.com',
    passwordHash: 'hash',
    displayName: 'System Admin',
    bio: null,
    avatarUrl: null,
    timezone: 'UTC',
    role: 'admin' as const,
    status: 'active' as const,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const suspendedUser = {
    id: 'user-suspended-1',
    email: 'suspended@test.com',
    passwordHash: 'hash',
    displayName: 'Suspended Member',
    bio: null,
    avatarUrl: null,
    timezone: 'UTC',
    role: 'member' as const,
    status: 'suspended' as const,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const deletedUser = {
    id: 'user-deleted-1',
    email: 'deleted@test.com',
    passwordHash: 'hash',
    displayName: 'Deleted Member',
    bio: null,
    avatarUrl: null,
    timezone: 'UTC',
    role: 'member' as const,
    status: 'deleted' as const,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    inMemoryDb.clearAll();
    inMemoryDb.users.set(memberUser.id, memberUser);
    inMemoryDb.users.set(modUser.id, modUser);
    inMemoryDb.users.set(adminUser.id, adminUser);
    inMemoryDb.users.set(suspendedUser.id, suspendedUser);
    inMemoryDb.users.set(deletedUser.id, deletedUser);
  });

  const createMockReqRes = (authHeader?: string, cookieToken?: string) => {
    const req: any = {
      headers: {
        authorization: authHeader,
      },
      cookies: {
        skillswap_token: cookieToken,
      },
    };

    let statusCode = 200;
    let jsonBody: any = null;

    const res: any = {
      status(code: number) {
        statusCode = code;
        return this;
      },
      json(data: any) {
        jsonBody = data;
        return this;
      },
    };

    return { req, res, getStatus: () => statusCode, getBody: () => jsonBody };
  };

  describe('1. Authentication Middleware Verification', () => {
    it('rejects requests with no authorization header and no cookie with UnauthorizedError', async () => {
      const { req, res } = createMockReqRes();
      let capturedError: any = null;

      const authMiddleware = authenticate();
      authMiddleware(req, res, (err?: any) => {
        capturedError = err;
      });

      expect(capturedError).toBeDefined();
      expect(capturedError.statusCode).toBe(401);
      expect(capturedError.code).toBe('UNAUTHORIZED');
    });

    it('rejects requests with malformed Bearer token with UnauthorizedError', async () => {
      const { req, res } = createMockReqRes('Bearer invalid-token-string');
      let capturedError: any = null;

      const authMiddleware = authenticate();
      authMiddleware(req, res, (err?: any) => {
        capturedError = err;
      });

      expect(capturedError).toBeDefined();
      expect(capturedError.statusCode).toBe(401);
      expect(capturedError.code).toBe('UNAUTHORIZED');
    });

    it('accepts valid Authorization Bearer header and attaches auth user to request', async () => {
      const token = jwt.sign(
        { id: memberUser.id, email: memberUser.email, role: memberUser.role, status: memberUser.status },
        config.jwtSecret,
        { expiresIn: '1h' }
      );

      const { req, res } = createMockReqRes(`Bearer ${token}`);
      let nextCalled = false;

      const authMiddleware = authenticate();
      authMiddleware(req, res, (err?: any) => {
        if (!err) nextCalled = true;
      });

      expect(nextCalled).toBe(true);
      expect(req.user).toBeDefined();
      expect(req.user?.id).toBe(memberUser.id);
      expect(req.user?.role).toBe('member');
    });

    it('accepts valid HttpOnly cookie token and attaches auth user to request', async () => {
      const token = jwt.sign(
        { id: adminUser.id, email: adminUser.email, role: adminUser.role, status: adminUser.status },
        config.jwtSecret,
        { expiresIn: '1h' }
      );

      const { req, res } = createMockReqRes(undefined, token);
      let nextCalled = false;

      const authMiddleware = authenticate();
      authMiddleware(req, res, (err?: any) => {
        if (!err) nextCalled = true;
      });

      expect(nextCalled).toBe(true);
      expect(req.user?.id).toBe(adminUser.id);
      expect(req.user?.role).toBe('admin');
    });

    it('blocks suspended accounts with ForbiddenError', async () => {
      const token = jwt.sign(
        { id: suspendedUser.id, email: suspendedUser.email, role: suspendedUser.role, status: 'suspended' },
        config.jwtSecret,
        { expiresIn: '1h' }
      );

      const { req, res } = createMockReqRes(`Bearer ${token}`);
      let capturedError: any = null;

      const authMiddleware = authenticate();
      authMiddleware(req, res, (err?: any) => {
        capturedError = err;
      });

      expect(capturedError).toBeDefined();
      expect(capturedError.statusCode).toBe(403);
      expect(capturedError.code).toBe('FORBIDDEN');
      expect(capturedError.message).toContain('suspended');
    });

    it('blocks deleted accounts with UnauthorizedError', async () => {
      const token = jwt.sign(
        { id: deletedUser.id, email: deletedUser.email, role: deletedUser.role, status: 'deleted' },
        config.jwtSecret,
        { expiresIn: '1h' }
      );

      const { req, res } = createMockReqRes(`Bearer ${token}`);
      let capturedError: any = null;

      const authMiddleware = authenticate();
      authMiddleware(req, res, (err?: any) => {
        capturedError = err;
      });

      expect(capturedError).toBeDefined();
      expect(capturedError.statusCode).toBe(401);
      expect(capturedError.code).toBe('UNAUTHORIZED');
    });
  });

  describe('2. Role-Based Authorization (requireRole) Gates', () => {
    it('permits member on member-accessible route', () => {
      const { req, res } = createMockReqRes();
      req.user = { id: memberUser.id, email: memberUser.email, role: 'member', status: 'active' };

      let nextCalled = false;
      const middleware = requireRole('member', 'moderator', 'admin');
      middleware(req, res, (err?: any) => {
        if (!err) nextCalled = true;
      });

      expect(nextCalled).toBe(true);
    });

    it('blocks regular member from moderator routes with ForbiddenError', () => {
      const { req, res } = createMockReqRes();
      req.user = { id: memberUser.id, email: memberUser.email, role: 'member', status: 'active' };

      let capturedError: any = null;
      const middleware = requireRole('moderator', 'admin');
      middleware(req, res, (err?: any) => {
        capturedError = err;
      });

      expect(capturedError).toBeDefined();
      expect(capturedError.statusCode).toBe(403);
      expect(capturedError.code).toBe('FORBIDDEN');
    });

    it('permits moderator on moderator routes', () => {
      const { req, res } = createMockReqRes();
      req.user = { id: modUser.id, email: modUser.email, role: 'moderator', status: 'active' };

      let nextCalled = false;
      const middleware = requireRole('moderator', 'admin');
      middleware(req, res, (err?: any) => {
        if (!err) nextCalled = true;
      });

      expect(nextCalled).toBe(true);
    });

    it('blocks moderator from admin-only routes with ForbiddenError', () => {
      const { req, res } = createMockReqRes();
      req.user = { id: modUser.id, email: modUser.email, role: 'moderator', status: 'active' };

      let capturedError: any = null;
      const middleware = requireRole('admin');
      middleware(req, res, (err?: any) => {
        capturedError = err;
      });

      expect(capturedError).toBeDefined();
      expect(capturedError.statusCode).toBe(403);
      expect(capturedError.code).toBe('FORBIDDEN');
    });

    it('permits administrator on admin-only routes', () => {
      const { req, res } = createMockReqRes();
      req.user = { id: adminUser.id, email: adminUser.email, role: 'admin', status: 'active' };

      let nextCalled = false;
      const middleware = requireRole('admin');
      middleware(req, res, (err?: any) => {
        if (!err) nextCalled = true;
      });

      expect(nextCalled).toBe(true);
    });
  });
});
