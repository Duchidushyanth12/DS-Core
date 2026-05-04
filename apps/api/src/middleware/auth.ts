import type { Request, Response, NextFunction } from 'express';

// Mock auth for local development
export interface AuthRequest extends Request {
  user?: any;
}

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  (req as AuthRequest).user = { uid: 'local-test-user', email: 'test@example.com' };
  next();
};
