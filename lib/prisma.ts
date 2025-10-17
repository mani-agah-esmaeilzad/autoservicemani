import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

let prismaClient: PrismaClient | null | undefined = undefined;

function createPrismaClient(): PrismaClient | null {
  if (!process.env.DATABASE_URL) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('DATABASE_URL is not defined. Prisma client will not be initialised.');
    }
    return null;
  }

  try {
    const client = global.prisma ??
      new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error']
      });

    if (process.env.NODE_ENV !== 'production') {
      global.prisma = client;
    }

    return client;
  } catch (error) {
    console.error('Failed to initialise Prisma client. Falling back to in-memory data.', error);
    return null;
  }
}

export function getPrismaClient(): PrismaClient | null {
  if (prismaClient === undefined) {
    prismaClient = createPrismaClient();
  }

  return prismaClient ?? null;
}
