import type { Match } from '../types/api';

export const MOCK_LIVE_MATCHES: Match[] = [
  {
    id_partida: 'mock-live-1',
    id_campeonato: 'camp-cearense-futsal',
    id_mandante: 'clube-fortaleza-futsal',
    id_visitante: 'clube-ceara-futsal',
    data: new Date().toISOString().slice(0, 10),
    hora: '19:30:00',
    local: 'Ginásio Paulo Sarasate, Fortaleza',
    status: 'em_andamento',
    gols_mandante: 3,
    gols_visitante: 2,
    mandante: { nome: 'Fortaleza Futsal', brasao: null },
    visitante: { nome: 'Ceará Futsal', brasao: null },
    campeonato: { nome: 'Campeonato Cearense', categoria: 'Profissional' },
  },
  {
    id_partida: 'mock-live-2',
    id_campeonato: 'camp-jaguaribano',
    id_mandante: 'clube-tabuleiro',
    id_visitante: 'clube-limoeiro',
    data: new Date().toISOString().slice(0, 10),
    hora: '20:15:00',
    local: 'Ginásio Poliesportivo de Tabuleiro do Norte',
    status: 'em_andamento',
    gols_mandante: 2,
    gols_visitante: 2,
    mandante: { nome: 'Tabuleiro Futsal Clube', brasao: null },
    visitante: { nome: 'Limoeiro Esporte Clube', brasao: null },
    campeonato: { nome: 'Copa Jaguaribana', categoria: 'Adulto' },
  },
  {
    id_partida: 'mock-live-3',
    id_campeonato: 'camp-circuito-vale',
    id_mandante: 'clube-russas',
    id_visitante: 'clube-morada-nova',
    data: new Date().toISOString().slice(0, 10),
    hora: '18:45:00',
    local: 'Arena Municipal de Russas',
    status: 'em_andamento',
    gols_mandante: 4,
    gols_visitante: 1,
    mandante: { nome: 'Russas Futsal', brasao: null },
    visitante: { nome: 'Morada Nova F.C.', brasao: null },
    campeonato: { nome: 'Circuito Vale do Jaguaribe', categoria: 'Principal' },
  },
  {
    id_partida: 'mock-live-4',
    id_campeonato: 'camp-sertao-central',
    id_mandante: 'clube-quixada',
    id_visitante: 'clube-caninde',
    data: new Date().toISOString().slice(0, 10),
    hora: '21:00:00',
    local: 'Ginásio Gonzaga Mota, Quixadá',
    status: 'em_andamento',
    gols_mandante: 1,
    gols_visitante: 0,
    mandante: { nome: 'Quixadá Futsal', brasao: null },
    visitante: { nome: 'Canindé E.C.', brasao: null },
    campeonato: { nome: 'Copa Sertão Central', categoria: 'Adulto' },
  },
];

export const MOCK_SCHEDULED_MATCHES: Match[] = [
  {
    id_partida: 'mock-sched-1',
    id_campeonato: 'camp-cearense-futsal',
    id_mandante: 'clube-horizonte',
    id_visitante: 'clube-eusebio',
    data: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
    hora: '19:00:00',
    local: 'Ginásio Domingão, Horizonte',
    status: 'agendado',
    gols_mandante: 0,
    gols_visitante: 0,
    mandante: { nome: 'Horizonte Futsal', brasao: null },
    visitante: { nome: 'Eusébio Futsal', brasao: null },
    campeonato: { nome: 'Campeonato Cearense', categoria: 'Profissional' },
  },
  {
    id_partida: 'mock-sched-2',
    id_campeonato: 'camp-norte',
    id_mandante: 'clube-sobral',
    id_visitante: 'clube-tiangua',
    data: new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 10),
    hora: '20:30:00',
    local: 'Poliesportivo Dr. Plínio Pompeu, Sobral',
    status: 'agendado',
    gols_mandante: 0,
    gols_visitante: 0,
    mandante: { nome: 'Sobral Futsal', brasao: null },
    visitante: { nome: 'Tianguá F.C.', brasao: null },
    campeonato: { nome: 'Copa Zona Norte', categoria: 'Série Ouro' },
  },
  {
    id_partida: 'mock-sched-3',
    id_campeonato: 'camp-metropolitano',
    id_mandante: 'clube-maranguape',
    id_visitante: 'clube-pacajus',
    data: new Date(Date.now() + 86400000 * 3).toISOString().slice(0, 10),
    hora: '21:00:00',
    local: 'Ginásio da Mocinha, Maranguape',
    status: 'agendado',
    gols_mandante: 0,
    gols_visitante: 0,
    mandante: { nome: 'Maranguape Futsal', brasao: null },
    visitante: { nome: 'Pacajus F.C.', brasao: null },
    campeonato: { nome: 'Metropolitano Cearense', categoria: 'Adulto' },
  },
];

