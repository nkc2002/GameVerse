import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response';

export class AppError extends Error {
  statusCode: number;
  
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error('Error:', err);
  
  if (err instanceof AppError) {
    sendError(res, err.message, err.statusCode);
    return;
  }
  
  if (err.name === 'ValidationError') {
    sendError(res, err.message, 400);
    return;
  }
  
  if (err.name === 'CastError') {
    sendError(res, 'Invalid ID format', 400);
    return;
  }
  
  if ((err as NodeJS.ErrnoException).code === 11000) {
    sendError(res, 'Duplicate field value', 400);
    return;
  }
  
  sendError(res, 'Internal server error', 500, err.message);
};


