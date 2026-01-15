import { PrismaClient } from "@prisma/client";

/**
 * Prisma 7 configuration file
 * This replaces the datasource.url in schema.prisma
 */
export default {
  // Database connection configuration
  datasource: {
    // Use the DATABASE_URL environment variable for connection
    url: process.env.DATABASE_URL,
  },

  // Client configuration
  client: {
    // Log levels: 'info', 'warn', 'error', 'query'
    log: ["warn", "error"],

    // Error formatting options
    errorFormat: "pretty",
  },
};

// Initialize PrismaClient with configuration
export const prisma = new PrismaClient({
  // Pass the database connection URL
  adapter: {
    url: process.env.DATABASE_URL,
  },

  // Optional: Configure logging
  log: ["warn", "error"],
});
