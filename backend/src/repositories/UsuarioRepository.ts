import { pool } from "../config/database.js";
import { Usuario } from "../models/Usuario.js";

export class UsuarioRepository {
  async create(usuario: Usuario) {
    const query = `
      INSERT INTO usuarios (id_usuario, nome, email, senha, role)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id_usuario, nome, email, role, created_at;`;
    const values = [
      usuario.id_usuario,
      usuario.nome,
      usuario.email,
      usuario.senha,
      usuario.role,
    ];

    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  async findByEmail(email: string) {
    const query = "SELECT * FROM usuarios WHERE email = $1;";
    const { rows } = await pool.query(query, [email]);
    return rows.length ? rows[0] : null;
  }
}
