import dotenv from 'dotenv';
dotenv.config();

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '4000', 10),
  appOrigin: process.env.APP_ORIGIN || 'http://localhost:3000',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  databaseUrl: process.env.DATABASE_URL || 'postgresql://skillswap:skillswap_secret@localhost:5432/skillswap_db?schema=public',
  jwtSecret: process.env.JWT_SECRET || 'skillswap_secure_jwt_secret_token_key_development_32chars!',
  sessionSecret: process.env.SESSION_SECRET || 'skillswap_secure_session_secret_key_development_32chars!',
  cookieSecret: process.env.COOKIE_SECRET || 'skillswap_cookie_secret_32_chars_development!',
  emailProvider: process.env.EMAIL_PROVIDER || 'mock',
  reminderIntervalMs: parseInt(process.env.REMINDER_INTERVAL_MS || '30000', 10),
  logLevel: process.env.LOG_LEVEL || 'info',
};