export const MOCK_FINISHED_MATCHES: Match[] = [
  {
    id_partida: 'mock-fin-1',
    id_campeonato: 'camp-litoral',
    id_mandante: 'clube-aracati',
    id_visitante: 'clube-jaguaruana',
    data: new Date(Date.now() - 86400000).toISOString().slice(0, 10),
    hora: '17:00:00',
    local: 'Ginásio Senador Virgílio Távora, Aracati',
    status: 'encerrado',
    gols_mandante: 5,
    gols_visitante: 3,
    mandante: { nome: 'Aracati Futsal', brasao: null },
    visitante: { nome: 'Jaguaruana F.C.', brasao: null },
    campeonato: { nome: 'Copa Litoral Leste', categoria: 'Final' },
  },
  {
    id_partida: 'mock-fin-2',
    id_campeonato: 'camp-sertao-central',
    id_mandante: 'clube-quixeramobim',
    id_visitante: 'clube-senador-pompeu',
    data: new Date(Date.now() - 86400000 * 2).toISOString().slice(0, 10),
    hora: '19:30:00',
    local: 'Ginásio Municipal de Quixeramobim',
    status: 'encerrado',
    gols_mandante: 2,
    gols_visitante: 1,
    mandante: { nome: 'Quixeramobim F.C.', brasao: null },
    visitante: { nome: 'Senador Pompeu Futsal', brasao: null },
    campeonato: { nome: 'Copa Sertão Central', categoria: 'Final' },
  },
  {
    id_partida: 'mock-fin-3',
    id_campeonato: 'camp-cariri',
    id_mandante: 'clube-crato',
    id_visitante: 'clube-barbalha',
    data: new Date(Date.now() - 86400000 * 3).toISOString().slice(0, 10),
    hora: '20:00:00',
    local: 'Ginásio Poliesportivo do Crato',
    status: 'encerrado',
    gols_mandante: 4,
    gols_visitante: 2,
    mandante: { nome: 'Crato F.C.', brasao: null },
    visitante: { nome: 'Barbalha Futsal', brasao: null },
    campeonato: { nome: 'Circuito Cariri de Futsal', categoria: 'Final' },
  },
];

/**
 * Ordena a sequência do carrossel para que:
 * 1. Jogos ao vivo (em_andamento) tenham PRIORIDADE e apareçam no início.
 * 2. Próximas (agendado) e finalizadas (encerrado) apareçam INTERCALADAS (alternadas),
 *    evitando que fiquem agrupadas no final caso as listas tenham tamanhos diferentes.
 */
export function sequenceMatches(matches: Match[]): Match[] {
  if (!matches || !matches.length) return [];

  const live = matches.filter(m => m.status === 'em_andamento');
  const scheduled = matches.filter(m => m.status === 'agendado');
  const finished = matches.filter(m => m.status === 'encerrado');
  const others = matches.filter(
    m => m.status !== 'em_andamento' && m.status !== 'agendado' && m.status !== 'encerrado'
  );

  // Jogos ao vivo têm prioridade quando existirem
  const result: Match[] = [...live];

  // Intercalar próximas e finalizadas sem agrupar
  if (scheduled.length > 0 && finished.length > 0) {
    const maxLen = Math.max(scheduled.length, finished.length);
    for (let i = 0; i < maxLen; i++) {
      result.push(scheduled[i % scheduled.length]);
      result.push(finished[i % finished.length]);
    }
  } else if (scheduled.length > 0) {
    result.push(...scheduled);
  } else if (finished.length > 0) {
    result.push(...finished);
  }

  // Adiciona outros status (ex: cancelado) ao fim
  result.push(...others);

  return result;
}

/**
 * Prepara a lista de partidas do carrossel:
 * Garante dados fictícios para partidas em andamento caso a API ainda não possua,
 * além de dados para intercalação equilibrada.
 */
export function prepareCarouselMatches(apiMatches: Match[]): Match[] {
  const existing = apiMatches || [];

  // Se a API não tiver partidas em andamento, injeta os dados fictícios de ao vivo
  const liveFromApi = existing.filter(m => m.status === 'em_andamento');
  const liveToUse = liveFromApi.length > 0 ? liveFromApi : MOCK_LIVE_MATCHES;

  // Próximas da API ou mock
  const scheduledFromApi = existing.filter(m => m.status === 'agendado');
  const scheduledToUse = scheduledFromApi.length > 0 ? scheduledFromApi : MOCK_SCHEDULED_MATCHES;

  // Finalizadas da API ou mock
  const finishedFromApi = existing.filter(m => m.status === 'encerrado');
  const finishedToUse = finishedFromApi.length > 0 ? finishedFromApi : MOCK_FINISHED_MATCHES;

  // Outras da API
  const othersFromApi = existing.filter(
    m => m.status !== 'em_andamento' && m.status !== 'agendado' && m.status !== 'encerrado'
  );

  const combined = [
    ...liveToUse,
    ...scheduledToUse,
    ...finishedToUse,
    ...othersFromApi,
  ];

  return sequenceMatches(combined);
}
