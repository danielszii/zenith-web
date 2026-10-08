import { useMemo } from 'react';
import { ArrowRight, CalendarDays, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Match } from '../types/api';
import { prepareCarouselMatches } from '../data/mockMatches';

export type { Match };

const initials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(word => word[0])
    .join('')
    .toUpperCase();

export function LiveMatchCards({ matches }: { matches: Match[] }) {
  // Ordena a sequência:
  // 1. Jogos ao vivo têm PRIORIDADE
  // 2. Próximas e finalizadas aparecem INTERCALADAS
  // 3. Garante dados fictícios ricos para partidas em andamento
  const orderedMatches = useMemo(() => {
    return prepareCarouselMatches(matches);
  }, [matches]);

  if (!orderedMatches.length) {
    return (
      <div className="content-card px-6 py-14 text-center">
        <CalendarDays className="mx-auto mb-4 h-8 w-8 text-[var(--muted-foreground)]" />
        <p className="font-semibold">Nenhuma partida em destaque</p>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">As próximas partidas aparecerão aqui.</p>
      </div>
    );
  }

  return (
    <div className="grid overflow-hidden border border-[var(--border)] bg-[var(--card)] md:grid-cols-2">
      {orderedMatches.slice(0, 4).map(match => {
        const home = match.mandante?.nome || 'Mandante';
        const away = match.visitante?.nome || 'Visitante';
        const live = match.status === 'em_andamento';
        const status = live
          ? 'Ao vivo'
          : match.status === 'encerrado'
          ? 'Final'
          : match.status === 'cancelado'
          ? 'Cancelada'
          : 'Agendada';
        const isMock = match.id_partida.startsWith('mock-');
        const targetUrl = isMock ? '/partidas' : `/partidas/${match.id_partida}`;

        return (
          <Link
            to={targetUrl}
            key={match.id_partida}
            className={`group relative border-b border-[var(--border)] p-5 transition-colors hover:bg-[var(--surface-glass-hover)] md:[&:nth-child(odd)]:border-r ${
              live ? 'bg-[color:var(--card)]/90' : ''
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <p className="truncate text-[.65rem] font-black uppercase tracking-[.16em] text-[var(--primary)]">
                {match.campeonato?.nome || 'Zenith League'}
              </p>
              <span
                className={`inline-flex shrink-0 items-center gap-1.5 text-[.6rem] font-black uppercase tracking-wider ${
                  live ? 'text-red-400' : 'text-[var(--muted-foreground)]'
                }`}
              >
                {live && (
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                  </span>
                )}
                {status}
              </span>
            </div>

            <div className="my-7 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
              <Team name={home} />
              <div className="font-display whitespace-nowrap text-5xl leading-none">
                {match.status === 'agendado' ? (
                  <span className="text-2xl text-[var(--muted-foreground)] font-normal">{match.hora.slice(0, 5)}</span>
                ) : (
                  <>
                    {match.gols_mandante}
                    <span className="mx-2 text-[var(--muted-foreground)]">:</span>
                    {match.gols_visitante}
                  </>
                )}
              </div>
              <Team name={away} right />
            </div>

            <div className="flex items-center gap-4 border-t border-[var(--border)] pt-4 text-[.7rem] text-[var(--muted-foreground)]">
              <span className="flex items-center gap-1.5">
                <CalendarDays className="h-3.5 w-3.5" />
                {formatDate(match.data)} · {match.hora.slice(0, 5)}
              </span>
              <span className="hidden min-w-0 items-center gap-1.5 sm:flex">
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{match.local}</span>
              </span>
              <ArrowRight className="ml-auto h-4 w-4 text-[var(--primary)] transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        );
      })}
    </div>
  );
}

function Team({ name, right }: { name: string; right?: boolean }) {
  return (
    <div className={`min-w-0 ${right ? 'text-right' : ''}`}>
      <span
        className={`grid h-10 w-10 place-items-center border border-[var(--border)] bg-[var(--muted)] text-xs font-black ${
          right ? 'ml-auto' : ''
        }`}
      >
        {initials(name)}
      </span>
      <p className="mt-2 truncate text-xs font-extrabold sm:text-sm">{name}</p>
    </div>
  );
}

function formatDate(value: string) {
  return String(value).slice(0, 10).split('-').reverse().join('/');
}
