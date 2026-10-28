import { pool } from "../config/database.js";
import { propsAtleta } from "../models/Atleta.js";
import type { CreateAtletaDTO } from '../dtos/CreateAtletaDTO.js';

export class AtletaRepository {
  async create(atleta: propsAtleta): Promise<propsAtleta> {
    const query = `
      INSERT INTO atletas (id_atleta, nome, cpf, rg, foto_perfil, data_nasc, status, peso, altura, tipo_sanguineo, id_clube)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *;
    `;

    const values = [
      atleta.id_atleta,
      atleta.nome,
      atleta.cpf,
      atleta.rg || null,
      atleta.foto_perfil || null,
      atleta.data_nasc,
      atleta.status || "ativo",
      atleta.peso || null,
      atleta.altura || null,
      atleta.tipo_sanguineo,
      atleta.id_clube || null,
    ];

    const { rows } = await pool.query(query, values);
    return rows[0];
  }
  async findAll(): Promise<propsAtleta[]> {
    const query = "SELECT * FROM atletas ORDER BY nome ASC;";
    const { rows } = await pool.query(query);
    return rows;
  }
  async findById(id: string): Promise<propsAtleta | null> {
    const query = "SELECT * FROM atletas WHERE id_atleta = $1;";
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }

  async update(id: string, data: Partial<CreateAtletaDTO>): Promise<propsAtleta | null> {
    const query = `
    UPDATE atletas 
    SET nome = COALESCE($1, nome), cpf = COALESCE($2, cpf), rg = COALESCE($3, rg),
        data_nasc = COALESCE($4, data_nasc), status = COALESCE($5, status),
        peso = COALESCE($6, peso), altura = COALESCE($7, altura),
        tipo_sanguineo = COALESCE($8, tipo_sanguineo), foto_perfil = COALESCE($9, foto_perfil),
        id_clube = COALESCE($10, id_clube)
    WHERE id_atleta = $11 RETURNING *;
  `;
    const values = [
      data.nome,
      data.cpf,
      data.rg,
      data.data_nasc,
      data.status,
      data.peso,
      data.altura,
      data.tipo_sanguineo,
      data.foto_perfil,
      data.id_clube,
      id,
    ];
    const { rows } = await pool.query(query, values);
    return rows[0] ?? null;
  }

  async delete(id: string): Promise<boolean> {
    const query = "DELETE FROM atletas WHERE id_atleta = $1;";
    const result = await pool.query(query, [id]);
    return Boolean(result.rowCount);
  }

  async obterPerfilEstatisticas(id_atleta: string) {
    const query = `
      SELECT 
        a.id_atleta,
        a.nome,
        c.nome AS time_atual,
        (
  SELECT COUNT(*)::int 
          FROM eventos_sumula 
          WHERE id_atleta = $1 AND UPPER(tipo_evento) = 'GOL' AND cancelado = false
        ) AS gols,
        (
          SELECT COUNT(*)::int 
          FROM eventos_sumula 
          WHERE COALESCE(id_atleta_relacionado, id_atleta_assistencia) = $1 AND UPPER(tipo_evento) = 'GOL' AND cancelado = false
        ) AS assistencias,
        (
          SELECT COUNT(*)::int 
          FROM eventos_sumula 
          WHERE id_atleta = $1 AND UPPER(tipo_evento) = 'CARTAO_AMARELO' AND cancelado = false
        ) AS cartoes_amarelos,
        (
          SELECT COUNT(*)::int 
          FROM eventos_sumula 
          WHERE id_atleta = $1 AND UPPER(tipo_evento) = 'CARTAO_VERMELHO' AND cancelado = false
        ) AS cartoes_vermelhos,
        (
          SELECT COUNT(DISTINCT participacao.id_partida)::int
          FROM (
            SELECT id_partida FROM escalacoes_partida WHERE id_atleta = $1 AND confirmado = true
            UNION
            SELECT id_partida FROM eventos_sumula
            WHERE cancelado = false
              AND (id_atleta = $1 OR COALESCE(id_atleta_relacionado, id_atleta_assistencia) = $1)
          ) participacao
        ) AS numero_partidas
      FROM atletas a
      LEFT JOIN clubes c ON a.id_clube = c.id_clube
      WHERE a.id_atleta = $1;
    `;

    const { rows } = await pool.query(query, [id_atleta]);
    return rows[0];
  }
}
