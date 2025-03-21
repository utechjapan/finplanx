// lib/prisma.ts - Updated
import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

// Create a new PrismaClient instance with better error handling
const createPrismaClient = () => {
  const client = new PrismaClient({
    // Add logging in development
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });
  
  // Add error handling wrapper
  client.$on('error', (e) => {
    console.error('Prisma Client Error:', e);
  });
  
  return client;
};

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
export const prisma = global.prisma || createPrismaClient();

if (process.env.NODE_ENV !== 'production') global.prisma = prisma;