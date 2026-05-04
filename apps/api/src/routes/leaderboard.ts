import { Router } from 'express';
import { prisma } from 'database';

const router = Router();

// Get leaderboard rankings
router.get('/', async (req, res) => {
  try {
    // Fetch users with their accepted submissions count
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        submissions: {
          where: { status: 'ACCEPTED' },
          include: {
            problem: {
              select: { difficulty: true }
            }
          }
        }
      }
    });

    // Calculate points for each user
    const rankings = users.map(user => {
      let points = 0;
      let solvedCount = user.submissions.length;

      user.submissions.forEach(sub => {
        points += 100; // Base points
        if (sub.problem.difficulty === 'EASY') points += 10;
        if (sub.problem.difficulty === 'MEDIUM') points += 30;
        if (sub.problem.difficulty === 'HARD') points += 100;
      });

      return {
        id: user.id,
        username: user.username,
        solved: solvedCount,
        points,
        avatar: user.username.charAt(0).toUpperCase() // Simple avatar char
      };
    });

    // Sort by points descending
    rankings.sort((a, b) => b.points - a.points);

    // Add rank index
    const rankedWithRank = rankings.map((user, index) => ({
      ...user,
      rank: index + 1
    }));

    res.json(rankedWithRank);
  } catch (error: any) {
    console.error('[Leaderboard API Error]:', error.message);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

export const leaderboardRouter = router;
