import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import type { Club, PublicAthlete } from '../types/api';
import { PlayerCard } from './PlayerCard';

type FeaturedAthlete = { id_atleta: string; nome: string; foto_perfil?: string | null; clube: string | null; brasao?: string | null; total: number };
type PublicStats = { lideres: { gols: FeaturedAthlete[] } };

export function HomeFeaturedAthletes() {
  const [athletes, setAthletes] = useState<FeaturedAthlete[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get<PublicStats>('/public/estatisticas'),
      api.get<Club[]>('/clubes'),
    ])
      .then(async ([{ data }, { data: clubs }]) => {
        const clubByName = new Map(clubs.map(club => [club.nome.trim().toLocaleLowerCase('pt-BR'), club]));
        const clubById = new Map(clubs.map(club => [club.id_clube, club]));
        let list = data.lideres.gols.slice(0, 4).map(athlete => ({
          ...athlete,
          brasao: athlete.clube ? clubByName.get(athlete.clube.trim().toLocaleLowerCase('pt-BR'))?.brasao : null,
        }));

        if (list.length < 4) {
          try {
            const { data: allAthletes } = await api.get<PublicAthlete[]>('/public/atletas');
            const remaining = allAthletes
              .filter(athlete => !list.some(item => item.id_atleta === athlete.id_atleta))
              .map(athlete => ({
                id_atleta: athlete.id_atleta,
                nome: athlete.nome,
                foto_perfil: athlete.foto_perfil,
                clube: clubById.get(athlete.id_clube)?.nome || null,
                brasao: clubById.get(athlete.id_clube)?.brasao || null,
                total: 0,
              }));
            list = [...list, ...remaining].slice(0, 4);
          } catch {
            // Mantém os líderes retornados pela API.
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
        <Link to="/estatisticas" className="button-quiet hidden sm:inline-flex">Ver ranking <ArrowRight className="h-4 w-4" /></Link>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => <div key={index} className="h-[34rem] animate-pulse rounded-2xl bg-[var(--muted)]" />)}
        </div>
      ) : athletes.length ? (
        <div className={`grid gap-4 sm:grid-cols-2 ${athletes.length >= 3 ? 'lg:grid-cols-3' : ''}`}>
          {athletes.slice(0, 3).map((athlete, index) => (
            <PlayerCard key={athlete.id_atleta} id={athlete.id_atleta} name={athlete.nome} club={athlete.clube || 'Sem clube'} clubLogo={athlete.brasao} photo={athlete.foto_perfil} rank={index + 1} goals={athlete.total} />
          ))}
        </div>
      ) : (
        <div className="border border-dashed border-[var(--border)] px-6 py-12 text-center text-sm text-[var(--muted-foreground)]">
          Os destaques aparecerão após as primeiras súmulas finalizadas.
        </div>
      )}
      <Link to="/estatisticas" className="button-quiet mt-5 inline-flex sm:hidden">Ver ranking <ArrowRight className="h-4 w-4" /></Link>
    </section>
  );
}