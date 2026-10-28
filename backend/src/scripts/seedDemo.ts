import bcrypt from 'bcrypt';
import { prisma } from '../config/prisma.js';

const id = (group: number, value: number) =>
  `${String(group).padStart(8, '0')}-0000-4000-8000-${String(value).padStart(12, '0')}`;
const day = (offset: number) => {
  const date = new Date();
  date.setUTCHours(12, 0, 0, 0);
  date.setUTCDate(date.getUTCDate() + offset);
  return date;
};
const time = (hour: number, minute = 0) => new Date(`1970-01-01T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00.000Z`);

const clubNames = ['Aurora FC', 'Atlético Zenith', 'Estrela do Norte', 'Império Futsal', 'Lobos da Serra', 'Náutico Central', 'Real Horizonte', 'União Metropolitana'];
const firstNames = ['Arthur', 'Bernardo', 'Caio', 'Davi', 'Enzo', 'Felipe', 'Gabriel', 'Hugo', 'Ícaro', 'João', 'Kaique', 'Lucas', 'Matheus', 'Nicolas', 'Otávio', 'Pedro'];
const lastNames = ['Almeida', 'Barbosa', 'Cardoso', 'Dias', 'Esteves', 'Ferreira', 'Gomes', 'Henrique', 'Lima', 'Martins', 'Nascimento', 'Oliveira', 'Pereira', 'Rocha', 'Silva', 'Teixeira'];
const photos = [
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=900&q=85',
];

