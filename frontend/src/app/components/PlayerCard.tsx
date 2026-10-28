import { ArrowRight, ArrowUpRight, Shield, Target } from 'lucide-react';
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
  const featured = typeof rank === 'number';
  const hasGoals = typeof goals === 'number';

  return (
    <Link
      to={`/atletas/${id}`}
      className={`group relative isolate flex min-h-[34rem] flex-col overflow-hidden rounded-2xl border bg-[#0b100e] transition duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/35 ${featured && rank === 1 ? 'border-[var(--primary)] shadow-[0_0_40px_rgba(184,243,61,.08)]' : 'border-[var(--border)] hover:border-[color:var(--primary)]/45'}`}
      aria-label={`Ver perfil de ${name}`}
    >
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_72%_18%,rgba(184,243,61,.13),transparent_36%),linear-gradient(155deg,#101713_0%,#080c0a_62%,#0d1310_100%)]" />
      <div className="absolute -right-24 top-28 -z-10 h-24 w-[32rem] -rotate-[24deg] bg-white/[.035]" />
      <div className="absolute -right-16 top-48 -z-10 h-16 w-[28rem] -rotate-[24deg] bg-[var(--primary)]/[.035]" />

      <div className="relative h-[24rem] shrink-0 overflow-hidden">
        {featured && (
          <>
            <span className={`absolute left-5 top-5 z-30 rounded-full border px-4 py-2 text-[.64rem] font-black uppercase tracking-[.16em] backdrop-blur-md ${rank === 1 ? 'border-[color:var(--primary)]/60 bg-black/35 text-[var(--primary)]' : 'border-white/20 bg-black/30 text-white'}`}>
              Destaque {String(rank).padStart(2, '0')}
            </span>
            <span className="font-display pointer-events-none absolute -left-1 top-28 z-0 text-[8.8rem] leading-none text-transparent opacity-45 [-webkit-text-stroke:1px_rgba(255,255,255,.24)]">
              {String(rank).padStart(2, '0')}
            </span>
          </>
        )}

        <span className="absolute right-5 top-5 z-30 grid h-12 w-12 place-items-center rounded-full border border-white/15 bg-black/30 text-white backdrop-blur-md transition duration-300 group-hover:border-[var(--primary)] group-hover:bg-[var(--primary)] group-hover:text-[var(--primary-foreground)]">
          <ArrowUpRight className="h-5 w-5" />
        </span>

        <img
          src={photo || defaultPlayerPhoto}
          alt={`Foto de ${name}`}
          onError={(event) => { event.currentTarget.src = defaultPlayerPhoto; }}
          className="absolute inset-0 z-10 h-full w-full object-cover object-[center_14%] transition-transform duration-500 ease-out group-hover:scale-[1.025]"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-44 bg-gradient-to-t from-[#0b100e] via-[#0b100e]/78 to-transparent" />
      </div>

      <div className="relative z-20 -mt-16 flex flex-1 flex-col px-5 pb-5">
        <div className="flex min-h-[4.5rem] items-center gap-4">
          <span className="grid h-14 w-14 shrink-0 place-items-center border-r border-white/15 pr-4">
            {clubLogo ? <img src={clubLogo} alt={`Escudo ${club}`} className="h-12 w-12 object-contain" /> : <Shield className="h-8 w-8 text-[var(--primary)]" />}
          </span>
          <div className="min-w-0">
            <p className="truncate text-[.62rem] font-black uppercase tracking-[.13em] text-[var(--muted-foreground)]">{club || 'Sem clube'}</p>
            <h2 className="mt-1 line-clamp-2 text-xl font-black leading-[1.08] text-white">{name}</h2>
          </div>
        </div>

        <div className={`mt-auto flex min-h-[5.7rem] items-center rounded-2xl border px-5 ${featured && rank === 1 ? 'border-[color:var(--primary)]/25 bg-[color:var(--primary)]/[.045]' : 'border-white/10 bg-black/20'}`}>
          {hasGoals ? (
            <>
              <Target className={`h-6 w-6 shrink-0 ${rank === 1 ? 'text-[var(--primary)]' : 'text-[var(--muted-foreground)]'}`} />
              <span className="mx-5 h-9 w-px bg-white/15" />
              <strong className={`font-display text-5xl leading-none ${rank === 1 ? 'text-[var(--primary)]' : 'text-white'}`}>{goals}</strong>
              <span className="ml-3 text-[.67rem] font-black uppercase tracking-[.13em] text-[var(--muted-foreground)]">gols</span>
            </>
          ) : (
            <div className="flex min-w-0 flex-1 items-center gap-3 text-[.65rem] font-black uppercase tracking-[.1em] text-[var(--muted-foreground)]">
              <span>{typeof age === 'number' ? `${age} anos` : 'Perfil oficial'}</span>
              <span className="h-1 w-1 rounded-full bg-[var(--primary)]" />
              <span className="truncate capitalize">{status || 'Ativo'}</span>
            </div>
          )}
          <ArrowRight className="ml-auto h-5 w-5 text-[var(--muted-foreground)] transition group-hover:translate-x-1 group-hover:text-[var(--primary)]" />
        </div>
      </div>
    </Link>
  );
}