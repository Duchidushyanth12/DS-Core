import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
const app = express();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
});
// This endpoint receives a code submission, executes it, and returns the result.
// In a real environment, this spins up a Docker container.
app.post('/execute', async (req, res) => {
    const { language, code, testCases } = req.body;
    // Simulate execution time
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log(`Executing ${language} code...`);
    // Mock response for now
    res.json({
        status: 'SUCCESS', // or 'COMPILE_ERROR', 'RUNTIME_ERROR', 'TIME_LIMIT_EXCEEDED'
        executionTime: 45, // ms
        memoryUsed: 12, // MB
        results: testCases.map((tc) => ({
            passed: true,
            expected: tc.expectedOutput,
            actual: tc.expectedOutput
        }))
    });
});
app.listen(port, () => {
    console.log(`Execution Engine running on port ${port}`);
});
//# sourceMappingURL=index.js.map