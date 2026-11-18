import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import { UnauthorizedError, ForbiddenError } from '../utils/errors.js';

export interface AuthUser {
  id: string;
  email: string;
  role: 'member' | 'moderator' | 'admin';
  status: 'active' | 'suspended' | 'deleted' | 'pending_verification';
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
      token?: string;
    }
  }
}

export function authenticate(optional = false) {
  return (req: Request, res: Response, next: NextFunction) => {
    let token: string | undefined;

    // 1. Check Authorization Bearer header
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }
    // 2. Check signed or unsigned cookie
    else if (req.cookies && req.cookies.skillswap_token) {
      token = req.cookies.skillswap_token;
    }

    if (!token) {
      if (optional) {
        return next();
      }
      return next(new UnauthorizedError('Please log in to continue.'));
    }

    try {
      const decoded = jwt.verify(token, config.jwtSecret) as AuthUser;
      
      // Suspended or deleted members are denied access to standard member actions
      if (decoded.status === 'suspended') {
        return next(new ForbiddenError('Your account has been suspended by moderation.'));
      }
      if (decoded.status === 'deleted') {
        return next(new UnauthorizedError('This account no longer exists.'));
      }

      req.user = decoded;
      req.token = token;
      next();
    } catch (err) {
      if (optional) {
        return next();
      }
      return next(new UnauthorizedError('Session expired or invalid. Please sign in again.'));
    }
  };
}

export function requireRole(...allowedRoles: Array<'member' | 'moderator' | 'admin'>) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new UnauthorizedError());
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new ForbiddenError('You do not have permission to access this area.'));
    }

    next();
  };
}
