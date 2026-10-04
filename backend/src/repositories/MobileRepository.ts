import { randomUUID } from 'node:crypto';
import { PoolClient } from 'pg';
import { pool } from '../config/database.js';
import { BusinessRuleError } from '../errors/BusinessRuleError.js';
import { NotFoundError } from '../errors/NotFoundError.js';

export type MobileOperation = { operationId: string; matchId: string; entity: string; action: string; timestamp: number; data: Record<string, unknown> };

export class MobileRepository {
  async listOfficials() {
    const { rows } = await pool.query("SELECT id_usuario, nome, email FROM usuarios WHERE role='mesario' ORDER BY nome");
    return rows;
  }
  async listMatches(userId: string, role: string) {
    const restriction = role === 'admin' ? '' : 'AND EXISTS (SELECT 1 FROM partidas_mesarios pm WHERE pm.id_partida = p.id_partida AND pm.id_usuario = $1)';
    const { rows } = await pool.query(`SELECT p.*, m.nome AS nome_mandante, v.nome AS nome_visitante, c.nome AS nome_campeonato, c.modalidade, c.categoria
      FROM partidas p JOIN clubes m ON m.id_clube=p.id_mandante JOIN clubes v ON v.id_clube=p.id_visitante JOIN campeonatos c ON c.id_campeonato=p.id_campeonato
      WHERE p.status <> 'cancelado' ${restriction} ORDER BY p.data, p.hora`, role === 'admin' ? [] : [userId]);
    return rows;
  }

  async getPackage(matchId: string, userId: string, role: string) {
    await this.assertAccess(pool, matchId, userId, role);
    const [match, clubs, athletes, people, roster] = await Promise.all([
      pool.query(`SELECT p.*, m.nome AS nome_mandante, v.nome AS nome_visitante, c.nome AS nome_campeonato, c.modalidade, c.categoria FROM partidas p JOIN clubes m ON m.id_clube=p.id_mandante JOIN clubes v ON v.id_clube=p.id_visitante JOIN campeonatos c ON c.id_campeonato=p.id_campeonato WHERE p.id_partida=$1`, [matchId]),
      pool.query(`SELECT c.* FROM clubes c JOIN partidas p ON c.id_clube IN (p.id_mandante,p.id_visitante) WHERE p.id_partida=$1`, [matchId]),
      pool.query(`SELECT a.*, CASE WHEN a.status='ativo' THEN true ELSE false END AS elegivel, CASE WHEN a.status='ativo' THEN NULL ELSE 'Status no BID: ' || a.status END AS observacao_elegibilidade FROM atletas a JOIN partidas p ON a.id_clube IN (p.id_mandante,p.id_visitante) WHERE p.id_partida=$1 ORDER BY a.id_clube,a.nome`, [matchId]),
      pool.query('SELECT * FROM pessoas_partida WHERE id_partida=$1 ORDER BY funcao,nome', [matchId]),
      pool.query('SELECT * FROM escalacoes_partida WHERE id_partida=$1', [matchId]),
    ]);
    if (!match.rows[0]) throw new NotFoundError('Partida não encontrada.');
    return { partida: match.rows[0], clubes: clubs.rows, atletas: athletes.rows, pessoas: people.rows, escalacoes: roster.rows, baixadoEm: Date.now() };
  }

  async assign(matchId: string, userId: string) {
    const { rows } = await pool.query(`INSERT INTO partidas_mesarios(id_partida,id_usuario) VALUES($1,$2) ON CONFLICT DO NOTHING RETURNING *`, [matchId, userId]);
    return rows[0] ?? { id_partida: matchId, id_usuario: userId };
  }

  async sync(userId: string, role: string, operations: MobileOperation[]) {
    const client = await pool.connect(); const accepted: string[] = [];
    try {
      await client.query('BEGIN');
      for (const op of operations) {
        await this.assertAccess(client, op.matchId, userId, role);
        const inserted = await client.query(`INSERT INTO operacoes_mobile(operation_id,id_usuario,id_partida,entidade,acao,payload,criado_no_dispositivo)
          VALUES($1,$2,$3,$4,$5,$6,to_timestamp($7/1000.0)) ON CONFLICT(operation_id) DO NOTHING RETURNING operation_id`,
          [op.operationId, userId, op.matchId, op.entity, op.action, JSON.stringify(op.data), op.timestamp]);
        if (inserted.rowCount) await this.applyOperation(client, op);
        accepted.push(op.operationId);
      }
      await client.query('COMMIT'); return accepted;
    } catch (error) { await client.query('ROLLBACK'); throw error; } finally { client.release(); }
  }

