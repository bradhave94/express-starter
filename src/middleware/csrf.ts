import type { Request, Response, NextFunction } from 'express';
import crypto from 'node:crypto';
import { config } from '../config';

// Store for valid tokens (in production, use Redis or similar)
const validTokens = new Set<string>();

export const generateToken = () => {
  const token = crypto.randomBytes(32).toString('hex');
  validTokens.add(token);
  return token;
};

export const csrfProtection = (req: Request, res: Response, next: NextFunction) => {
  const origin = req.headers.origin;
  
  // Only proceed if origin is in allowed list
  if (!origin || !config.cors.origins.includes(origin)) {
    return res.status(403).json({
      success: false,
      error: {
        status: 403,
        message: 'Origin not allowed'
      }
    });
  }

  // Skip token check for GET requests, but only issue tokens to allowed origins
  if (req.method === 'GET') {
    const token = generateToken();
    res.setHeader('X-CSRF-Token', token);
    return next();
  }

  const token = req.headers['x-csrf-token'] as string;
  
  if (!token || !validTokens.has(token)) {
    return res.status(403).json({
      success: false,
      error: {
        status: 403,
        message: 'Invalid or missing CSRF token'
      }
    });
  }

  // Remove used token
  validTokens.delete(token);
  next();
}; 