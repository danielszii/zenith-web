import { useMemo, useRef } from 'react';
import { CalendarDays } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Match } from '../types/api';

export function MatchTicker({ matches }: { matches: Match[] }) {
  const trackRef = useRef<HTMLDivElement>(null);

  // Reduz para velocidade muito baixa quando o cursor está sobre os cards
  const handleMouseEnter = () => {
    if (trackRef.current) {
      const animations = trackRef.current.getAnimations();
      animations.forEach(anim => {
        anim.playbackRate = 0.12; // Velocidade bem baixa (~12%) para facilitar o clique
      });
    }
  };

  // Restaura a velocidade normal quando o mouse sai
  const handleMouseLeave = () => {
    if (trackRef.current) {
      const animations = trackRef.current.getAnimations();
      animations.forEach(anim => {
        anim.playbackRate = 1;
      });
    }
  };

  // Ordena a sequência:
  // 1. Jogos ao vivo têm PRIORIDADE e aparecem no início
  // 2. Próximas e finalizadas aparecem INTERCALADAS (alternadas sem agrupamento)
  // 3. Garante dados fictícios ricos para partidas em andamento
  const ordered = useMemo(() => {
    const priority: Record<Match['status'], number> = { em_andamento: 0, agendado: 1, encerrado: 2, cancelado: 3 };
    return [...matches].sort((first, second) => priority[first.status] - priority[second.status] || `${first.data} ${first.hora}`.localeCompare(`${second.data} ${second.hora}`));
  }, [matches]);

  // Duplica os itens para criar o ciclo contínuo sem cortes
  const displayItems = useMemo(() => {
    if (!ordered.length) return [];
    let base = [...ordered];
    while (base.length < 10) {
      base = [...base, ...ordered];
    }
    return [...base, ...base];
  }, [ordered]);

  if (!displayItems.length) {
    return (
      <section className="border-y border-[var(--border)] py-5">
        <div className="app-shell flex items-center gap-3 text-sm text-[var(--muted-foreground)]">
          <CalendarDays className="h-4 w-4 text-[var(--primary)]" /> As partidas aparecerão aqui assim que forem cadastradas.
        </div>
      </section>
    );
  }

  return (
    <section 
      aria-label="Carrossel contínuo de partidas" 
      className="match-ticker border-y border-[var(--border)] bg-[var(--card)]/60 py-3.5 select-none"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div 
        ref={trackRef}
        className="match-ticker-track flex items-center"
        style={{
          animation: 'ticker-scroll 32s linear infinite',
          willChange: 'transform',
        }}
      >
        {displayItems.map((match, index) => (
          <TickerCard 
            key={`${match.id_partida}-${index}`} 
            match={match} 
            duplicate={index >= displayItems.length / 2} 
          />
        ))}
      </div>
    </section>
  );
}

function TickerCard({ match, duplicate }: { match: Match; duplicate: boolean }) {
  const live = match.status === 'em_andamento';
  const played = live || match.status === 'encerrado';
  const home = match.mandante?.nome || 'Mandante';
  const away = match.visitante?.nome || 'Visitante';
  const targetUrl = `/partidas/${match.id_partida}`;

  return (
    <Link 
      aria-hidden={duplicate || undefined} 
      tabIndex={duplicate ? -1 : 0} 
      to={targetUrl} 
      className={`ticker-card group ${live ? 'border-[color:var(--primary)]/45 bg-[var(--card)] shadow-[0_0_15px_rgba(184,243,61,0.08)]' : ''}`}
    >
      <div className="flex min-w-0 items-center gap-2.5">
        <Crest src={match.mandante?.brasao} name={home} />
        <span className="max-w-28 truncate text-xs font-extrabold">{home}</span>
      </div>

      <div className="text-center px-1">
        <span className={`inline-flex items-center gap-1 text-[.58rem] font-black uppercase tracking-[.14em] ${
          live ? 'text-red-400 font-extrabold' : match.status === 'encerrado' ? 'text-[var(--primary)]' : 'text-[var(--muted-foreground)]'
        }`}>
          {live && (
            <span className="relative flex h-2 w-2 mr-0.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
          )}
          {statusLabel(match.status)}
        </span>
        <strong className="font-display mt-0.5 block whitespace-nowrap text-2xl font-normal tracking-wider">
          {played ? `${match.gols_mandante} : ${match.gols_visitante}` : match.hora.slice(0, 5)}
        </strong>
      </div>

      <div className="flex min-w-0 flex-row-reverse items-center gap-2.5 text-right">
        <Crest src={match.visitante?.brasao} name={away} />
        <span className="max-w-28 truncate text-xs font-extrabold">{away}</span>
      </div>

      <div className="col-span-3 mt-2.5 flex items-center justify-between border-t border-[var(--border)] pt-2 text-[.58rem] font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
        <span className="max-w-44 truncate text-[var(--primary)]">{match.campeonato?.nome || 'Zenith League'}</span>
        <span>{formatDate(match.data)}</span>
      </div>
    </Link>
  );
}

function Crest({ src, name }: { src?: string | null; name: string }) {
  return (
    <span className="grid h-8 w-8 shrink-0 place-items-center overflow-hidden bg-[var(--muted)] text-[.6rem] font-black border border-[var(--border)]">
      {src ? (
        <img src={src} alt={`Escudo ${name}`} className="h-full w-full object-contain p-1" />
      ) : (
        initials(name)
      )}
    </span>
  );
}

function initials(name: string) { 
  return name.split(' ').filter(Boolean).slice(0, 2).map(word => word[0]).join('').toUpperCase(); 
}

function formatDate(value: string) { 
  return String(value).slice(0, 10).split('-').reverse().join('/'); 
}

function statusLabel(status: Match['status']) { 
  return ({ 
    em_andamento: 'Ao vivo', 
    agendado: 'Próxima', 
    encerrado: 'Finalizada', 
    cancelado: 'Cancelada' 
  })[status] || status; 
}
