// lib/prisma.ts - Improved database connection with better error handling
import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

// Enhanced createPrismaClient function with better error handling and logging
const createPrismaClient = () => {
  try {
    // Check if DATABASE_URL is set
    if (!process.env.DATABASE_URL) {
      console.warn("DATABASE_URL is not set. This will cause connection errors unless in demo mode.");
      
      // If demo mode, create a mock client
      if (process.env.NEXT_PUBLIC_DEMO_MODE === 'true') {
        console.log("Demo mode detected, using mock Prisma client");
        return new PrismaClient({
          datasources: {
            db: {
              url: "file:./dev.db", // This will be ignored in demo mode
            },
          },
          log: process.env.NODE_ENV === 'development' 
            ? ['error', 'warn'] 
            : ['error'],
        });
      }
    }
    
    // Create client with appropriate logging settings
    const client = new PrismaClient({
      log: process.env.NODE_ENV === 'development' 
        ? ['query', 'error', 'warn'] 
        : ['error'],
    });
    
    // Test connection on startup in development
    if (process.env.NODE_ENV === 'development') {
      client.$connect()
        .then(() => console.log('Database connected successfully'))
        .catch((err) => {
          console.error('Failed to connect to database:', err);
          console.log('If you are in development mode, make sure your DATABASE_URL is correctly configured.');
          console.log('If you intend to use demo mode only, set NEXT_PUBLIC_DEMO_MODE=true in your .env file.');
        });
    }
    
    return client;
  } catch (e) {
    console.error('Failed to initialize Prisma client:', e);
    
    if (process.env.NEXT_PUBLIC_DEMO_MODE === 'true') {
      console.log("Demo mode detected, using minimal mock Prisma client");
      // Return a minimal mock client that won't throw errors
      return {
        // Add basic mock methods for demo mode
        $connect: async () => {},
        $disconnect: async () => {},
      } as unknown as PrismaClient;
    }
    
    throw new Error('Database connection failed. Check your database configuration.');
  }
};

// In development, we don't want to restart the server with every change
// so we maintain a global instance of Prisma client
let prisma: PrismaClient;

// Handle potential errors during Prisma instantiation
try {
  if (process.env.NODE_ENV === 'development') {
    if (!global.prisma) {
      global.prisma = createPrismaClient();
    }
    prisma = global.prisma;
  } else {
    // In production, create a new client
    prisma = createPrismaClient();
  }
} catch (err) {
  console.error("Failed to initialize Prisma:", err);
  
  if (process.env.NEXT_PUBLIC_DEMO_MODE === 'true') {
    // In demo mode, create a minimal mock to avoid crashing
    prisma = {
      // Minimal mock for demo mode
      user: {
        findUnique: async () => null,
        findFirst: async () => null,
        create: async () => ({}),
        update: async () => ({}),
      },
      // Add other collections as needed
    } as unknown as PrismaClient;
  } else {
    // Create an error-throwing client to make it obvious there's an issue
    prisma = new Proxy({} as PrismaClient, {
      get: (_, prop) => {
        if (prop === '$connect' || prop === '$disconnect') {
          return async () => {}; // These methods should not throw
        }
        // Return a function that will throw a clear error message
        return () => {
          throw new Error(
            'Database connection failed. Set NEXT_PUBLIC_DEMO_MODE=true to use the app without a database.'
          );
        };
      },
    });
  }
}

export { prisma };