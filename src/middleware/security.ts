import type { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import xss from 'xss';

// Define types for our data structures
export type JsonPrimitive = string | number | boolean | null;
export type JsonArray = JsonValue[];
export type JsonObject = { [key: string]: JsonValue };
export type JsonValue = JsonPrimitive | JsonObject | JsonArray;

// Security Configuration
export const securityConfig = {
  rateLimit: {
    windowMs: 10 * 1000,      // 10 seconds
    maxRequests: 100,         // 100 requests per 10 seconds
    message: {
      success: false,
      error: {
        status: 429,
        message: 'Too many requests, please try again in a few seconds.'
      }
    }
  },
  sanitization: {
    enabled: true,
    xssOptions: {
      whiteList: {},          // No tags allowed
      stripIgnoreTag: true,   // Strip tags not in whitelist
      stripIgnoreTagBody: ['script']  // Remove content of script tags
    }
  }
};

// Rate limiting middleware
export const formLimiter = rateLimit({
  windowMs: securityConfig.rateLimit.windowMs,
  max: securityConfig.rateLimit.maxRequests,
  message: securityConfig.rateLimit.message
});

// Sanitize response data
export const sanitizeResponse = (req: Request, res: Response, next: NextFunction) => {
  if (!securityConfig.sanitization.enabled) {
    next();
    return;
  }

  const originalJson = res.json;
  res.json = function (data: JsonValue) {
    const sanitized = sanitizeData(data);
    return originalJson.call(this, sanitized);
  };
  next();
};

// Helper function to recursively sanitize data
const sanitizeData = (data: JsonValue): JsonValue => {
  if (typeof data === 'string') {
    return xss(data, securityConfig.sanitization.xssOptions);
  }
  if (Array.isArray(data)) {
    return data.map(item => sanitizeData(item));
  }
  if (data && typeof data === 'object') {
    const sanitized: JsonObject = {};
    for (const key in data) {
      sanitized[key] = sanitizeData(data[key]);
    }
    return sanitized;
  }
  return data;
}; 