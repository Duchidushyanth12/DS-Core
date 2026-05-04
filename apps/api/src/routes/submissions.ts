import { Router } from 'express';
import { prisma } from 'database';
import { requireAuth, type AuthRequest } from '../middleware/auth.js';

const router = Router();

const getExecutionEngineUrl = () => {
  const rawTarget = (process.env.EXECUTION_ENGINE_URL || 'http://localhost:5000').replace(/\/$/, '');

  if (rawTarget.endsWith('/execute')) {
    return rawTarget;
  }

  const baseUrl =
    rawTarget.startsWith('http://') || rawTarget.startsWith('https://')
      ? rawTarget
      : `http://${rawTarget}`;

  return `${baseUrl}/execute`;
};

// Submit code for a problem
router.post('/', requireAuth, async (req, res) => {
  const authReq = req as AuthRequest;
  try {
    const { problemId, language, code } = authReq.body;
    const userId = authReq.user!.uid;

    // 1. Fetch problem and test cases
    const problem = await prisma.problem.findUnique({
      where: { id: problemId },
      include: { testCases: true }
    });

    if (!problem) {
      return res.status(404).json({ error: 'Problem not found' });
    }

    // 2. Create initial submission record in database
    const dbUser = await prisma.user.findUnique({ where: { firebaseUid: userId } });
    if (!dbUser) return res.status(404).json({ error: 'User not found in DB' });

    const submission = await prisma.submission.create({
      data: {
        userId: dbUser.id,
        problemId: problem.id,
        language,
        code,
        status: 'PENDING'
      }
    });

    // 3. Send to execution engine (simulated via direct HTTP call here, can be replaced by Pub/Sub)
    // Assuming execution-engine runs on port 5000
    try {
      const execResponse = await fetch(getExecutionEngineUrl(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language,
          code,
          testCases: problem.testCases
        })
      });

      const execResult = await execResponse.json();

      // 4. Update submission with results
      const finalSubmission = await prisma.submission.update({
        where: { id: submission.id },
        data: {
          status: execResult.status,
          executionTime: execResult.executionTime,
          memoryUsed: execResult.memoryUsed
        }
      });

      // 5. Update Progress if ACCEPTED
      if (execResult.status === 'ACCEPTED') {
        const pattern = await prisma.pattern.findUnique({
          where: { id: problem.patternId }
        });

        if (pattern) {
          // Check if this is the first time solving this problem
          const alreadySolved = await prisma.submission.findFirst({
            where: {
              userId: dbUser.id,
              problemId: problem.id,
              status: 'ACCEPTED',
              id: { not: submission.id }
            }
          });

          if (!alreadySolved) {
            const progress = await prisma.progress.upsert({
              where: { userId_patternId: { userId: dbUser.id, patternId: pattern.id } },
              update: {
                completedProblems: { increment: 1 }
              },
              create: {
                userId: dbUser.id,
                patternId: pattern.id,
                completedProblems: 1,
                totalProblems: pattern.totalProblems,
                unlocked: pattern.orderIndex === 1
              }
            });

            // Check if pattern is now completed
            const updatedProgress = await prisma.progress.findUnique({
              where: { id: progress.id }
            });

            if (updatedProgress && updatedProgress.completedProblems >= pattern.totalProblems) {
              await prisma.progress.update({
                where: { id: updatedProgress.id },
                data: { isCompleted: true }
              });

              // Unlock next pattern automatically
              const nextPattern = await prisma.pattern.findFirst({
                where: { orderIndex: pattern.orderIndex + 1 }
              });

              if (nextPattern) {
                await prisma.progress.upsert({
                  where: { userId_patternId: { userId: dbUser.id, patternId: nextPattern.id } },
                  update: { unlocked: true },
                  create: {
                    userId: dbUser.id,
                    patternId: nextPattern.id,
                    unlocked: true,
                    totalProblems: nextPattern.totalProblems
                  }
                });
              }
            }
          }
        }
      }

      res.json(finalSubmission);
    } catch (execError) {
      console.error('Execution Engine Error:', execError);
      const failedSubmission = await prisma.submission.update({
        where: { id: submission.id },
        data: { status: 'RUNTIME_ERROR' }
      });
      res.status(500).json(failedSubmission);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to process submission' });
  }
});

export const submissionsRouter = router;
