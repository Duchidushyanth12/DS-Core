import { Router } from 'express';
import { prisma } from 'database';

const router = Router();

// Get all problems (with optional pattern filter)
router.get('/', async (req, res) => {
  try {
    const { patternId } = req.query;
    const where = patternId ? { patternId: String(patternId) } : {};
    
    const problems = await prisma.problem.findMany({
      where,
      select: {
        id: true,
        title: true,
        slug: true,
        difficulty: true,
        pattern: {
          select: { name: true }
        }
      }
    });
    res.json(problems);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch problems' });
  }
});

// Get a single problem by slug
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const problem = await prisma.problem.findUnique({
      where: { slug },
      include: {
        pattern: true,
        // We do NOT send hidden test cases to the client!
        testCases: {
          where: { isHidden: false }
        }
      }
    });

    if (!problem) {
      return res.status(404).json({ error: 'Problem not found' });
    }

    res.json(problem);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch problem' });
  }
});

export const problemsRouter = router;