async function main() {
  const password = await bcrypt.hash('Zenith@2026', 12);
  const userIds = [id(5, 1), id(5, 2), id(5, 3)];
  const users = [
    { id_usuario: userIds[0], nome: 'Administrador Zenith', email: 'admin.demo@zenithsportsos.com', role: 'admin' },
    { id_usuario: userIds[1], nome: 'Marina Costa', email: 'gestor.demo@zenithsportsos.com', role: 'gestor' },
    { id_usuario: userIds[2], nome: 'Rafael Nunes', email: 'mesario.demo@zenithsportsos.com', role: 'mesario' },
  ];
  for (const user of users) await prisma.usuario.upsert({ where: { id_usuario: user.id_usuario }, update: { ...user, senha: password }, create: { ...user, senha: password } });

  const clubIds = clubNames.map((_, index) => id(1, index + 1));
  for (let index = 0; index < clubNames.length; index++) {
    const name = clubNames[index];
    const data = {
      id_clube: clubIds[index], nome: name,
      brasao: `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=b6ff2e,111814,25312a&fontFamily=Arial&fontWeight=700`,
      cores_oficiais: index % 2 ? 'Preto, branco e verde-lima' : 'Verde-lima, grafite e branco',
      responsavel: `${firstNames[index]} ${lastNames[index]}`,
      cnpj: `10.000.${String(index + 1).padStart(3, '0')}/0001-${String(10 + index)}`,
    };
    await prisma.clube.upsert({ where: { id_clube: data.id_clube }, update: data, create: data });
  }

  const athleteIds: string[][] = [];
  for (let club = 0; club < clubIds.length; club++) {
    athleteIds[club] = [];
    for (let player = 0; player < 8; player++) {
      const number = club * 8 + player + 1;
      const athleteId = id(2, number);
      athleteIds[club].push(athleteId);
      const data = {
        id_atleta: athleteId,
        nome: `${firstNames[(club * 2 + player) % firstNames.length]} ${lastNames[(club * 3 + player * 2) % lastNames.length]}`,
        cpf: `${String(100 + club)}.${String(200 + player).padStart(3, '0')}.${String(300 + number).slice(-3)}-${String(10 + number).slice(-2)}`,
        rg: `ZEN-${String(number).padStart(6, '0')}`,
        foto_perfil: photos[number % photos.length],
        data_nasc: new Date(Date.UTC(1994 + (number % 9), number % 12, 2 + (number % 24))),
        status: number % 19 === 0 ? 'suspenso' : 'ativo',
        peso: 64 + (number % 22), altura: 1.66 + (number % 20) / 100,
        tipo_sanguineo: ['A+', 'O+', 'B+', 'AB+'][number % 4], id_clube: clubIds[club],
      };
      await prisma.atleta.upsert({ where: { id_atleta: athleteId }, update: data, create: data });
    }
  }

  const championships = [
    { id_campeonato: id(3, 1), nome: 'Liga Zenith de Futsal', formato: 'Pontos corridos e mata-mata', data_inicio: day(-75), data_fim: day(45), criterios_desempate: 'Saldo de gols, gols marcados e confronto direto', status: 'em andamento', modalidade: 'futsal', categoria: 'profissional' },
    { id_campeonato: id(3, 2), nome: 'Copa Horizonte Sub-21', formato: 'Grupos e eliminatórias', data_inicio: day(-40), data_fim: day(30), criterios_desempate: 'Saldo de gols e fair play', status: 'em andamento', modalidade: 'futebol', categoria: 'sub-21' },
    { id_campeonato: id(3, 3), nome: 'Supercopa Zenith 2026', formato: 'Mata-mata', data_inicio: day(-180), data_fim: day(-120), criterios_desempate: 'Pênaltis', status: 'finalizado', modalidade: 'futsal', categoria: 'profissional' },
    { id_campeonato: id(3, 4), nome: 'Festival de Base Zenith', formato: 'Grupos', data_inicio: day(60), data_fim: day(95), criterios_desempate: 'Saldo de gols', status: 'planejado', modalidade: 'futebol', categoria: 'sub-17' },
  ];
  for (const championship of championships) {
    await prisma.campeonato.upsert({ where: { id_campeonato: championship.id_campeonato }, update: championship, create: championship });
    for (const clubId of clubIds) await prisma.campeonatoClube.upsert({ where: { id_campeonato_id_clube: { id_campeonato: championship.id_campeonato, id_clube: clubId } }, update: {}, create: { id_campeonato: championship.id_campeonato, id_clube: clubId } });
  }

  const matches: { matchId: string; home: number; away: number; status: 'agendado' | 'em_andamento' | 'encerrado' | 'cancelado'; homeGoals: number; awayGoals: number; champ: number; offset: number }[] = [];
  for (let index = 0; index < 32; index++) {
    const champ = index < 14 ? 0 : index < 22 ? 1 : index < 28 ? 2 : 3;
    const localIndex = champ === 0 ? index : champ === 1 ? index - 14 : champ === 2 ? index - 22 : index - 28;
    const status = index < 2 ? 'em_andamento' : index < 18 || (index >= 22 && index < 28) ? 'encerrado' : index === 21 ? 'cancelado' : 'agendado';
    const home = (localIndex * 2 + champ) % 8;
    let away = (home + 1 + (localIndex % 5)) % 8;
    if (away === home) away = (away + 1) % 8;
    const played = status === 'encerrado' || status === 'em_andamento';
    const homeGoals = played ? (index * 3 + 2) % 6 : 0;
    const awayGoals = played ? (index * 2 + 1) % 5 : 0;
    const offset = status === 'em_andamento' ? 0 : status === 'encerrado' ? -(index + 2) : 2 + index;
    const matchId = id(4, index + 1);
    matches.push({ matchId, home, away, status, homeGoals, awayGoals, champ, offset });
    const data = { id_partida: matchId, id_campeonato: championships[champ].id_campeonato, id_mandante: clubIds[home], id_visitante: clubIds[away], data: day(offset), hora: time(18 + (index % 4), index % 2 ? 30 : 0), local: ['Arena Zenith', 'Ginásio Central', 'Estádio Horizonte', 'Complexo Aurora'][index % 4], status, gols_mandante: homeGoals, gols_visitante: awayGoals };
    await prisma.partida.upsert({ where: { id_partida: matchId }, update: data, create: data });

    await prisma.partidaMesario.upsert({ where: { id_partida_id_usuario: { id_partida: matchId, id_usuario: userIds[2] } }, update: {}, create: { id_partida: matchId, id_usuario: userIds[2] } });
    const participatingClubs = [home, away];
    for (const clubIndex of participatingClubs) {
      for (let player = 0; player < 8; player++) {
        const athleteId = athleteIds[clubIndex][player];
        await prisma.escalacaoPartida.upsert({
          where: { id_partida_id_atleta: { id_partida: matchId, id_atleta: athleteId } },
          update: { numero_camisa: player + 1, confirmado: status !== 'agendado', elegivel: player !== 7 || index % 3 !== 0, observacao_elegibilidade: player === 7 && index % 3 === 0 ? 'Suspensão automática' : null, titular: player < 5, capitao: player === 0, checkin_em: status === 'agendado' ? null : day(offset) },
          create: { id_partida: matchId, id_atleta: athleteId, id_clube: clubIds[clubIndex], numero_camisa: player + 1, confirmado: status !== 'agendado', elegivel: player !== 7 || index % 3 !== 0, observacao_elegibilidade: player === 7 && index % 3 === 0 ? 'Suspensão automática' : null, titular: player < 5, capitao: player === 0, checkin_em: status === 'agendado' ? null : day(offset) },
        });
      }
    }
    const people = [
      { suffix: 1, club: home, nome: `Técnico ${clubNames[home]}`, funcao: 'tecnico' },
      { suffix: 2, club: away, nome: `Técnico ${clubNames[away]}`, funcao: 'tecnico' },
      { suffix: 3, club: null, nome: `Árbitro ${firstNames[index % firstNames.length]}`, funcao: 'arbitro_principal' },
      { suffix: 4, club: null, nome: `Auxiliar ${lastNames[index % lastNames.length]}`, funcao: 'arbitro_auxiliar' },
    ];
    for (const person of people) {
      const personId = id(7, index * 10 + person.suffix);
      const data = { id_pessoa: personId, id_partida: matchId, id_clube: person.club === null ? null : clubIds[person.club], nome: person.nome, funcao: person.funcao, documento: `DOC-${index + 1}-${person.suffix}` };
      await prisma.pessoaPartida.upsert({ where: { id_pessoa: personId }, update: data, create: data });
    }
    for (const period of ['1T', '2T']) await prisma.periodoPartida.upsert({ where: { id_partida_periodo: { id_partida: matchId, periodo: period } }, update: { segundos: status === 'em_andamento' ? (period === '1T' ? 1200 : 480 + index * 30) : status === 'encerrado' ? 1200 : 0, em_andamento: status === 'em_andamento' && period === '2T' }, create: { id_partida: matchId, periodo: period, segundos: status === 'em_andamento' ? (period === '1T' ? 1200 : 480 + index * 30) : status === 'encerrado' ? 1200 : 0, em_andamento: status === 'em_andamento' && period === '2T' } });

    if (played) {
      const allGoals = Array.from({ length: homeGoals }, (_, goal) => ({ clubIndex: home, athlete: athleteIds[home][goal % 5], assist: athleteIds[home][(goal + 1) % 5] })).concat(Array.from({ length: awayGoals }, (_, goal) => ({ clubIndex: away, athlete: athleteIds[away][goal % 5], assist: athleteIds[away][(goal + 2) % 5] })));
      let sequence = 1;
      for (const goal of allGoals) {
        const eventId = id(6, index * 100 + sequence);
        const data = { id_evento: eventId, id_partida: matchId, id_atleta: goal.athlete, id_clube: clubIds[goal.clubIndex], tipo_evento: 'GOL', id_atleta_assistencia: goal.assist, id_atleta_relacionado: goal.assist, minuto_evento: 3 + sequence * 4, segundo_evento: (sequence * 11) % 60, periodo: sequence * 4 > 20 ? '2T' : '1T', sequencia: BigInt(sequence), detalhe_evento: sequence % 5 === 0 ? 'PENALTI' : sequence % 4 === 0 ? 'CONTRA_ATAQUE' : 'NORMAL', timestamp_offline: day(offset), cancelado: false };
        await prisma.eventoSumula.upsert({ where: { id_evento: eventId }, update: data, create: data }); sequence++;
      }
      const extras = [
        { type: 'CARTAO_AMARELO', clubIndex: home, athlete: athleteIds[home][5], related: null, detail: 'CONDUTA_ANTIDESPORTIVA' },
        { type: 'CARTAO_AMARELO', clubIndex: away, athlete: athleteIds[away][4], related: null, detail: 'RECLAMACAO' },
        { type: 'SUBSTITUICAO', clubIndex: home, athlete: athleteIds[home][5], related: athleteIds[home][1], detail: 'ENTRADA_SAIDA' },
        { type: 'FALTA', clubIndex: away, athlete: athleteIds[away][3], related: null, detail: 'FALTA_ACUMULATIVA' },
        { type: 'PEDIDO_TEMPO', clubIndex: home, athlete: null, related: null, detail: 'TEMPO_TECNICO' },
      ];
      if (index % 4 === 0) extras.push({ type: 'CARTAO_VERMELHO', clubIndex: away, athlete: athleteIds[away][6], related: null, detail: 'JOGO_BRUSCO_GRAVE' });
      for (const extra of extras) {
        const eventId = id(6, index * 100 + sequence);
        const data = { id_evento: eventId, id_partida: matchId, id_atleta: extra.athlete, id_clube: clubIds[extra.clubIndex], tipo_evento: extra.type, id_atleta_assistencia: null, id_atleta_relacionado: extra.related, minuto_evento: 5 + sequence * 2, segundo_evento: (sequence * 7) % 60, periodo: sequence % 2 ? '1T' : '2T', sequencia: BigInt(sequence), detalhe_evento: extra.detail, timestamp_offline: day(offset), cancelado: false };
        await prisma.eventoSumula.upsert({ where: { id_evento: eventId }, update: data, create: data }); sequence++;
      }
      for (const [signatureIndex, signature] of [{ role: 'capitao_mandante', name: firstNames[home] }, { role: 'capitao_visitante', name: firstNames[away] }, { role: 'arbitro_principal', name: `Árbitro ${firstNames[index % firstNames.length]}` }].entries()) {
        for (const phase of ['PRE', ...(status === 'encerrado' ? ['POST'] : [])]) {
          const signatureId = id(8, index * 20 + signatureIndex * 2 + (phase === 'POST' ? 2 : 1));
          const data = { id_assinatura: signatureId, id_partida: matchId, nome_signatario: signature.name, funcao_signatario: signature.role, fase: phase, path_data: { points: [[12, 22], [28, 16], [48, 29], [65, 13]], demo: true }, assinado_em: day(offset) };
          await prisma.assinaturaSumula.upsert({ where: { id_partida_funcao_signatario_fase: { id_partida: matchId, funcao_signatario: signature.role, fase: phase } }, update: data, create: data });
        }
      }
      const operationId = `demo-sync-${String(index + 1).padStart(3, '0')}`;
      const operation = { operation_id: operationId, id_usuario: userIds[2], id_partida: matchId, entidade: 'sumula', acao: status === 'encerrado' ? 'FINALIZAR' : 'SINCRONIZAR', payload: { origem: 'seed-demo', eventos: allGoals.length + extras.length, placar: [homeGoals, awayGoals] }, criado_no_dispositivo: day(offset) };
      await prisma.operacaoMobile.upsert({ where: { operation_id: operationId }, update: operation, create: operation });
    }
  }

  const counts = await Promise.all([
    prisma.usuario.count(), prisma.clube.count(), prisma.atleta.count(), prisma.campeonato.count(), prisma.campeonatoClube.count(), prisma.partida.count(), prisma.partidaMesario.count(), prisma.eventoSumula.count(), prisma.escalacaoPartida.count(), prisma.assinaturaSumula.count(), prisma.pessoaPartida.count(), prisma.periodoPartida.count(), prisma.operacaoMobile.count(),
  ]);
  console.log('Carga demonstrativa Zenith concluída.');
  console.table({ usuarios: counts[0], clubes: counts[1], atletas: counts[2], campeonatos: counts[3], inscricoes: counts[4], partidas: counts[5], mesarios: counts[6], eventos: counts[7], escalacoes: counts[8], assinaturas: counts[9], pessoas: counts[10], periodos: counts[11], operacoes: counts[12] });
  console.log('Acessos demo: admin.demo@zenithsportsos.com, gestor.demo@zenithsportsos.com e mesario.demo@zenithsportsos.com | senha: Zenith@2026');
}

main().catch(error => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());
