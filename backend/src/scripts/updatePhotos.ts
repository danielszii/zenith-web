import { pool } from '../config/database.js';

async function run() {
  try {
    const result = await pool.query("UPDATE atletas SET foto_perfil = '/player-default.png' WHERE foto_perfil IS NULL");
    console.log(`Atualizados ${result.rowCount ?? 0} atletas com a foto padrão.`);
  } finally {
    await pool.end();
  }
}

run().catch(error => {
  console.error('Não foi possível atualizar as fotos:', error);
  process.exitCode = 1;
});
