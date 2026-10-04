import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { pool } from '../config/database.js';

const migration = fileURLToPath(new URL('../../database/migrations/002_mobile_offline.sql', import.meta.url));
try {
  await pool.query(await readFile(migration, 'utf8'));
  console.log('Migration mobile offline aplicada com sucesso.');
} finally {
  await pool.end();
}
