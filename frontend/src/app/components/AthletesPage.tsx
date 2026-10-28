import { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { api } from '../services/api';
import type { Club, PublicAthlete } from '../types/api';
import { PlayerCard } from './PlayerCard';

export function AthletesPage() {
  const [athletes, setAthletes] = useState<PublicAthlete[]>([]);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get<PublicAthlete[]>('/public/atletas'), api.get<Club[]>('/clubes')])
      .then(([athletesResponse, clubsResponse]) => { setAthletes(athletesResponse.data); setClubs(clubsResponse.data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const clubsById = useMemo(() => new Map(clubs.map(club => [club.id_clube, club])), [clubs]);
  const clubNames = useMemo(() => new Map(clubs.map(club => [club.id_clube, club.nome])), [clubs]);
  const filtered = athletes.filter(athlete => `${athlete.nome} ${clubNames.get(athlete.id_clube) || ''}`.toLowerCase().includes(query.toLowerCase()));

  return <main className="page-enter flex-1 pb-16">
    <section className="app-shell pb-10 pt-14 lg:pt-20"><p className="eyebrow">Elencos oficiais</p><h1 className="font-display mt-3 text-6xl leading-none md:text-8xl">ATLETAS</h1><p className="mt-4 max-w-xl text-sm leading-6 text-[var(--muted-foreground)]">Perfis, clubes e informações oficiais dos participantes das competições Zenith.</p></section>
    <section className="app-shell mb-7"><div className="flex items-center gap-3 border border-[var(--border)] bg-[var(--input-background)] px-4"><Search className="h-4 w-4 text-[var(--muted-foreground)]" /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Buscar atleta ou clube" className="h-12 w-full bg-transparent text-sm outline-none" /></div></section>
    <section className="app-shell">
      {loading ? <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 8 }).map((_, index) => <div key={index} className="h-[34rem] animate-pulse rounded-2xl bg-[var(--muted)]" />)}</div> : filtered.length ? <div className={`grid gap-4 sm:grid-cols-2 ${filtered.length >= 3 ? 'lg:grid-cols-3' : ''}`}>{filtered.map(athlete => <PlayerCard key={athlete.id_atleta} id={athlete.id_atleta} name={athlete.nome} club={clubNames.get(athlete.id_clube) || 'Sem clube'} clubLogo={clubsById.get(athlete.id_clube)?.brasao} photo={athlete.foto_perfil} age={ageFrom(athlete.data_nasc)} status={athlete.status} />)}</div> : <div className="border border-dashed border-[var(--border)] py-20 text-center text-sm text-[var(--muted-foreground)]">Nenhum atleta encontrado.</div>}
    </section>
  </main>;
}

function ageFrom(value: string) { const birth = new Date(value); const now = new Date(); let age = now.getFullYear() - birth.getFullYear(); if (now.getMonth() < birth.getMonth() || (now.getMonth() === birth.getMonth() && now.getDate() < birth.getDate())) age--; return age; }
