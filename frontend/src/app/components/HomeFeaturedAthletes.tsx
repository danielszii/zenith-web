import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import type { Club, PublicAthlete } from '../types/api';
import { PlayerCard } from './PlayerCard';

type FeaturedAthlete = { id_atleta: string; nome: string; foto_perfil?: string | null; clube: string | null; total: number };
type PublicStats = { lideres: { gols: FeaturedAthlete[] } };

export function HomeFeaturedAthletes() {
  const [athletes, setAthletes] = useState<FeaturedAthlete[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<PublicStats>('/public/estatisticas')
      .then(async ({ data }) => {
        let list = data.lideres.gols.slice(0, 4);
        if (list.length < 4) {
          try {
            const [{ data: allAthletes }, { data: clubs }] = await Promise.all([
              api.get<PublicAthlete[]>('/public/atletas'),
              api.get<Club[]>('/clubes'),
            ]);
            const clubNames = new Map(clubs.map(club => [club.id_clube, club.nome]));
            const remaining = allAthletes
              .filter(a => !list.some(l => l.id_atleta === a.id_atleta))
              .map(a => ({
                id_atleta: a.id_atleta,
                nome: a.nome,
                foto_perfil: a.foto_perfil,
                clube: clubNames.get(a.id_clube) || null,
                total: 0,
              }));
            list = [...list, ...remaining].slice(0, 4);
          } catch {
            // mantém lista original
          }
        }
        setAthletes(list);
      })
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
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => <div key={index} className="h-[27rem] animate-pulse rounded-3xl bg-[var(--muted)]" />)}
        </div>
      ) : athletes.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {athletes.map((athlete, index) => (
            <PlayerCard
              key={athlete.id_atleta}
              id={athlete.id_atleta}
              name={athlete.nome}
              club={athlete.clube || 'Sem clube'}
              photo={athlete.foto_perfil}
              rank={index + 1}
              goals={athlete.total}
            />
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
