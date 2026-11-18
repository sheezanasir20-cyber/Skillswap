import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors.js';
import { sendError } from '../utils/response.js';
import { logger } from '../utils/logger.js';

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction): void {
  const requestId = (req.headers['x-request-id'] as string) || undefined;

  if (err instanceof AppError) {
    logger.warn(`Handled error [${err.code}]: ${err.message}`, {
      path: req.path,
      method: req.method,
      statusCode: err.statusCode,
      requestId,
    });
    sendError(res, err.statusCode, err.code, err.message, err.fields, requestId);
    return;
  }

  // Unhandled internal server error
  logger.error(`Unhandled error: ${err.message}`, {
    stack: err.stack,
    path: req.path,
    method: req.method,
    requestId,
  });

  // Never leak stack trace or internal database error messages to client
  sendError(
    res,
    500,
    'INTERNAL_SERVER_ERROR',
    'An unexpected error occurred. Please try again later.',
    undefined,
    requestId
  );
}
