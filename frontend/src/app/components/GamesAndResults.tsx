import { useEffect, useMemo, useState } from 'react';
import { CalendarDays, Eye, EyeOff, MapPin, Radio, Search, Shield } from 'lucide-react';
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
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setMatches((await api.get<Match[]>('/partidas')).data);
        setFailed(false);
      } catch {
        setFailed(true);
      } finally {
        setLoading(false);
      }
    };
    void load();
    const timer = window.setInterval(load, 5000);
    return () => window.clearInterval(timer);
  }, []);

  const filtered = useMemo(() => matches
    .filter(match => (filter === 'todos' || match.status === filter)
      && normalize(`${match.mandante?.nome} ${match.visitante?.nome} ${match.campeonato?.nome}`).includes(normalize(query)))
    .sort(sortMatches), [matches, filter, query]);

  const liveCount = matches.filter(match => match.status === 'em_andamento').length;

  return (
    <main className="page-enter app-shell flex-1 py-12 lg:py-16">
      <header className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
        <div><p className="eyebrow">Agenda oficial</p><h1 className="font-display mt-3 text-6xl leading-none md:text-8xl">PARTIDAS & RESULTADOS</h1><p className="mt-4 max-w-xl text-sm leading-6 text-[var(--muted-foreground)]">Calendário, placares e atualizações oficiais das competições Zenith.</p></div>
        <div className="flex gap-3"><Metric value={liveCount} label="Ao vivo" live={liveCount > 0} /><Metric value={matches.length} label="Partidas" /></div>
      </header>

      <section className="surface-panel my-9 flex flex-col gap-3 rounded-2xl p-3 lg:flex-row lg:items-center">
        <div className="scrollbar-hide flex flex-1 items-center gap-1 overflow-x-auto rounded-xl bg-[var(--background)]/40 p-1">
          {([['todos', 'Todas'], ['em_andamento', 'Ao vivo'], ['agendado', 'Próximas'], ['encerrado', 'Finalizadas']] as [Filter, string][]).map(([id, label]) => (
            <button key={id} onClick={() => setFilter(id)} className={`shrink-0 rounded-lg px-4 py-2.5 text-xs font-bold transition-all ${filter === id ? 'bg-[var(--primary)] text-[var(--primary-foreground)] shadow-sm' : 'text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]'}`}>{label}</button>
          ))}
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--input-background)] px-3 transition-colors focus-within:border-[var(--primary)]">
          <Search className="h-4 w-4 text-[var(--muted-foreground)]" /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Buscar equipe ou competição" aria-label="Buscar partida" className="w-full bg-transparent py-2.5 text-sm outline-none lg:w-64" />
        </div>
        <button onClick={() => setHideScores(!hideScores)} className="button-secondary min-h-11" title={hideScores ? 'Exibir placares' : 'Ocultar placares'}>
          {hideScores ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}<span className="lg:hidden">{hideScores ? 'Exibir placares' : 'Ocultar placares'}</span>
        </button>
      </section>

      {loading ? <MatchSkeleton /> : failed ? <ErrorState /> : filtered.length ? (
        <section className="grid gap-3">{filtered.map(match => <MatchRow key={match.id_partida} match={match} hideScores={hideScores} />)}</section>
      ) : <EmptyState />}
    </main>
  );
}

