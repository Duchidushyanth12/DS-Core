import { Router } from 'express';
import { prisma } from 'database';
const router = Router();
// Sync Firebase user with Prisma database
router.post('/sync', async (req, res) => {
    const { uid, email, username, photoURL } = req.body;
    if (!uid || !email) {
        return res.status(400).json({ error: 'Missing required user information' });
    }
    try {
        const user = await prisma.user.upsert({
            where: { firebaseUid: uid },
            update: {
                email,
                username: username || email.split('@')[0],
            },
            create: {
                firebaseUid: uid,
                email,
                username: username || email.split('@')[0],
            },
        });
        res.json(user);
    }
    catch (error) {
        console.error('[Auth Sync Error]:', error.message);
        res.status(500).json({ error: 'Failed to sync user', details: error.message });
    }
});
export const authRouter = router;
//# sourceMappingURL=auth.js.map