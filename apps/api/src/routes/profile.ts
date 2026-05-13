import { Router } from 'express';
import { prisma } from 'database';
import { requireAuth, type AuthRequest } from '../middleware/auth.js';

const router = Router();

// Get current user profile
router.get('/', requireAuth, async (req, res) => {
  const authReq = req as AuthRequest;
  const firebaseUid = authReq.user.uid;

  try {
    const user = await prisma.user.findUnique({
      where: { firebaseUid },
      include: {
        submissions: {
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: { problem: true }
        },
        progress: {
          include: { pattern: true }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Fetch profile error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Update user profile
router.put('/', requireAuth, async (req, res) => {
  const authReq = req as AuthRequest;
  const firebaseUid = authReq.user.uid;
  const { username, bio, photoURL, githubUrl, linkedinUrl } = authReq.body;

  try {
    const updatedUser = await prisma.user.update({
      where: { firebaseUid },
      data: {
        username,
        // @ts-ignore
        bio: bio || null,
        photoURL: photoURL || null,
        githubUrl: githubUrl || null,
        linkedinUrl: linkedinUrl || null
      }
    });

    res.json(updatedUser);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

export const profileRouter = router;
