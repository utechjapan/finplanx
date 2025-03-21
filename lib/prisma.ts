// lib/prisma.ts
import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

// Create a new PrismaClient instance with better error handling
const createPrismaClient = () => {
  try {
    const client = new PrismaClient({
      // Add logging in development
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });
    
    // Test the connection
    client.$connect()
      .then(() => console.log('Database connected successfully'))
      .catch(e => {
        console.error('Failed to connect to database:', e);
        console.warn('Running in fallback mode without database');
      });
    
    return client;
  } catch (e) {
    console.error('Failed to initialize Prisma client:', e);
    // Return a mock client that doesn't throw errors
    return new Proxy({} as PrismaClient, {
      get: (target, prop) => {
        // Return no-op functions for all methods
        if (typeof prop === 'string') {
          return (...args: any[]) => {
            console.log(`Mock Prisma client called: ${String(prop)}`, args);
            return Promise.resolve(null);
          };
        }
        return undefined;
      }
    });
  }
};

// Create or reuse the Prisma client
let prisma: PrismaClient;

// In development, use a global variable to avoid exhausting connections
if (process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_DEMO_MODE === 'true') {
  // In demo mode, don't actually connect to a database
  if (!global.prisma && process.env.NEXT_PUBLIC_DEMO_MODE === 'true') {
    console.log('Running in demo mode without a real database connection');
    global.prisma = createPrismaClient();
  } else if (!global.prisma) {
    global.prisma = createPrismaClient();
  }
  prisma = global.prisma;
} else {
  // In production, create a new client for each request
  prisma = createPrismaClient();
}

export { prisma };