function MatchRow({ match, hideScores }: { match: Match; hideScores: boolean }) {
  const live = match.status === 'em_andamento';
  const played = match.status === 'encerrado' || live;
  const home = match.mandante?.nome || 'Mandante';
  const away = match.visitante?.nome || 'Visitante';

  return (
    <Link to={`/partidas/${match.id_partida}`} className="group grid gap-5 rounded-2xl border border-[var(--border)] bg-[var(--surface-glass)] p-4 transition-all hover:-translate-y-0.5 hover:border-[color:var(--primary)]/35 sm:p-5 lg:grid-cols-[12rem_1fr_10rem] lg:items-center">
      <div>
        <p className="truncate text-[.65rem] font-black uppercase tracking-[.15em] text-[var(--primary)]">{match.campeonato?.nome || 'Competição'}</p>
        <p className="mt-2 flex items-center gap-1.5 text-xs text-[var(--muted-foreground)]"><CalendarDays className="h-3.5 w-3.5" />{formatDate(match.data)} · {match.hora.slice(0, 5)}</p>
        <p className="mt-1 flex items-center gap-1.5 truncate text-xs text-[var(--muted-foreground)]"><MapPin className="h-3.5 w-3.5" />{match.local || 'Local a definir'}</p>
      </div>
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-5">
        <Team name={home} crest={match.mandante?.brasao} align="right" />
        <div className="min-w-20 text-center"><strong className="font-display block whitespace-nowrap text-4xl leading-none">{hideScores ? '– : –' : played ? `${match.gols_mandante} : ${match.gols_visitante}` : '×'}</strong>{!played && <span className="mt-1 block text-[.55rem] font-black uppercase tracking-wider text-[var(--muted-foreground)]">a disputar</span>}</div>
        <Team name={away} crest={match.visitante?.brasao} />
      </div>
      <span className={`inline-flex w-fit items-center gap-2 rounded-full px-3 py-2 text-[.62rem] font-black uppercase tracking-wider lg:justify-self-end ${live ? 'bg-red-500/10 text-red-400' : 'bg-[var(--muted)] text-[var(--muted-foreground)]'}`}>{live && <Radio className="h-3 w-3" />}{statusLabel(match.status)}</span>
    </Link>
  );
}

function Team({ name, crest, align }: { name: string; crest?: string | null; align?: 'right' }) {
  return <div className={`flex min-w-0 items-center gap-2.5 ${align === 'right' ? 'flex-row-reverse text-right' : ''}`}><span className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-full border border-[var(--border)] bg-[var(--muted)]">{crest ? <img src={crest} alt="" className="h-full w-full object-contain p-1.5" /> : <Shield className="h-4 w-4 text-[var(--muted-foreground)]" />}</span><strong className="line-clamp-2 text-xs leading-tight sm:text-sm">{name}</strong></div>;
}

function Metric({ value, label, live }: { value: number; label: string; live?: boolean }) { return <div className="content-card min-w-24 rounded-2xl p-4"><strong className={`font-display block text-4xl font-normal ${live ? 'text-red-400' : ''}`}>{value}</strong><span className="text-[.65rem] font-bold uppercase tracking-wider text-[var(--muted-foreground)]">{label}</span></div>; }
function MatchSkeleton() { return <div className="grid gap-3">{Array.from({ length: 5 }).map((_, index) => <div key={index} className="h-28 animate-pulse rounded-2xl bg-[var(--muted)]" />)}</div>; }
function EmptyState() { return <div className="rounded-3xl border border-dashed border-[var(--border)] py-20 text-center"><CalendarDays className="mx-auto h-9 w-9 text-[var(--muted-foreground)]" /><p className="mt-4 font-bold">Nenhuma partida encontrada</p><p className="mt-1 text-sm text-[var(--muted-foreground)]">Ajuste os filtros para ver outros jogos.</p></div>; }
function ErrorState() { return <div className="rounded-3xl border border-red-500/20 bg-red-500/5 py-16 text-center"><p className="font-bold text-red-300">Não foi possível carregar as partidas.</p><p className="mt-2 text-sm text-[var(--muted-foreground)]">Verifique a conexão com a API e tente novamente.</p></div>; }
function normalize(value: string) { return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase(); }
function formatDate(value: string) { return String(value).slice(0, 10).split('-').reverse().join('/'); }
function statusLabel(status: Match['status']) { return ({ agendado: 'Agendada', em_andamento: 'Em andamento', encerrado: 'Encerrada', cancelado: 'Cancelada' })[status]; }
function sortMatches(a: Match, b: Match) { const priority: Record<Match['status'], number> = { em_andamento: 0, agendado: 1, encerrado: 2, cancelado: 3 }; return priority[a.status] - priority[b.status] || `${a.data} ${a.hora}`.localeCompare(`${b.data} ${b.hora}`); }
