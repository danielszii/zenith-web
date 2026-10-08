import { useEffect, useState } from 'react';
import { ArrowRight, Target, UserRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';

type FeaturedAthlete = { id_atleta: string; nome: string; foto_perfil?: string | null; clube: string | null; total: number };
type PublicStats = { lideres: { gols: FeaturedAthlete[] } };

export function HomeFeaturedAthletes() {
  const [athletes, setAthletes] = useState<FeaturedAthlete[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<PublicStats>('/public/estatisticas')
      .then(({ data }) => setAthletes(data.lideres.gols.slice(0, 4)))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="app-shell mt-12 md:mt-16">
      <div className="section-rule mb-7 flex items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Destaques da temporada</p>
          <h1 className="font-display mt-2 text-4xl tracking-wide md:text-6xl">ATLETAS EM EVIDÊNCIA</h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-[var(--muted-foreground)]">
            Conheça os atletas que estão definindo a temporada com desempenho registrado em súmula.
          </p>
        </div>
        <Link to="/estatisticas" className="button-quiet hidden sm:inline-flex">
          Ver ranking <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {loading ? (
        <div className="grid gap-px bg-[var(--border)] sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => <div key={index} className="h-96 animate-pulse bg-[var(--muted)]" />)}
        </div>
      ) : athletes.length ? (
        <div className="grid gap-px overflow-hidden border border-[var(--border)] bg-[var(--border)] sm:grid-cols-2 lg:grid-cols-4">
          {athletes.map((athlete, index) => (
            <Link key={athlete.id_atleta} to={`/atletas/${athlete.id_atleta}`} className="group relative flex min-h-96 flex-col overflow-hidden bg-[var(--card)] transition-colors hover:bg-[var(--surface-glass-hover)]">
              <div className="absolute inset-x-0 top-0 h-[72%] bg-[radial-gradient(circle_at_1px_1px,var(--border)_1px,transparent_0)] bg-[length:9px_9px] opacity-55" />
              <span className="absolute right-4 top-2 z-10 font-display text-7xl text-[color:var(--foreground)]/10 transition-colors group-hover:text-[color:var(--primary)]/20">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div className="absolute inset-x-0 top-0 flex h-[72%] items-end justify-center overflow-hidden">
                {athlete.foto_perfil ? <img src={athlete.foto_perfil} alt={athlete.nome} className="h-[96%] w-full object-contain object-bottom transition-transform duration-500 group-hover:scale-[1.04]" /> : <UserRound className="mb-12 h-24 w-24 text-[var(--muted-foreground)] opacity-45" strokeWidth={1} />}
              </div>
              <div className="absolute inset-x-0 top-[48%] h-[30%] bg-gradient-to-b from-transparent to-[var(--card)]" />
              <div className="relative z-10 mt-auto p-5">
                <p className="text-[.62rem] font-black uppercase tracking-[.16em] text-[var(--primary)]">{athlete.clube || 'Sem clube'}</p>
                <h2 className="mt-1 min-h-12 text-xl font-black leading-tight">{athlete.nome}</h2>
                <div className="mt-5 flex items-end justify-between border-t border-[var(--border)] pt-4">
                  <div><strong className="font-display text-4xl text-[var(--primary)]">{athlete.total}</strong><span className="ml-2 text-[.6rem] font-black uppercase tracking-wider text-[var(--muted-foreground)]">gols</span></div>
                  <Target className="h-4 w-4 text-[var(--muted-foreground)] transition-colors group-hover:text-[var(--primary)]" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="border border-dashed border-[var(--border)] px-6 py-12 text-center text-sm text-[var(--muted-foreground)]">
          Os destaques aparecerão após as primeiras súmulas finalizadas.
        </div>
      )}
    </section>
  );
}
