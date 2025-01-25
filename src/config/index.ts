import { cleanEnv, str, num } from 'envalid';

// Use Bun's built-in .env handling
const env = cleanEnv(Bun.env, {
  NODE_ENV: str({ choices: ['development', 'test', 'production'], default: 'development' }),
  PORT: num({ default: 3000 }),
  ALLOWED_ORIGINS: str({ default: 'http://localhost:3000' }),
  ADDITIONAL_ORIGINS: str({ default: '' }),
  RATE_LIMIT_WINDOW_MS: num({ default: 900000 }), // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: num({ default: 100 })
});

const getAllowedOrigins = (): string[] => {
  const baseOrigins = env.ALLOWED_ORIGINS.split(',');
  const additionalOrigins = env.ADDITIONAL_ORIGINS ? env.ADDITIONAL_ORIGINS.split(',') : [];
  return [...baseOrigins, ...additionalOrigins].filter(origin => origin.length > 0);
};

export const config = {
  env: env.NODE_ENV,
  port: env.PORT,
  cors: {
    origins: getAllowedOrigins(),
    credentials: true
  },
  rateLimit: {
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    max: env.RATE_LIMIT_MAX_REQUESTS
  }
};