import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ApiError } from '@avbodh/typescript';
import { AUTHSERVICEURL, JWT_SECERTS } from '../config/env';
export const verifyJwtMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json(new ApiError('Unauthorized: No token provided'));
    return;
  }

  const token = authHeader.split(' ')[1];
  const secret = JWT_SECERTS || 'super-secret-default-key';

  try {
    const decoded = jwt.verify(token, secret) as any;
    (req as any).user = decoded;
    next();
  } catch (err: any) {
    if (err.name === 'TokenExpiredError') {
      try {
        const refreshToken =
          req.headers['x-refresh-token'] || req.cookies?.refreshToken;

        if (!refreshToken) {
          res
            .status(401)
            .json(
              new ApiError(
                'Unauthorized: Token expired. No refresh token provided.',
              ),
            );
          return;
        }

        const authServiceUrl = `${AUTHSERVICEURL}/refresh`;
        const refreshResponse = await fetch(authServiceUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken }),
        });

        if (!refreshResponse.ok) {
          res
            .status(401)
            .json(
              new ApiError(
                'Unauthorized: Refresh token failed. Please login again.',
              ),
            );
          return;
        }

        const data = await refreshResponse.json();
        const newAccessToken = data.accessToken;

        const newDecoded = jwt.verify(newAccessToken, secret) as any;
        (req as any).user = newDecoded;

        res.setHeader('x-new-access-token', newAccessToken);
        req.headers.authorization = `Bearer ${newAccessToken}`;

        next();
      } catch (refreshErr) {
        res
          .status(401)
          .json(
            new ApiError(
              'Unauthorized: Could not reach auth service to refresh token',
            ),
          );
        return;
      }
    } else {
      res.status(401).json(new ApiError('Unauthorized: Invalid token'));
      return;
    }
  }
};
