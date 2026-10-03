import { pool } from "../config/database.js";
import { propsCampeonato } from "../models/Campeonato.js";

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

  async update(id: string, data: any) {
    const query = `
    UPDATE campeonatos 
    SET nome = $1, formato = $2, data_inicio = $3, data_fim = $4, criterios_desempate = $5, status = $6
    WHERE id_campeonato = $7 RETURNING *;
  `;
    const values = [
      data.nome,
      data.formato || null,
      data.data_inicio || null,
      data.data_fim || null,
      data.criterios_desempate || null,
      data.status || "planejado",
      id,
    ];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  async delete(id: string): Promise<boolean> {
    const query = "DELETE FROM campeonatos WHERE id_campeonato = $1;";
    await pool.query(query, [id]);
    return true;
  }

  async findInscricao(id_campeonato: string, id_clube: string): Promise<any> {
    const query = `
    SELECT * FROM campeonatos_clubes 
    WHERE id_campeonato = $1 AND id_clube = $2;
  `;
    const { rows } = await pool.query(query, [id_campeonato, id_clube]);
    return rows[0];
  }

  async inscreverClube(id_campeonato: string, id_clube: string): Promise<any> {
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
