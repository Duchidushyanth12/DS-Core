import { Router } from 'express';
import { prisma } from 'database';

const router = Router();

// Safe userId extraction
const getUserId = (req: any) => {
  // Try to get from firebase auth middleware (uid) or local dev user
  const id = req.user?.id || req.user?.uid || "demo-user-id";
  console.log(`[API] Fetching patterns for user: ${id}`);
  return id;
};

// Get all learning patterns with progress and locking status
router.get('/', async (req, res) => {
  try {
    const userId = getUserId(req);
    
    // Check if patterns even exist to avoid empty map errors
    const patternsCount = await prisma.pattern.count();
    if (patternsCount === 0) {
      console.warn("[API] No patterns found in database. Please run seed.");
      return res.json([]); 
    }

    const patterns = await prisma.pattern.findMany({
      orderBy: { orderIndex: 'asc' },
      include: {
        progress: {
          where: { userId }
        }
      }
    });

    // Calculate locking status
    let previousCompleted = true;
    const enrichedPatterns = patterns.map((p) => {
      const userProgress = p.progress?.[0];
      const isFirst = p.orderIndex === 1;
      
      // Pattern is unlocked if it's the first one OR the previous one is completed
      const isUnlocked = isFirst || previousCompleted;
      
      // Update previousCompleted for next iteration
      previousCompleted = userProgress?.isCompleted || false;

      return {
        ...p,
        userProgress: userProgress || {
          completedProblems: 0,
          totalProblems: p.totalProblems,
          isCompleted: false,
          unlocked: isUnlocked
        },
        isUnlocked
      };
    });

    res.json(enrichedPatterns);
  } catch (error: any) {
    console.error("[API Error] patterns.get:", error.message);
    res.status(500).json({ error: 'Failed to fetch patterns', details: error.message });
  }
});

// Get a single pattern with its problems - ENFORCE LOCKING
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = getUserId(req);

    const pattern = await prisma.pattern.findUnique({
      where: { id },
      include: {
        problems: {
          select: {
            id: true,
            title: true,
            slug: true,
            difficulty: true,
          }
        }
      }
    });

    if (!pattern) {
      return res.status(404).json({ error: 'Pattern not found' });
    }

    // Check if unlocked
    if (pattern.orderIndex > 1) {
      const previousPattern = await prisma.pattern.findFirst({
        where: { orderIndex: pattern.orderIndex - 1 },
        include: {
          progress: { where: { userId } }
        }
      });

      const isUnlocked = previousPattern?.progress[0]?.isCompleted || false;
      if (!isUnlocked) {
        return res.status(403).json({ error: 'This pattern is locked. Complete the previous pattern to unlock.' });
      }
    }

    res.json(pattern);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch pattern' });
  }
});

export const patternsRouter = router;
