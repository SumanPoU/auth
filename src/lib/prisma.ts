import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client";

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaPg({ connectionString });

// Create a type-safe global variable for caching
const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Use cached instance in development or create a new one
export const db =
  globalForPrisma.prisma || new PrismaClient({ adapter, 
    // log: ["query"]
   });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
