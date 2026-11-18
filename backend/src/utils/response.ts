import { Response } from 'express';

export interface ApiResponse<T = any> {
  data: T;
  meta?: Record<string, any>;
}

export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    fields?: Record<string, string>;
    requestId?: string;
  };
}

export function sendSuccess<T>(res: Response, data: T, meta?: Record<string, any>, statusCode = 200): Response {
  const payload: ApiResponse<T> = { data };
  if (meta) {
    payload.meta = meta;
  }
  return res.status(statusCode).json(payload);
}

export function sendError(
  res: Response,
  statusCode: number,
  code: string,
  message: string,
  fields?: Record<string, string>,
  requestId?: string
): Response {
  const payload: ApiErrorResponse = {
    error: {
      code,
      message,
      ...(fields ? { fields } : {}),
      ...(requestId ? { requestId } : {}),
    },
  };
  return res.status(statusCode).json(payload);
}
