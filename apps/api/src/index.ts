import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { prisma } from 'database';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

const allowedOrigin = process.env.ALLOWED_ORIGIN || '*';

app.use(cors({
  origin: allowedOrigin === '*' ? '*' : allowedOrigin.split(','),
  credentials: true,
}));
app.use(express.json());

app.get('/health', async (req, res) => {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok', db: 'connected' });
  } catch (error) {
    res.status(500).json({ status: 'error', db: 'disconnected' });
  }
});

import { problemsRouter } from './routes/problems.js';
import { patternsRouter } from './routes/patterns.js';
import { submissionsRouter } from './routes/submissions.js';
import { authRouter } from './routes/auth.js';
import { leaderboardRouter } from './routes/leaderboard.js';

app.use('/api/problems', problemsRouter);
app.use('/api/patterns', patternsRouter);
app.use('/api/submissions', submissionsRouter);
app.use('/api/auth', authRouter);
app.use('/api/leaderboard', leaderboardRouter);


app.listen(port, () => {
  console.log(`API Server running on port ${port}`);
});
