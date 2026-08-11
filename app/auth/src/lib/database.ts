import { Pool, neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from '@prisma/client';
import ws from 'ws';
import { DATABASE_URL, DATABASE_URL_PRODUCTION } from '../config/env';

// Node.js doesn't have a native WebSocket, so we tell Neon to use the 'ws' package
neonConfig.webSocketConstructor = ws;

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

function createNeonAdapter() {
  const connectionUrl = DATABASE_URL_PRODUCTION || DATABASE_URL;

  if (!connectionUrl) {
    throw new Error('Missing required environment variable: "DATABASE_URL_PRODUCTION" or "DATABASE_URL"');
  }

 
  const pool: any  = new Pool({ connectionString: connectionUrl });

  return new PrismaNeon(pool);
}

class Database {
  private static instance: PrismaClient | null = null;

  public static getClient(): PrismaClient {
    if (this.instance) {
      return this.instance;
    }

    // Initialize Prisma Client with the Neon Serverless Adapter
    this.instance = new PrismaClient({ adapter: createNeonAdapter() });
    
    return this.instance;
  }
}

export const database = globalForPrisma.prisma || Database.getClient();

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = database;
}