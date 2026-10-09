import { pool } from "../config/database.js";
import { propsClube } from "../models/Clube.js";
import type { CreateClubeDTO } from '../dtos/CreateClubeDTO.js';

export class ClubeRepository {
  async create(clube: propsClube): Promise<propsClube> {
    const query = `
        INSERT INTO clubes (id_clube, nome, brasao, cores_oficiais, responsavel, cnpj)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *;
        `;
    const values = [
      clube.id_clube,
      clube.nome,
      clube.brasao || null,
      clube.cores_oficiais || null,
      clube.responsavel || null,
      clube.cnpj || null,
    ];

    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  async findAll(): Promise<propsClube[]> {
    const query = `SELECT * FROM clubes ORDER BY nome ASC;`;
    const { rows } = await pool.query(query);
    return rows;
  }

  async findById(id_clube: string): Promise<propsClube | null> {
    const query = "SELECT * FROM clubes WHERE id_clube = $1;";
    const { rows } = await pool.query(query, [id_clube]);
    return rows.length ? rows[0] : null;
  }

  async update(id: string, data: Partial<CreateClubeDTO>): Promise<propsClube | null> {
    const query = `UPDATE clubes SET nome = COALESCE($1, nome), brasao = COALESCE($2, brasao), cores_oficiais = COALESCE($3, cores_oficiais), responsavel = COALESCE($4, responsavel), cnpj = COALESCE($5, cnpj) WHERE id_clube = $6 RETURNING *;`;
    const values = [
      data.nome,
      data.brasao,
      data.cores_oficiais,
      data.responsavel,
      data.cnpj,
      id,
    ];
    const { rows } = await pool.query(query, values);
    return rows[0] ?? null;
  }

  async delete(id: string): Promise<boolean> {
    const query = "DELETE FROM clubes WHERE id_clube = $1;";
    const result = await pool.query(query, [id]);
    return Boolean(result.rowCount);
  }
}
