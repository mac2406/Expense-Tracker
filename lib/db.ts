import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import path from "node:path";

// Singleton Prisma Client pattern for Next.js hot-reloads
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const getPrismaClient = () => {
  // Resolve path to database file
  const dbUrl = process.env.DATABASE_URL || "file:./dev.db";
  const relativePath = dbUrl.replace("file:", "");
  const absolutePath = path.resolve(process.cwd(), relativePath);
  const absoluteDbUrl = `file:${absolutePath}`;

  // Wrap better-sqlite3 inside Prisma 7 driver adapter using connection options
  const adapter = new PrismaBetterSqlite3({ url: absoluteDbUrl });

  // Instantiate standard Prisma client with driver adapter
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });
};

export const db = globalThis.prisma || getPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = db;
}
