import type { Request, Response, NextFunction } from 'express';
import { config } from '../config';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  // Log the error with request context
  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method
  });

  res.status(500).json({
    success: false,
    error: {
      message: config.env === 'development' ? err.message : 'Internal Server Error'
    }
  });
};