  private async assertAccess(db: { query: PoolClient['query'] }, matchId: string, userId: string, role: string) {
    const { rowCount } = await db.query(`SELECT 1 FROM partidas p WHERE p.id_partida=$1 AND ($3='admin' OR EXISTS(SELECT 1 FROM partidas_mesarios pm WHERE pm.id_partida=p.id_partida AND pm.id_usuario=$2))`, [matchId, userId, role]);
    if (!rowCount) throw new BusinessRuleError('Usuário não está autorizado para esta partida.');
  }

  private async applyOperation(client: PoolClient, op: MobileOperation) {
    const d = op.data;
    if (op.entity === 'roster') {
      if (!d.athleteId || !d.clubId) throw new BusinessRuleError('Operação de elenco sem atleta ou clube.');
      await client.query(`INSERT INTO escalacoes_partida(id_partida,id_atleta,id_clube,numero_camisa,confirmado,elegivel,observacao_elegibilidade,titular,capitao,checkin_em)
        VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,CASE WHEN $5 THEN NOW() ELSE NULL END)
        ON CONFLICT(id_partida,id_atleta) DO UPDATE SET numero_camisa=COALESCE(EXCLUDED.numero_camisa,escalacoes_partida.numero_camisa), confirmado=EXCLUDED.confirmado, titular=EXCLUDED.titular, capitao=EXCLUDED.capitao, checkin_em=EXCLUDED.checkin_em, atualizado_em=NOW()`,
        [op.matchId,d.athleteId,d.clubId,d.shirtNumber ?? null,d.confirmed ?? false,d.eligible ?? true,d.eligibilityNote ?? null,d.starter ?? false,d.captain ?? false]);
      return;
    }
    if (op.entity === 'signature') {
      let path: unknown = d.pathData; if (typeof path === 'string') { try { path = JSON.parse(path); } catch { path = { raw: path }; } }
      await client.query(`INSERT INTO assinaturas_sumula(id_assinatura,id_partida,nome_signatario,funcao_signatario,fase,path_data,assinado_em)
        VALUES($1,$2,$3,$4,$5,$6,to_timestamp($7/1000.0)) ON CONFLICT(id_partida,funcao_signatario,fase) DO UPDATE SET nome_signatario=EXCLUDED.nome_signatario,path_data=EXCLUDED.path_data,assinado_em=EXCLUDED.assinado_em`,
        [randomUUID(),op.matchId,d.name,d.role,d.phase,JSON.stringify(path),d.signedAt]); return;
    }
    if (op.entity === 'event') {
      await client.query(`INSERT INTO eventos_sumula(id_evento,id_partida,id_atleta,id_clube,tipo_evento,id_atleta_relacionado,minuto_evento,segundo_evento,periodo,sequencia,detalhe_evento,timestamp_offline)
        VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,to_timestamp($12/1000.0))`,
        [randomUUID(),op.matchId,d.athleteId ?? null,d.clubId,d.type,d.relatedAthleteId ?? null,d.minute ?? 0,d.second ?? 0,d.period ?? '1T',d.sequence ?? op.timestamp,d.detail ?? null,op.timestamp]);
      if (d.type === 'GOL') await client.query(`UPDATE partidas SET gols_mandante=gols_mandante+CASE WHEN id_mandante=(CASE WHEN $3='CONTRA' THEN CASE WHEN id_mandante=$2 THEN id_visitante ELSE id_mandante END ELSE $2::uuid END) THEN 1 ELSE 0 END,gols_visitante=gols_visitante+CASE WHEN id_visitante=(CASE WHEN $3='CONTRA' THEN CASE WHEN id_mandante=$2 THEN id_visitante ELSE id_mandante END ELSE $2::uuid END) THEN 1 ELSE 0 END WHERE id_partida=$1`, [op.matchId,d.clubId,d.detail ?? null]);
      return;
    }
    if (op.entity === 'clock') {
      await client.query(`INSERT INTO periodos_partida(id_partida,periodo,segundos,em_andamento) VALUES($1,$2,$3,$4) ON CONFLICT(id_partida,periodo) DO UPDATE SET segundos=EXCLUDED.segundos,em_andamento=EXCLUDED.em_andamento,atualizado_em=NOW()`, [op.matchId,d.period ?? '1T',d.elapsed ?? 0,op.action === 'start']);
      if (op.action === 'start') await client.query("UPDATE partidas SET status='em_andamento' WHERE id_partida=$1 AND status='agendado'", [op.matchId]);
      return;
    }
    if (op.entity === 'match' && op.action === 'close') { await client.query(`UPDATE partidas SET status='encerrado', gols_mandante=$2, gols_visitante=$3 WHERE id_partida=$1`, [op.matchId,Array.isArray(d.score) ? d.score[0] : 0,Array.isArray(d.score) ? d.score[1] : 0]); return; }
    throw new BusinessRuleError(`Operação mobile não suportada: ${op.entity}/${op.action}.`);
  }
}
