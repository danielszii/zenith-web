import { readdir, readFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { pool } from '../config/database.js';

const migrationsDirectory = fileURLToPath(new URL('../../database/migrations/', import.meta.url));

try {
  const files = (await readdir(migrationsDirectory))
    .filter(file => extname(file) === '.sql')
    .sort((first, second) => first.localeCompare(second));

  for (const file of files) {
    await pool.query(await readFile(join(migrationsDirectory, file), 'utf8'));
    console.log(`Migração aplicada: ${file}`);
  }

  console.log(`${files.length} migração(ões) aplicada(s) com sucesso.`);
} finally {
  await pool.end();
}
