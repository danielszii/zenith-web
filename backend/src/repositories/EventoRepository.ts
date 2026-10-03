import { pool } from "../config/database.js";
import { EventoSumula, propsEventoSumula } from "../models/EventoSumula.js";

export class EventoRepository {
  async create(evento: EventoSumula): Promise<propsEventoSumula> {
    const query = `
      INSERT INTO eventos_sumula (id_evento, id_partida, id_atleta, id_clube, tipo_evento, id_atleta_assistencia, minuto_evento, timestamp_offline)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *;`;

    const values = [
      evento.id_evento,
      evento.id_partida,
      evento.id_atleta || null,
      evento.id_clube,
      evento.tipo_evento,
      evento.id_atleta_assistencia || null,
      evento.minuto_evento || null,
      evento.timestamp_offline || new Date(),
    ];

    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  async findByPartida(id_partida: string): Promise<propsEventoSumula[]> {
    const query = `
      SELECT e.*, a.nome as nome_atleta, c.nome as nome_clube
      FROM eventos_sumula e -- CORRIGIDO: Nome correto da tabela
      LEFT JOIN atletas a ON e.id_atleta = a.id_atleta
      LEFT JOIN clubes c ON e.id_clube = c.id_clube
      WHERE e.id_partida = $1
      ORDER BY e.minuto_evento ASC;
    `;

    const { rows } = await pool.query(query, [id_partida]);
    return rows;
  }

  async findByAtletaEPartida(id_atleta: string, id_partida: string) {
    const query = `
      SELECT * FROM eventos_sumula 
      WHERE id_atleta = $1 AND id_partida = $2
    `;
    const { rows } = await pool.query(query, [id_atleta, id_partida]);
    return rows;
  }

  async verificarSuspensaoPartidaAnterior(
    id_atleta: string,
    id_clube: string,
    id_campeonato: string,
    data_atual: any,
  ): Promise<boolean> {
    const dataSegura = new Date(data_atual).toISOString().split("T")[0];

    const query = `
      SELECT e.tipo_evento, p.id_partida, p.status, p.data 
      FROM partidas p
      LEFT JOIN eventos_sumula e 
        ON p.id_partida = e.id_partida 
        AND e.id_atleta = $1 
        AND UPPER(e.tipo_evento) = 'CARTAO_VERMELHO'
      WHERE p.id_campeonato = $3 
        AND (p.id_mandante = $2 OR p.id_visitante = $2)
        AND p.data < $4
        AND p.status = 'encerrado'
      ORDER BY p.data DESC, p.hora DESC
      LIMIT 1;
    `;

    const { rows } = await pool.query(query, [
      id_atleta,
      id_clube,
      id_campeonato,
      dataSegura,
    ]);

    console.log(`\n[BANCO DE DADOS] Busca do atleta: ${id_atleta}`);
    console.log(`Data segura usada na busca: ${dataSegura}`);
    console.log(`Resultado do Banco:`, rows);

    return rows.length > 0 && rows[0].tipo_evento !== null;
  }
}
