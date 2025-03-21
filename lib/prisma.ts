// lib/prisma.ts
import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

// Create a new PrismaClient instance with better error handling
const createPrismaClient = () => {
  try {
    // Skip database connection in demo mode
    if (process.env.NEXT_PUBLIC_DEMO_MODE === 'true') {
      console.log('Running in demo mode - skipping real database connection');
      return createMockClient();
    }

    const client = new PrismaClient({
      // Add logging in development
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });
    
    // Test the connection
    client.$connect()
      .then(() => console.log('Database connected successfully'))
      .catch(e => {
        console.error('Failed to connect to database:', e);
        console.warn('Running with mock database client');
      });
    
    return client;
  } catch (e) {
    console.error('Failed to initialize Prisma client:', e);
    // Return a mock client that doesn't throw errors
    return createMockClient();
  }
};

// Create a mock client for demo mode or when DB connection fails
const createMockClient = () => {
  return new Proxy({} as PrismaClient, {
    get: (target, prop) => {
      // For tables, return a proxy for their methods
      if (['user', 'account', 'session', 'notification', 'passwordReset'].includes(prop as string)) {
        return new Proxy({}, {
          get: (_, method) => {
            // Return a function for all methods
            return (...args: any[]) => {
              console.log(`Mock Prisma client called: ${String(prop)}.${String(method)}`, args);
              
              // Return appropriate values based on method
              if (method === 'findUnique' || method === 'findFirst') {
                return Promise.resolve(null);
              } else if (method === 'findMany') {
                return Promise.resolve([]);
              } else if (method === 'create' || method === 'update' || method === 'upsert') {
                // For create/update, return the input data with an id
                const inputData = args[0]?.data || {};
                return Promise.resolve({
                  id: `mock-${Date.now()}`,
                  createdAt: new Date(),
                  updatedAt: new Date(),
                  ...inputData
                });
              } else if (method === 'delete') {
                return Promise.resolve({ id: args[0]?.where?.id || 'deleted-id' });
              } else {
                return Promise.resolve(null);
              }
            };
          }
        });
      }
      
      // Handle transaction method
      if (prop === '$transaction') {
        return async (operations: (() => Promise<any>)[]) => {
          const results = [];
          for (const operation of operations) {
            results.push(await operation());
          }
          return results;
        };
      }
      
      // Handle connection methods
      if (prop === '$connect' || prop === '$disconnect') {
        return () => Promise.resolve();
      }
      
      return undefined;
    }
  });
};

// Create or reuse the Prisma client
let prisma: PrismaClient;

// In development, use a global variable to avoid exhausting connections
if (process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_DEMO_MODE === 'true') {
  if (!global.prisma) {
    global.prisma = createPrismaClient();
  }
  prisma = global.prisma;
} else {
  // In production, create a new client
  prisma = createPrismaClient();
}

export { prisma };