type LogLevel = 'info' | 'warn' | 'error' | 'debug';

function formatLog(level: LogLevel, message: string, meta?: Record<string, any>) {
  const timestamp = new Date().toISOString();
  const safeMeta = meta ? { ...meta } : undefined;
  if (safeMeta) {
    // Sanitize sensitive values
    delete safeMeta.password;
    delete safeMeta.passwordHash;
    delete safeMeta.token;
    delete safeMeta.jwt;
    delete safeMeta.cookie;
  }
  return JSON.stringify({
    timestamp,
    level,
    message,
    ...(safeMeta ? { meta: safeMeta } : {}),
  });
}

export const logger = {
  info: (message: string, meta?: Record<string, any>) => console.log(formatLog('info', message, meta)),
  warn: (message: string, meta?: Record<string, any>) => console.warn(formatLog('warn', message, meta)),
  error: (message: string, meta?: Record<string, any>) => console.error(formatLog('error', message, meta)),
  debug: (message: string, meta?: Record<string, any>) => console.debug(formatLog('debug', message, meta)),
};
