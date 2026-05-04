import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
dotenv.config();
if (!process.env.DATABASE_URL) {
    const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
    dotenv.config({ path: resolve(packageRoot, '.env') });
}
const globalForPrisma = globalThis;
export const prisma = globalForPrisma.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== 'production')
    globalForPrisma.prisma = prisma;
export * from '@prisma/client';
//# sourceMappingURL=index.js.map