import { useEffect, useMemo, useState } from 'react';
import { CalendarDays, Eye, EyeOff, MapPin, Radio, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import type { Match } from '../types/api';

type Filter = 'todos' | 'em_andamento' | 'agendado' | 'encerrado';

export function GamesAndResults() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [filter, setFilter] = useState<Filter>('todos');
  const [query, setQuery] = useState('');
  const [hideScores, setHideScores] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try { setMatches((await api.get<Match[]>('/partidas')).data); }
      finally { setLoading(false); }
    };
    void load();
    const timer = window.setInterval(load, 5000);
    return () => window.clearInterval(timer);
  }, []);

  const filtered = useMemo(() => matches.filter(match =>
    (filter === 'todos' || match.status === filter)
    && `${match.mandante?.nome} ${match.visitante?.nome} ${match.campeonato?.nome}`.toLowerCase().includes(query.toLowerCase()),
  ), [matches, filter, query]);

  return <main className="page-enter app-shell flex-1 py-12">
    <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end"><div><p className="eyebrow">Agenda oficial</p><h1 className="font-display mt-3 text-6xl leading-none md:text-8xl">PARTIDAS & RESULTADOS</h1><p className="mt-4 max-w-xl text-sm leading-6 text-[var(--muted-foreground)]">Calendário, placares e atualizações oficiais das competições Zenith.</p></div><div className="flex gap-3"><Metric value={matches.filter(match => match.status === 'em_andamento').length} label="Ao vivo" /><Metric value={matches.length} label="Partidas" /></div></div>
    <section className="surface-panel my-9 flex flex-col gap-4 rounded-2xl p-3 md:flex-row md:items-center"><div className="scrollbar-hide flex flex-1 items-center gap-1 overflow-x-auto rounded-xl bg-[var(--background)]/40 p-1">{([['todos', 'Todas'], ['em_andamento', 'Ao vivo'], ['agendado', 'Próximas'], ['encerrado', 'Finalizadas']] as [Filter, string][]).map(([id, label]) => <button key={id} onClick={() => setFilter(id)} className={`shrink-0 rounded-lg px-4 py-2.5 text-xs font-bold transition-all ${filter === id ? 'bg-[var(--primary)] text-[var(--primary-foreground)] shadow-sm' : 'text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]'}`}>{label}</button>)}</div><div className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--input-background)] px-3 transition-colors focus-within:border-[var(--primary)]"><Search className="h-4 w-4 text-[var(--muted-foreground)]" /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Buscar equipe ou competição" className="w-full bg-transparent py-2.5 text-sm outline-none md:w-64" /></div><button onClick={() => setHideScores(!hideScores)} className="icon-button" title="Ocultar placares">{hideScores ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></section>
    {loading ? <div className="h-64 animate-pulse rounded-3xl bg-[var(--muted)]" /> : <div className="grid gap-3">{filtered.map(match => <MatchRow key={match.id_partida} match={match} hideScores={hideScores} />)}{!filtered.length && <div className="rounded-3xl border border-dashed border-[var(--border)] py-20 text-center"><CalendarDays className="mx-auto h-9 w-9 text-[var(--muted-foreground)]" /><p className="mt-4 font-bold">Nenhuma partida encontrada</p><p className="mt-1 text-sm text-[var(--muted-foreground)]">Ajuste os filtros para ver outros jogos.</p></div>}</div>}
  </main>;
}

function MatchRow({ match, hideScores }: { match: Match; hideScores: boolean }) {
  const live = match.status === 'em_andamento';
  return <Link to={`/matches/${match.id_partida}`} className="group grid gap-5 rounded-2xl border border-[var(--border)] bg-[var(--surface-glass)] p-5 transition-all hover:-translate-y-0.5 hover:border-[color:var(--primary)]/35 md:grid-cols-[180px_1fr_auto] md:items-center"><div><p className="text-[.65rem] font-black uppercase tracking-[.15em] text-[var(--primary)]">{match.campeonato?.nome || 'Competição'}</p><p className="mt-2 flex items-center gap-1.5 text-xs text-[var(--muted-foreground)]"><CalendarDays className="h-3.5 w-3.5" />{String(match.data).slice(0, 10).split('-').reverse().join('/')} · {match.hora.slice(0, 5)}</p><p className="mt-1 flex items-center gap-1.5 truncate text-xs text-[var(--muted-foreground)]"><MapPin className="h-3.5 w-3.5" />{match.local}</p></div><div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4"><p className="text-right text-sm font-bold md:text-base">{match.mandante?.nome || 'Mandante'}</p><div className="font-display min-w-24 text-center text-4xl">{hideScores ? '– : –' : `${match.gols_mandante} : ${match.gols_visitante}`}</div><p className="text-sm font-bold md:text-base">{match.visitante?.nome || 'Visitante'}</p></div><span className={`inline-flex w-fit items-center gap-2 rounded-full px-3 py-2 text-[.65rem] font-black tracking-wider ${live ? 'bg-red-500/10 text-red-400' : 'bg-[var(--muted)] text-[var(--muted-foreground)]'}`}>{live && <Radio className="h-3 w-3" />}{match.status.replaceAll('_', ' ').toUpperCase()}</span></Link>;
}

function Metric({ value, label }: { value: number; label: string }) { return <div className="min-w-24 rounded-2xl border border-[var(--border)] bg-[var(--surface-glass)] p-4"><strong className="font-display block text-4xl font-normal">{value}</strong><span className="text-[.65rem] font-bold uppercase tracking-wider text-[var(--muted-foreground)]">{label}</span></div>; }
