import { pool } from '../config/database.js';

export class EstatisticaRepository {
  async obterCentral(idCampeonato?: string) {
    const filtro = idCampeonato ?? null;

    const [resumo, artilheiros, assistentes, disciplina, clubes] = await Promise.all([
      pool.query(`
        SELECT
          COUNT(*) FILTER (WHERE status = 'encerrado')::int AS partidas_finalizadas,
          COUNT(*) FILTER (WHERE status = 'em_andamento')::int AS partidas_ao_vivo,
          COALESCE(SUM(gols_mandante + gols_visitante) FILTER (WHERE status = 'encerrado'), 0)::int AS gols,
          COUNT(DISTINCT id_campeonato)::int AS campeonatos
        FROM partidas
        WHERE ($1::uuid IS NULL OR id_campeonato = $1)
      `, [filtro]),
      pool.query(`
        SELECT a.id_atleta, a.nome, a.foto_perfil, c.nome AS clube, COUNT(*)::int AS total
        FROM eventos_sumula e
        JOIN partidas p ON p.id_partida = e.id_partida
        JOIN atletas a ON a.id_atleta = e.id_atleta
        LEFT JOIN clubes c ON c.id_clube = a.id_clube
        WHERE e.tipo_evento = 'GOL' AND e.cancelado = false AND ($1::uuid IS NULL OR p.id_campeonato = $1)
        GROUP BY a.id_atleta, a.nome, a.foto_perfil, c.nome
        ORDER BY total DESC, a.nome ASC
        LIMIT 10
      `, [filtro]),
      pool.query(`
        SELECT a.id_atleta, a.nome, c.nome AS clube, COUNT(*)::int AS total
        FROM eventos_sumula e
        JOIN partidas p ON p.id_partida = e.id_partida
        JOIN atletas a ON a.id_atleta = COALESCE(e.id_atleta_relacionado, e.id_atleta_assistencia)
        LEFT JOIN clubes c ON c.id_clube = a.id_clube
        WHERE e.tipo_evento = 'GOL'
          AND e.cancelado = false
          AND COALESCE(e.id_atleta_relacionado, e.id_atleta_assistencia) IS NOT NULL
          AND ($1::uuid IS NULL OR p.id_campeonato = $1)
        GROUP BY a.id_atleta, a.nome, c.nome
        ORDER BY total DESC, a.nome ASC
        LIMIT 10
      `, [filtro]),
      pool.query(`
        SELECT a.id_atleta, a.nome, c.nome AS clube,
          COUNT(*) FILTER (WHERE e.tipo_evento = 'CARTAO_AMARELO')::int AS amarelos,
          COUNT(*) FILTER (WHERE e.tipo_evento = 'CARTAO_VERMELHO')::int AS vermelhos
        FROM eventos_sumula e
        JOIN partidas p ON p.id_partida = e.id_partida
        JOIN atletas a ON a.id_atleta = e.id_atleta
        LEFT JOIN clubes c ON c.id_clube = a.id_clube
        WHERE e.tipo_evento IN ('CARTAO_AMARELO', 'CARTAO_VERMELHO')
          AND e.cancelado = false
          AND ($1::uuid IS NULL OR p.id_campeonato = $1)
        GROUP BY a.id_atleta, a.nome, c.nome
        ORDER BY vermelhos DESC, amarelos DESC, a.nome ASC
        LIMIT 10
      `, [filtro]),
      pool.query(`
        SELECT c.id_clube, c.nome,
          COUNT(DISTINCT p.id_partida)::int AS jogos,
          COALESCE(SUM(CASE WHEN p.id_mandante = c.id_clube THEN p.gols_mandante ELSE p.gols_visitante END), 0)::int AS gols,
          COALESCE(SUM(CASE WHEN p.id_mandante = c.id_clube THEN p.gols_visitante ELSE p.gols_mandante END), 0)::int AS sofridos
        FROM clubes c
        JOIN partidas p ON c.id_clube IN (p.id_mandante, p.id_visitante) AND p.status = 'encerrado'
        WHERE ($1::uuid IS NULL OR p.id_campeonato = $1)
        GROUP BY c.id_clube, c.nome
        ORDER BY gols DESC, sofridos ASC, c.nome ASC
        LIMIT 10
      `, [filtro]),
    ]);

    return {
      resumo: resumo.rows[0],
      lideres: {
        gols: artilheiros.rows,
        assistencias: assistentes.rows,
        disciplina: disciplina.rows,
      },
      clubes: clubes.rows,
    };
  }
}
