import { useEffect, useMemo, useState } from 'react';
import { Search, UserRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import type { Athlete, Club } from '../types/api';

export function AthletesPage() {
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get<Athlete[]>('/atletas'), api.get<Club[]>('/clubes')])
      .then(([athletesResponse, clubsResponse]) => { setAthletes(athletesResponse.data); setClubs(clubsResponse.data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const clubNames = useMemo(() => new Map(clubs.map(club => [club.id_clube, club.nome])), [clubs]);
  const filtered = athletes.filter(athlete => `${athlete.nome} ${clubNames.get(athlete.id_clube) || ''}`.toLowerCase().includes(query.toLowerCase()));

  return <main className="page-enter flex-1 pb-16">
    <section className="app-shell pb-10 pt-14 lg:pt-20"><p className="eyebrow">Elencos oficiais</p><h1 className="font-display mt-3 text-6xl leading-none md:text-8xl">ATLETAS</h1><p className="mt-4 max-w-xl text-sm leading-6 text-[var(--muted-foreground)]">Perfis, clubes e informações oficiais dos participantes das competições Zenith.</p></section>
    <section className="app-shell mb-7"><div className="flex items-center gap-3 border border-[var(--border)] bg-[var(--input-background)] px-4"><Search className="h-4 w-4 text-[var(--muted-foreground)]" /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Buscar atleta ou clube" className="h-12 w-full bg-transparent text-sm outline-none" /></div></section>
    <section className="app-shell">
      {loading ? <div className="grid gap-px bg-[var(--border)] sm:grid-cols-2 lg:grid-cols-4">{Array.from({ length: 8 }).map((_, index) => <div key={index} className="h-80 animate-pulse bg-[var(--muted)]" />)}</div> : filtered.length ? <div className="grid gap-px overflow-hidden border border-[var(--border)] bg-[var(--border)] sm:grid-cols-2 lg:grid-cols-4">{filtered.map(athlete => <Link key={athlete.id_atleta} to={`/atletas/${athlete.id_atleta}`} className="group relative flex min-h-80 flex-col overflow-hidden bg-[var(--card)] hover:bg-[var(--surface-glass-hover)]"><div className="absolute inset-x-0 top-0 h-[68%] bg-[radial-gradient(circle_at_1px_1px,var(--border)_1px,transparent_0)] bg-[length:9px_9px] opacity-50" /><div className="absolute inset-x-0 top-0 flex h-[68%] items-end justify-center overflow-hidden">{athlete.foto_perfil ? <img src={athlete.foto_perfil} alt={athlete.nome} className="h-[96%] w-full object-contain object-bottom transition-transform duration-500 group-hover:scale-[1.04]" /> : <UserRound className="mb-10 h-20 w-20 text-[var(--muted-foreground)] opacity-40" strokeWidth={1} />}</div><div className="absolute inset-x-0 top-[45%] h-[28%] bg-gradient-to-b from-transparent to-[var(--card)]" /><div className="relative z-10 mt-auto p-5"><p className="text-[.62rem] font-black uppercase tracking-[.15em] text-[var(--primary)]">{clubNames.get(athlete.id_clube) || 'Sem clube'}</p><h2 className="mt-2 text-lg font-black">{athlete.nome}</h2><div className="mt-4 flex justify-between border-t border-[var(--border)] pt-3 text-[.65rem] font-bold uppercase text-[var(--muted-foreground)]"><span>{ageFrom(athlete.data_nasc)} anos</span><span className="capitalize">{athlete.status}</span></div></div></Link>)}</div> : <div className="border border-dashed border-[var(--border)] py-20 text-center text-sm text-[var(--muted-foreground)]">Nenhum atleta encontrado.</div>}
    </section>
  </main>;
}

function ageFrom(value: string) { const birth = new Date(value); const now = new Date(); let age = now.getFullYear() - birth.getFullYear(); if (now.getMonth() < birth.getMonth() || (now.getMonth() === birth.getMonth() && now.getDate() < birth.getDate())) age--; return age; }
