import { Shield, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import defaultPlayerPhoto from '../../assets/player-default.png';

type PlayerCardProps = {
  id: string;
  name: string;
  club: string;
  clubLogo?: string | null;
  photo?: string | null;
  rank?: number;
  goals?: number;
  age?: number;
  status?: string;
};

export function PlayerCard({ id, name, club, clubLogo, photo, rank, goals, age, status }: PlayerCardProps) {
  const hasGoals = typeof goals === 'number';
  return (
    <Link
      to={`/atletas/${id}`}
      className={`group flex min-h-[25rem] flex-col overflow-hidden rounded-2xl border bg-[var(--card)] transition duration-300 hover:-translate-y-1 hover:border-[color:var(--primary)]/45 hover:shadow-lg hover:shadow-black/15 ${rank === 1 ? 'border-[color:var(--primary)]/55' : 'border-[var(--border)]'}`}
      aria-label={`Ver perfil de ${name}`}
    >
      <div className="relative h-[17rem] shrink-0 overflow-hidden bg-[#0b100e]">
        <img
          src={photo || defaultPlayerPhoto}
          alt={`Foto de ${name}`}
          onError={(event) => { event.currentTarget.src = defaultPlayerPhoto; }}
          className="h-full w-full object-cover object-[center_14%] transition-transform duration-500 ease-out group-hover:scale-[1.025]"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[var(--card)] to-transparent" />
      </div>

      <div className="-mt-5 flex flex-1 flex-col px-4 pb-4">
        <div className="relative flex min-h-[3.6rem] items-center gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-[var(--border)] bg-[var(--muted)]">
            {clubLogo ? <img src={clubLogo} alt={`Escudo ${club}`} className="h-7 w-7 object-contain" /> : <Shield className="h-4 w-4 text-[var(--primary)]" />}
          </span>
          <div className="min-w-0">
            <h2 className="truncate text-base font-black leading-tight text-[var(--foreground)]">{name}</h2>
            <p className="mt-1 truncate text-[.58rem] font-bold uppercase tracking-[.11em] text-[var(--muted-foreground)]">{club || 'Sem clube'}</p>
          </div>
        </div>

        <div className="mt-auto flex items-center border-t border-[var(--border)] pt-3">
          {hasGoals ? (
            <div className="flex items-center gap-2">
              <Target className="h-3.5 w-3.5 text-[var(--primary)]" />
              <strong className="font-display text-2xl leading-none">{goals}</strong>
              <span className="text-[.56rem] font-black uppercase tracking-[.11em] text-[var(--muted-foreground)]">gols</span>
            </div>
          ) : (
            <div className="flex min-w-0 items-center gap-2 text-[.68rem] text-[var(--muted-foreground)]">
              <span>{typeof age === 'number' ? `${age} anos` : 'Perfil oficial'}</span>
              <span className="h-1 w-1 rounded-full bg-[var(--primary)]" />
              <span className="truncate capitalize">{status || 'Ativo'}</span>
            </div>
          )}
          <span className="ml-auto text-[.55rem] font-black uppercase tracking-[.1em] text-[var(--primary)]">Perfil</span>
        </div>
      </div>
    </Link>
  );
}
