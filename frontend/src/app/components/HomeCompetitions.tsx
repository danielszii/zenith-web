import { useEffect, useState } from 'react';
import { ArrowRight, CalendarDays, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import type { Championship } from '../types/api';

export function HomeCompetitions() {
  const [championships, setChampionships] = useState<Championship[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<Championship[]>('/campeonatos')
      .then(({ data }) => setChampionships(orderChampionships(data).slice(0, 3)))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="app-shell mt-20">
      <div className="section-rule mb-7 flex items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Temporada Zenith</p>
          <h2 className="font-display mt-2 text-4xl tracking-wide md:text-6xl">COMPETIÇÕES EM DESTAQUE</h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-[var(--muted-foreground)]">
            Consulte calendário, período de disputa e números oficiais de cada competição.
          </p>
        </div>
        <Link to="/competicoes" className="button-quiet hidden sm:inline-flex">
          Ver competições <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {loading ? (
        <div className="grid gap-px bg-[var(--border)] md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => <div key={index} className="h-60 animate-pulse bg-[var(--muted)]" />)}
        </div>
      ) : championships.length ? (
        <div className="grid gap-px overflow-hidden border border-[var(--border)] bg-[var(--border)] md:grid-cols-3">
          {championships.map(championship => (
            <article key={championship.id_campeonato} className="group flex min-h-60 flex-col bg-[var(--card)] p-6 transition-colors hover:bg-[var(--surface-glass-hover)]">
              <div className="flex items-start justify-between">
                <span className="grid h-10 w-10 place-items-center bg-[var(--primary)] text-[var(--primary-foreground)]">
                  <Trophy className="h-4 w-4" />
                </span>
                <span className="text-[.6rem] font-black uppercase tracking-[.14em] text-[var(--muted-foreground)]">
                  {statusLabel(championship.status)}
                </span>
              </div>
              <div className="mt-7 flex-1">
                <p className="text-[.62rem] font-black uppercase tracking-[.16em] text-[var(--primary)]">
                  {championship.modalidade} · {championship.categoria}
                </p>
                <h3 className="mt-2 text-xl font-black leading-tight">{championship.nome}</h3>
              </div>
              <div className="mt-6 flex items-center justify-between border-t border-[var(--border)] pt-4">
                <span className="flex items-center gap-1.5 text-[.68rem] text-[var(--muted-foreground)]">
                  <CalendarDays className="h-3.5 w-3.5" /> {formatDate(championship.data_inicio)} — {formatDate(championship.data_fim)}
                </span>
                <Link aria-label={`Ver estatísticas de ${championship.nome}`} to={`/estatisticas?campeonato=${championship.id_campeonato}`}>
                  <ArrowRight className="h-4 w-4 text-[var(--primary)] transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="border border-dashed border-[var(--border)] px-6 py-12 text-center text-sm text-[var(--muted-foreground)]">
          As competições aparecerão aqui assim que forem publicadas.
        </div>
      )}

      <Link to="/competicoes" className="button-quiet mt-4 inline-flex sm:hidden">
        Ver competições <ArrowRight className="h-4 w-4" />
      </Link>
    </section>
  );
}

function orderChampionships(championships: Championship[]) {
  const priority: Record<Championship['status'], number> = { 'em andamento': 0, planejado: 1, finalizado: 2 };
  return [...championships].sort((a, b) => priority[a.status] - priority[b.status] || a.data_inicio.localeCompare(b.data_inicio));
}

function formatDate(value: string) {
  return String(value).slice(0, 10).split('-').reverse().join('/');
}

function statusLabel(status: Championship['status']) {
  return ({ planejado: 'Em breve', 'em andamento': 'Em andamento', finalizado: 'Finalizada' })[status];
}
