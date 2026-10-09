import { pool } from "../config/database.js";
import { propsCampeonato } from "../models/Campeonato.js";
import type { CreateCampeonatoDTO } from '../dtos/CreateCampeonatoDTO.js';

export class CampeonatoRepository {
  async create(campeonato: propsCampeonato): Promise<propsCampeonato> {
    const query = `
      INSERT INTO campeonatos (id_campeonato, nome, formato, data_inicio, data_fim, criterios_desempate, status, modalidade, categoria)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *;
    `;
    const values = [
      campeonato.id_campeonato,
      campeonato.nome,
      campeonato.formato,
      campeonato.data_inicio,
      campeonato.data_fim,
      campeonato.criterios_desempate,
      campeonato.status || "planejado",
      campeonato.modalidade,
      campeonato.categoria,
    ];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  async findAll(): Promise<propsCampeonato[]> {
    const query = "SELECT * FROM campeonatos ORDER BY id_campeonato DESC;";
    const { rows } = await pool.query(query);
    return rows;
  }

  async findById(id_campeonato: string): Promise<propsCampeonato | null> {
    const query = "SELECT * FROM campeonatos WHERE id_campeonato = $1;";
    const { rows } = await pool.query(query, [id_campeonato]);
    return rows.length ? rows[0] : null;
  }

  async update(id: string, data: Partial<CreateCampeonatoDTO>): Promise<propsCampeonato | null> {
    const query = `
    UPDATE campeonatos 
    SET nome = COALESCE($1, nome), formato = COALESCE($2, formato),
        data_inicio = COALESCE($3, data_inicio), data_fim = COALESCE($4, data_fim),
        criterios_desempate = COALESCE($5, criterios_desempate), status = COALESCE($6, status),
        modalidade = COALESCE($7, modalidade), categoria = COALESCE($8, categoria)
    WHERE id_campeonato = $9 RETURNING *;
  `;
    const values = [
      data.nome,
      data.formato,
      data.data_inicio,
      data.data_fim,
      data.criterios_desempate,
      data.status,
      data.modalidade,
      data.categoria,
      id,
    ];
    const { rows } = await pool.query(query, values);
    return rows[0] ?? null;
  }

  async delete(id: string): Promise<boolean> {
    const query = "DELETE FROM campeonatos WHERE id_campeonato = $1;";
    const result = await pool.query(query, [id]);
    return Boolean(result.rowCount);
  }

  async findInscricao(id_campeonato: string, id_clube: string): Promise<{ id_campeonato: string; id_clube: string } | undefined> {
    const query = `
    SELECT * FROM campeonatos_clubes 
    WHERE id_campeonato = $1 AND id_clube = $2;
  `;
    const { rows } = await pool.query(query, [id_campeonato, id_clube]);
    return rows[0];
  }

  async inscreverClube(id_campeonato: string, id_clube: string): Promise<{ id_campeonato: string; id_clube: string }> {
    const query = `
    INSERT INTO campeonatos_clubes (id_campeonato, id_clube)
    VALUES ($1, $2)
    RETURNING *;
  `;
    const { rows } = await pool.query(query, [id_campeonato, id_clube]);
    return rows[0];
  }

  async obterTabelaClassificacao(id_campeonato: string) {
    const query = `
      WITH times_campeonato AS (
        SELECT cc.id_campeonato, cc.id_clube, c.nome
        FROM campeonatos_clubes cc
        JOIN clubes c ON cc.id_clube = c.id_clube
        WHERE cc.id_campeonato = $1
      ),
      estatisticas AS (
        SELECT 
          t.id_clube,
          t.nome AS clube,
          COUNT(p.id_partida) AS jogos,
          SUM(CASE 
            WHEN p.id_mandante = t.id_clube AND p.gols_mandante > p.gols_visitante THEN 3
            WHEN p.id_visitante = t.id_clube AND p.gols_visitante > p.gols_mandante THEN 3
            WHEN p.gols_mandante = p.gols_visitante AND p.id_partida IS NOT NULL THEN 1
            ELSE 0 
          END) AS pontos,
          SUM(CASE WHEN p.id_mandante = t.id_clube AND p.gols_mandante > p.gols_visitante THEN 1 
                   WHEN p.id_visitante = t.id_clube AND p.gols_visitante > p.gols_mandante THEN 1 ELSE 0 END) AS vitorias,
          SUM(CASE WHEN p.gols_mandante = p.gols_visitante AND p.id_partida IS NOT NULL THEN 1 ELSE 0 END) AS empates,
          SUM(CASE WHEN p.id_mandante = t.id_clube AND p.gols_mandante < p.gols_visitante THEN 1 
                   WHEN p.id_visitante = t.id_clube AND p.gols_visitante < p.gols_mandante THEN 1 ELSE 0 END) AS derrotas,
          SUM(CASE WHEN p.id_mandante = t.id_clube THEN p.gols_mandante 
                   WHEN p.id_visitante = t.id_clube THEN p.gols_visitante ELSE 0 END) AS gols_pro,
          SUM(CASE WHEN p.id_mandante = t.id_clube THEN p.gols_visitante 
                   WHEN p.id_visitante = t.id_clube THEN p.gols_mandante ELSE 0 END) AS gols_contra
        FROM times_campeonato t
        LEFT JOIN partidas p 
          ON (p.id_mandante = t.id_clube OR p.id_visitante = t.id_clube)
          AND p.id_campeonato = t.id_campeonato
          AND p.status = 'encerrado'
        GROUP BY t.id_clube, t.nome
      )
      SELECT 
        id_clube,
        clube,
        COALESCE(jogos, 0)::int AS jogos,
        COALESCE(pontos, 0)::int AS pontos,
        COALESCE(vitorias, 0)::int AS vitorias,
        COALESCE(empates, 0)::int AS empates,
        COALESCE(derrotas, 0)::int AS derrotas,
        COALESCE(gols_pro, 0)::int AS gols_pro,
        COALESCE(gols_contra, 0)::int AS gols_contra,
        (COALESCE(gols_pro, 0) - COALESCE(gols_contra, 0))::int AS saldo_gols
      FROM estatisticas
      ORDER BY pontos DESC, saldo_gols DESC, vitorias DESC, gols_pro DESC;
    `;

    const { rows } = await pool.query(query, [id_campeonato]);
    return rows;
  }
}
