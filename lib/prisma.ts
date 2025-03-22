// lib/prisma.ts - Improved database connection
import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

// Properly handle connection errors and provide better logging
const createPrismaClient = () => {
  try {
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
        .catch((err) => console.error('Failed to connect to database:', err));
    }
    
    return client;
  } catch (e) {
    console.error('Failed to initialize Prisma client:', e);
    throw new Error('Database connection failed. Check your database configuration.');
  }
};

// In development, we don't want to restart the server with every change
// so we maintain a global instance of Prisma client
let prisma: PrismaClient;

if (process.env.NODE_ENV === 'development') {
  if (!global.prisma) {
    global.prisma = createPrismaClient();
  }
  prisma = global.prisma;
} else {
  // In production, create a new client
  prisma = createPrismaClient();
}

export { prisma };