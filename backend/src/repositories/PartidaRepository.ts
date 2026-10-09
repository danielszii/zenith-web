import { pool } from "../config/database.js";
import { Partida } from "../models/Partida.js";

export class PartidaRepository {
  async create(partida: Partida) {
    const query = `
      INSERT INTO partidas (id_partida, id_campeonato, id_mandante, id_visitante, data, hora, local, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *;`;
    const values = [
      partida.id_partida,
      partida.id_campeonato,
      partida.id_mandante,
      partida.id_visitante,
      partida.data,
      partida.hora,
      partida.local,
      partida.status || "agendado",
    ];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  async findAll(): Promise<Partida[]> {
    const query = `
      SELECT
        p.*,
        json_build_object('nome', mandante.nome, 'brasao', mandante.brasao) AS mandante,
        json_build_object('nome', visitante.nome, 'brasao', visitante.brasao) AS visitante,
        json_build_object('nome', campeonato.nome, 'categoria', campeonato.categoria) AS campeonato
      FROM partidas p
      JOIN clubes mandante ON mandante.id_clube = p.id_mandante
      JOIN clubes visitante ON visitante.id_clube = p.id_visitante
      JOIN campeonatos campeonato ON campeonato.id_campeonato = p.id_campeonato
      ORDER BY p.data DESC, p.hora DESC;
    `;
    const { rows } = await pool.query(query);
    return rows;
  }

  async findById(id_partida: string): Promise<Partida | null> {
    const query = "SELECT * FROM partidas WHERE id_partida = $1;";
    const { rows } = await pool.query(query, [id_partida]);
    return rows.length ? rows[0] : null;
  }

  async updateStatus(id_partida: string, status: string): Promise<Partida> {
    const query = `UPDATE partidas SET status = $1 WHERE id_partida = $2 RETURNING *;`;
    const { rows } = await pool.query(query, [status, id_partida]);
    return rows[0];
  }

  async delete(id: string): Promise<boolean> {
    const query = "DELETE FROM partidas WHERE id_partida = $1;";
    const result = await pool.query(query, [id]);
    return Boolean(result.rowCount);
  }


  async findSumulaDados(id_partida: string) {
    const query = `SELECT p.*,
        c.nome as nome_campeonato,
        m.nome as nome_mandante,
        v.nome as nome_visitante
      FROM partidas p
      JOIN campeonatos c ON p.id_campeonato = c.id_campeonato
      JOIN clubes m ON p.id_mandante = m.id_clube
      JOIN clubes v ON p.id_visitante = v.id_clube
      WHERE p.id_partida = $1;`;
    const { rows } = await pool.query(query, [id_partida]);
    return rows[0];
  }

  async incrementarGolMandante(id_partida: string): Promise<void> {
    await pool.query(
      "UPDATE partidas SET gols_mandante = gols_mandante + 1 WHERE id_partida = $1",
      [id_partida],
    );
  }

  async incrementarGolVisitante(id_partida: string): Promise<void> {
    await pool.query(
      "UPDATE partidas SET gols_visitante = gols_visitante + 1 WHERE id_partida = $1",
      [id_partida],
    );
  }

  async verificarSuspensao(
    id_atleta: string,
    id_campeonato: string,
    data_partida_atual: string,
  ): Promise<boolean> {
    const query = `
    SELECT e.tipo_evento 
    FROM eventos_sumula e
    JOIN partidas p ON e.id_partida = p.id_partida
    WHERE e.id_atleta = $1 
      AND p.id_campeonato = $2
      AND p.data < $3
      AND e.tipo_evento = 'CARTAO_VERMELHO'
    ORDER BY p.data DESC, p.hora DESC
    LIMIT 1;
  `;

    const { rows } = await pool.query(query, [
      id_atleta,
      id_campeonato,
      data_partida_atual,
    ]);

    return rows.length > 0;
  }
}
