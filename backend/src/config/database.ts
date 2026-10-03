import { Pool } from 'pg';
import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';

dotenv.config({
  path: fileURLToPath(new URL('../../.env', import.meta.url)),
});

const requiredDatabaseVariables = ['DB_HOST', 'DB_DATABASE', 'DB_USER', 'DB_PASSWORD'] as const;
const missingDatabaseVariables = requiredDatabaseVariables.filter(
  (name) => !process.env[name]?.trim(),
);

if (missingDatabaseVariables.length > 0) {
  throw new Error(
    `Configuração do banco incompleta: ${missingDatabaseVariables.join(', ')}. ` +
    'Copie backend/.env.example para backend/.env e preencha os valores.',
  );
}
// Pool de conexões
export const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT || 5432),
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Função para testar a conexão na inicialização
export const testConnection = async () => {
  const client = await pool.connect();
  console.log('Conectado ao PostgreSQL com sucesso (Zenith DB)');
  client.release();
};
