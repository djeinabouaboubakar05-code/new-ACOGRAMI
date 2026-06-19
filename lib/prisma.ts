import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

function createPrismaClient() {
  const dbUrl = process.env.DATABASE_URL || "";
  if (dbUrl.includes("localhost") || dbUrl.includes("127.0.0.1") || !dbUrl.includes("neon.tech")) {
    return new PrismaClient();
  }
  const adapter = new PrismaNeon({ connectionString: dbUrl });
  return new PrismaClient({ adapter });
}

export const prisma =
  globalForPrisma.prisma ||
  createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
