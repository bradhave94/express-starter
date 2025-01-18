import rateLimit from 'express-rate-limit';
import { config } from '../config';

export const createRateLimiter = (
  windowMs = config.rateLimit.windowMs,
  max = config.rateLimit.max
) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      status: 429,
      message: 'Too many requests, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false
  });
};