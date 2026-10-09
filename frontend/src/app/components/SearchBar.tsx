import { CalendarDays, Search, Shield, Trophy, UserRound, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import type { Championship, Club, Match, PublicAthlete } from '../types/api';

type SearchResult = {
  id: string;
  title: string;
  subtitle: string;
  path: string;
  type: 'club' | 'athlete' | 'championship' | 'match';
};

export function SearchBar() {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);

  useEffect(() => {
    Promise.all([
      api.get<Club[]>('/clubes'),
      api.get<PublicAthlete[]>('/public/atletas'),
      api.get<Championship[]>('/campeonatos'),
      api.get<Match[]>('/partidas'),
    ]).then(([clubs, athletes, championships, matches]) => {
      setResults([
        ...clubs.data.map(club => ({ id: club.id_clube, title: club.nome, subtitle: 'Clube', path: `/clubes/${club.id_clube}`, type: 'club' as const })),
        ...athletes.data.map(athlete => ({ id: athlete.id_atleta, title: athlete.nome, subtitle: 'Atleta', path: `/atletas/${athlete.id_atleta}`, type: 'athlete' as const })),
        ...championships.data.map(championship => ({ id: championship.id_campeonato, title: championship.nome, subtitle: `${championship.modalidade} · ${championship.categoria}`, path: `/estatisticas?campeonato=${championship.id_campeonato}`, type: 'championship' as const })),
        ...matches.data.map(match => ({ id: match.id_partida, title: `${match.mandante?.nome || 'Mandante'} × ${match.visitante?.nome || 'Visitante'}`, subtitle: match.campeonato?.nome || 'Partida', path: `/partidas/${match.id_partida}`, type: 'match' as const })),
      ]);
    }).catch(() => setResults([]));
  }, []);

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setFocused(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const filtered = useMemo(() => {
    const term = normalize(query.trim());
    if (!term) return [];
    return results.filter(result => normalize(`${result.title} ${result.subtitle}`).includes(term)).slice(0, 8);
  }, [query, results]);

  const select = (path: string) => {
    setQuery('');
    setFocused(false);
    navigate(path);
  };

  return (
    <div ref={containerRef} className="relative">
      <div className="flex h-11 items-center gap-3 border border-[var(--border)] bg-[var(--surface-glass)] px-4 focus-within:border-[var(--primary)]">
        <Search className="h-4 w-4 shrink-0 text-[var(--muted-foreground)]" />
        <input value={query} onChange={event => setQuery(event.target.value)} onFocus={() => setFocused(true)} placeholder="Buscar no Zenith" aria-label="Buscar clubes, atletas, competições e partidas" className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[var(--muted-foreground)]" />
        {query && <button type="button" onClick={() => setQuery('')} aria-label="Limpar busca"><X className="h-3.5 w-3.5 text-[var(--muted-foreground)]" /></button>}
      </div>

      {focused && query.trim() && (
        <div className="absolute right-0 top-[calc(100%+.5rem)] z-50 w-[min(26rem,90vw)] overflow-hidden border border-[var(--border)] bg-[var(--popover)] shadow-2xl">
          {filtered.length ? filtered.map(result => {
            const Icon = result.type === 'club' ? Shield : result.type === 'athlete' ? UserRound : result.type === 'championship' ? Trophy : CalendarDays;
            return <button key={`${result.type}-${result.id}`} type="button" onClick={() => select(result.path)} className="grid w-full grid-cols-[2.5rem_1fr_auto] items-center gap-3 border-b border-[var(--border)] p-3 text-left last:border-0 hover:bg-[var(--surface-glass-hover)]"><span className="grid h-10 w-10 place-items-center bg-[var(--muted)]"><Icon className="h-4 w-4 text-[var(--primary)]" /></span><span className="min-w-0"><strong className="block truncate text-sm">{result.title}</strong><span className="block truncate text-xs text-[var(--muted-foreground)]">{result.subtitle}</span></span><span className="text-[.58rem] font-black uppercase tracking-wider text-[var(--muted-foreground)]">{typeLabel(result.type)}</span></button>;
          }) : <p className="p-8 text-center text-sm text-[var(--muted-foreground)]">Nenhum resultado encontrado.</p>}
        </div>
      )}
    </div>
  );
}

function normalize(value: string) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

function typeLabel(type: SearchResult['type']) {
  return ({ club: 'Clube', athlete: 'Atleta', championship: 'Competição', match: 'Partida' })[type];
}
