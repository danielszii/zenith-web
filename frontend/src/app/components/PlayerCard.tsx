import { ArrowUpRight, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import defaultPlayerPhoto from '../../assets/player-default.png';

type PlayerCardProps = {
  id: string;
  name: string;
  club: string;
  photo?: string | null;
  rank?: number;
  goals?: number;
  age?: number;
  status?: string;
};

export function PlayerCard({ id, name, club, photo, rank, goals, age, status }: PlayerCardProps) {
  const hasGoals = typeof goals === 'number';

  return (
    <Link
      to={`/atletas/${id}`}
      className="group relative flex min-h-[27rem] flex-col overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--card)] transition duration-300 hover:-translate-y-1 hover:border-[color:var(--primary)]/45 hover:shadow-2xl hover:shadow-black/25"
      aria-label={`Ver perfil de ${name}`}
    >
      <div className="relative h-72 shrink-0 overflow-hidden bg-[var(--muted)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,var(--border)_1px,transparent_0)] bg-[length:10px_10px] opacity-65" />
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[color:var(--card)]/35 to-transparent" />

        {rank && (
          <span className="absolute left-4 top-4 z-20 rounded-full border border-white/10 bg-black/35 px-3 py-1.5 text-[.62rem] font-black uppercase tracking-[.16em] text-white backdrop-blur-md">
            Destaque {String(rank).padStart(2, '0')}
          </span>
        )}

        <span className="absolute right-4 top-4 z-20 grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-black/35 text-white backdrop-blur-md transition-colors group-hover:bg-[var(--primary)] group-hover:text-[var(--primary-foreground)]">
          <ArrowUpRight className="h-4 w-4" />
        </span>

        <img
          src={photo || defaultPlayerPhoto}
          alt={`Foto de ${name}`}
          onError={(event) => { event.currentTarget.src = defaultPlayerPhoto; }}
          className="absolute inset-0 h-full w-full object-cover object-[center_12%] transition-transform duration-500 ease-out group-hover:scale-[1.025]"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[var(--card)] to-transparent" />
      </div>

      <div className="relative z-10 -mt-2 flex flex-1 flex-col px-5 pb-5 pt-1">
        <p className="truncate text-[.62rem] font-black uppercase tracking-[.16em] text-[var(--primary)]">
          {club || 'Sem clube'}
        </p>
        <h2 className="mt-2 line-clamp-2 text-xl font-black leading-[1.1] text-[var(--foreground)]">
          {name}
        </h2>

        <div className="mt-auto flex items-end justify-between border-t border-[var(--border)] pt-4">
          {hasGoals ? (
            <div className="flex items-end gap-2">
              <strong className="font-display text-4xl leading-none text-[var(--primary)]">{goals}</strong>
              <span className="pb-1 text-[.6rem] font-black uppercase tracking-wider text-[var(--muted-foreground)]">gols</span>
            </div>
          ) : (
            <div className="flex items-center gap-3 text-[.65rem] font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
              <span>{typeof age === 'number' ? `${age} anos` : 'Idade não informada'}</span>
              <span className="h-1 w-1 rounded-full bg-[var(--primary)]" />
              <span className="capitalize">{status || 'Ativo'}</span>
            </div>
          )}
          {hasGoals && <Target className="h-4 w-4 text-[var(--muted-foreground)] transition-colors group-hover:text-[var(--primary)]" />}
        </div>
      </div>
    </Link>
  );
}
