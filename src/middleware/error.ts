import type { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';
import type { ErrorResponse } from '../interfaces/common';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error(err.message, { error: err, path: req.path });

  const errorResponse: ErrorResponse = {
    status: 500,
    message: 'Internal Server Error'
  };

  if (err instanceof Error) {
    errorResponse.message = err.message;
  }

  res.status(errorResponse.status).json({ error: errorResponse });
};