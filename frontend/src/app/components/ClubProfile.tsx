import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, CalendarDays, Search, Shield, UserRound } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import defaultPlayerPhoto from '../../assets/player-default.png';
import { api } from '../services/api';
import type { Club, Match, PublicAthlete } from '../types/api';

type ClubData = { clubs: Club[]; athletes: PublicAthlete[]; matches: Match[] };

export function ClubProfile() {
  const { id } = useParams();
  const [data, setData] = useState<ClubData>({ clubs: [], athletes: [], matches: [] });
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get<Club[]>('/clubes'), api.get<PublicAthlete[]>('/public/atletas'), api.get<Match[]>('/partidas')])
      .then(([clubs, athletes, matches]) => setData({ clubs: clubs.data, athletes: athletes.data, matches: matches.data }))
      .finally(() => setLoading(false));
  }, []);

  const club = data.clubs.find(item => item.id_clube === id);
  if (loading) return <main className="app-shell flex-1 py-16"><div className="h-72 animate-pulse bg-[var(--muted)]" /></main>;
  if (!id) return <ClubDirectory clubs={data.clubs} query={query} setQuery={setQuery} />;
  if (!club) return <main className="app-shell flex-1 py-24 text-center"><p className="font-display text-5xl">CLUBE NÃO ENCONTRADO</p><Link to="/clubes" className="button-secondary mt-6">Ver clubes</Link></main>;

  const roster = data.athletes.filter(athlete => athlete.id_clube === club.id_clube);
  const matches = data.matches.filter(match => match.id_mandante === club.id_clube || match.id_visitante === club.id_clube);
  const finished = matches.filter(match => match.status === 'encerrado');
  const goals = finished.reduce((total, match) => total + (match.id_mandante === club.id_clube ? match.gols_mandante : match.gols_visitante), 0);

  return <main className="page-enter flex-1 pb-16">
    <section className="app-shell pt-8"><Link to="/clubes" className="button-quiet inline-flex"><ArrowLeft className="h-4 w-4" /> Todos os clubes</Link></section>
    <section className="app-shell mt-6 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)]"><div className="grid min-h-64 md:grid-cols-[220px_1fr]"><div className="grid min-h-52 place-items-center border-b border-[var(--border)] bg-[var(--primary)] p-8 md:border-b-0 md:border-r">{club.brasao ? <img src={club.brasao} alt={`Escudo ${club.nome}`} className="h-36 w-36 object-contain" /> : <Shield className="h-24 w-24 text-[var(--primary-foreground)]" strokeWidth={1.2} />}</div><div className="flex flex-col justify-center px-6 py-9 md:px-10"><p className="eyebrow">Perfil oficial do clube</p><h1 className="font-display mt-3 text-5xl leading-none md:text-7xl">{club.nome}</h1><p className="mt-4 text-sm text-[var(--muted-foreground)]">{club.responsavel || 'Responsável não informado'}{club.cores_oficiais ? ` · ${club.cores_oficiais}` : ''}</p></div></div></section>
    <section className="app-shell mt-10 grid gap-px overflow-hidden border border-[var(--border)] bg-[var(--border)] sm:grid-cols-3"><Metric value={roster.length} label="Atletas" /><Metric value={finished.length} label="Partidas finalizadas" /><Metric value={goals} label="Gols marcados" accent /></section>
    <section className="app-shell mt-12 grid gap-10 lg:grid-cols-[1.2fr_.8fr]">
      <div><SectionHeader eyebrow="Elenco atual" title="ATLETAS" />{roster.length ? <div className="grid gap-px overflow-hidden border border-[var(--border)] bg-[var(--border)] sm:grid-cols-2">{roster.map(athlete => <Link key={athlete.id_atleta} to={`/atletas/${athlete.id_atleta}`} className="group grid grid-cols-[3rem_1fr_auto] items-center gap-3 bg-[var(--card)] p-4 hover:bg-[var(--surface-glass-hover)]"><img src={athlete.foto_perfil || defaultPlayerPhoto} alt={athlete.nome} className="h-12 w-12 bg-[var(--muted)] object-cover" /><span className="min-w-0"><strong className="block truncate text-sm">{athlete.nome}</strong><span className="text-xs capitalize text-[var(--muted-foreground)]">{athlete.status}</span></span><UserRound className="h-4 w-4 text-[var(--primary)]" /></Link>)}</div> : <Empty text="Nenhum atleta cadastrado neste clube." />}</div>
      <aside><SectionHeader eyebrow="Agenda" title="PARTIDAS" />{matches.length ? <div className="border border-[var(--border)] bg-[var(--card)]">{matches.slice(0, 6).map(match => <Link key={match.id_partida} to={`/partidas/${match.id_partida}`} className="block border-b border-[var(--border)] p-4 last:border-0 hover:bg-[var(--surface-glass-hover)]"><span className="text-[.6rem] font-black uppercase tracking-wider text-[var(--primary)]">{match.campeonato?.nome || 'Competição'}</span><strong className="mt-1 block text-sm">{match.mandante?.nome} × {match.visitante?.nome}</strong><span className="mt-1 flex items-center gap-1.5 text-xs text-[var(--muted-foreground)]"><CalendarDays className="h-3.5 w-3.5" /> {formatDate(match.data)} · {match.hora.slice(0, 5)}</span></Link>)}</div> : <Empty text="Nenhuma partida encontrada para este clube." />}</aside>
    </section>
  </main>;
}

