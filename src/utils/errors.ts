import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import logger from './logger';

export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public code: string,
    public errors?: Array<{ field: string; message: string }>
  ) {
    super(message);
    this.name = 'ApiError';
  }

  static badRequest(message: string, code = 'BAD_REQUEST', errors?: Array<{ field: string; message: string }>) {
    return new ApiError(400, message, code, errors);
  }

  static unauthorized(message = 'Unauthorized', code = 'UNAUTHORIZED') {
    return new ApiError(401, message, code);
  }

  static forbidden(message = 'Forbidden', code = 'FORBIDDEN') {
    return new ApiError(403, message, code);
  }

  static notFound(message = 'Resource not found', code = 'NOT_FOUND') {
    return new ApiError(404, message, code);
  }

  static tooManyRequests(message = 'Too many requests', code = 'RATE_LIMIT_EXCEEDED') {
    return new ApiError(429, message, code);
  }

  static internal(message = 'Internal server error', code = 'INTERNAL_ERROR') {
    return new ApiError(500, message, code);
  }

  toResponse() {
    return {
      success: false as const,
      error: {
        status: this.status,
        code: this.code,
        message: this.message,
        ...(this.errors && { errors: this.errors })
      }
    };
  }
}

export class ValidationError extends ApiError {
  constructor(errors: Array<{ field: string; message: string }>) {
    super(400, 'Validation failed', 'VALIDATION_ERROR', errors);
    this.name = 'ValidationError';
  }
}

export class RateLimitError extends ApiError {
  constructor(message = 'Rate limit exceeded', code = 'RATE_LIMIT_EXCEEDED') {
    super(429, message, code);
    this.name = 'RateLimitError';
  }
}

// Error handler middleware
export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error('Error:', {
    error: error.message,
    stack: error.stack,
    path: req.path,
    method: req.method,
    requestId: req.headers['x-request-id']
  });

  // Handle Zod validation errors
  if (error instanceof ZodError) {
    const validationError = new ValidationError(
      error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }))
    );
    return res.status(validationError.status).json(validationError.toResponse());
  }

  // Handle known API errors
  if (error instanceof ApiError) {
    return res.status(error.status).json(error.toResponse());
  }

  // Handle unknown errors
  const internalError = ApiError.internal();
  return res.status(internalError.status).json(internalError.toResponse());
};
