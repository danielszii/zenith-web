import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client.js';
import './env.js';

function legacyConnectionString() {
  const host = process.env.DB_HOST?.trim();
  const database = process.env.DB_DATABASE?.trim();
  const user = process.env.DB_USER?.trim();
  const password = process.env.DB_PASSWORD;

  if (!host || !database || !user || password === undefined) return undefined;

  const port = process.env.DB_PORT?.trim() || '5432';
  return `postgresql://${encodeURIComponent(user)}:${encodeURIComponent(password)}@${host}:${port}/${encodeURIComponent(database)}`;
}

const connectionString =
  process.env.DATABASE_URL?.trim() || legacyConnectionString();

if (!connectionString) {
  throw new Error(
    'DATABASE_URL nao foi configurada. Use a URL do pooler do Supabase em backend/.env.',
  );
}

const globalForPrisma = globalThis as unknown as { zenithPrisma?: PrismaClient };

export const prisma =
  globalForPrisma.zenithPrisma ??
  new PrismaClient({
    adapter: new PrismaPg({
      connectionString,
      max: 5,
      connectionTimeoutMillis: 10_000,
      idleTimeoutMillis: 30_000,
    }),
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.zenithPrisma = prisma;