function ClubDirectory({ clubs, query, setQuery }: { clubs: Club[]; query: string; setQuery: (value: string) => void }) {
  const filtered = useMemo(() => clubs.filter(club => normalize(club.nome).includes(normalize(query))), [clubs, query]);
  return <main className="page-enter flex-1 pb-16"><section className="app-shell pb-10 pt-14 lg:pt-20"><p className="eyebrow">Participantes oficiais</p><h1 className="font-display mt-3 text-6xl md:text-8xl">CLUBES</h1><p className="mt-4 max-w-xl text-sm text-[var(--muted-foreground)]">Conheça os clubes e seus elencos nas competições Zenith.</p></section><section className="app-shell mb-7"><div className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--input-background)] px-4"><Search className="h-4 w-4 text-[var(--muted-foreground)]" /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Buscar clube" className="h-12 w-full bg-transparent text-sm outline-none" /></div></section><section className="app-shell">{filtered.length ? <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{filtered.map(club => <Link key={club.id_clube} to={`/clubes/${club.id_clube}`} className="group flex min-h-64 flex-col rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 transition duration-300 hover:-translate-y-1 hover:border-[color:var(--primary)]/40 hover:bg-[var(--surface-glass-hover)]"><span className="grid h-24 w-24 place-items-center rounded-2xl bg-[var(--muted)]">{club.brasao ? <img src={club.brasao} alt={`Escudo ${club.nome}`} className="h-20 w-20 object-contain" /> : <Shield className="h-9 w-9 text-[var(--muted-foreground)]" />}</span><div className="mt-auto pt-8"><p className="eyebrow">Clube oficial</p><h2 className="mt-2 text-xl font-black">{club.nome}</h2><p className="mt-2 text-xs text-[var(--muted-foreground)]">Ver elenco e partidas →</p></div></Link>)}</div> : <Empty text="Nenhum clube encontrado." />}</section></main>;
}

function SectionHeader({ eyebrow, title }: { eyebrow: string; title: string }) { return <div className="section-rule mb-5"><p className="eyebrow">{eyebrow}</p><h2 className="font-display mt-2 text-4xl">{title}</h2></div>; }
function Metric({ value, label, accent }: { value: number; label: string; accent?: boolean }) { return <div className="bg-[var(--card)] p-6"><strong className={`font-display block text-5xl ${accent ? 'text-[var(--primary)]' : ''}`}>{value}</strong><span className="text-[.62rem] font-black uppercase tracking-wider text-[var(--muted-foreground)]">{label}</span></div>; }
function Empty({ text }: { text: string }) { return <div className="border border-dashed border-[var(--border)] p-10 text-center text-sm text-[var(--muted-foreground)]">{text}</div>; }
function normalize(value: string) { return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase(); }
function formatDate(value: string) { return String(value).slice(0, 10).split('-').reverse().join('/'); }
