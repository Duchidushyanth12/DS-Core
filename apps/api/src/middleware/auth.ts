import type { Request, Response, NextFunction } from 'express';
import { prisma } from 'database';

// Mock auth for local development
export interface AuthRequest extends Request {
  user?: any;
}

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  const mockUser = { uid: 'local-test-user', email: 'test@example.com' };
  
  // Ensure mock user exists in DB for local testing
  try {
    await prisma.user.upsert({
      where: { firebaseUid: mockUser.uid },
      update: {},
      create: {
        firebaseUid: mockUser.uid,
        email: mockUser.email,
        username: 'Test User'
      }
    });
  } catch (error) {
    console.error('Failed to sync mock user:', error);
  }

  (req as AuthRequest).user = mockUser;
  next();
};
