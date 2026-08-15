import { Request, Response, NextFunction } from 'express';
import { ApiError } from '@avbodh/typescript';
import { INTERNAL_API_SECRET } from '../config/env';

/**
 * Middleware to enforce Zero-Trust networking.
 * It checks if the incoming request has the correct internal secret header
 * attached by the API Gateway. If not, it blocks the request.
 */
export const internalAuthMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const secretHeader = req.headers['x-internal-secret'];

  // Ensure the secret is provided and matches the environment variable
  if (!secretHeader || secretHeader !== INTERNAL_API_SECRET) {
    console.error(`[Security Warning] Blocked direct access attempt to ${req.path}`);
    return res.status(403).json(new ApiError('Forbidden: Direct access is not allowed. All requests must go through the API Gateway.'));
  }

  next();
};
