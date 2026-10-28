import type { Prisma } from '../generated/prisma/client.js';
import { prisma } from './prisma.js';

export type QueryResult<T = any> = {
  rows: T[];
  rowCount: number;
};

export type QueryExecutor = {
  query<T = any>(sql: string, values?: unknown[]): Promise<QueryResult<T>>;
};

type PrismaExecutor = Pick<
  Prisma.TransactionClient,
  '$queryRawUnsafe' | '$executeRawUnsafe'
>;

export async function executePrismaQuery<T = any>(
  executor: PrismaExecutor,
  sql: string,
  values: unknown[] = [],
): Promise<QueryResult<T>> {
  const normalizedValues = values.map((value) => value === undefined ? null : value);
  const normalized = sql.trim().toUpperCase();
  const returnsRows =
    normalized.startsWith('SELECT') ||
    normalized.startsWith('WITH') ||
    normalized.includes(' RETURNING ');

  if (returnsRows) {
    const rows = await executor.$queryRawUnsafe<T[]>(sql, ...normalizedValues);
    return { rows, rowCount: rows.length };
  }

  const rowCount = await executor.$executeRawUnsafe(sql, ...normalizedValues);
  return { rows: [], rowCount };
}

// Adaptador temporario para consultas especializadas. Todo acesso passa pelo
// Prisma; repositories podem ser tipados gradualmente sem quebrar a API.
export const pool: QueryExecutor & { end(): Promise<void> } = {
  query: (sql, values = []) => executePrismaQuery(prisma, sql, values),
  end: () => prisma.$disconnect(),
};

export const testConnection = async () => {
  await prisma.$queryRaw`SELECT 1`;
  console.log('Conectado ao PostgreSQL com Prisma (Zenith DB)');
};

export const disconnectDatabase = () => prisma.$disconnect();
