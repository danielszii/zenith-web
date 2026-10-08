import { useEffect, useMemo, useState } from 'react';
import { Activity, ArrowUpRight, Goal, Medal, Shield, Sparkles, Trophy, Users } from 'lucide-react';
import { api } from '../services/api';
import type { Championship } from '../types/api';
import { useSearchParams } from 'react-router-dom';

type Leader = { id_atleta: string; nome: string; clube: string | null; total: number };
type Discipline = { id_atleta: string; nome: string; clube: string | null; amarelos: number; vermelhos: number };
type ClubStat = { id_clube: string; nome: string; jogos: number; gols: number; sofridos: number };
type Stats = {
  resumo: { partidas_finalizadas: number; partidas_ao_vivo: number; gols: number; campeonatos: number };
  lideres: { gols: Leader[]; assistencias: Leader[]; disciplina: Discipline[] };
  clubes: ClubStat[];
};
type Ranking = 'gols' | 'assistencias' | 'disciplina';

export function StatisticsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [stats, setStats] = useState<Stats | null>(null);
  const [championships, setChampionships] = useState<Championship[]>([]);
  const [championship, setChampionship] = useState(searchParams.get('campeonato') || '');
  const [ranking, setRanking] = useState<Ranking>('gols');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<Championship[]>('/campeonatos').then(({ data }) => setChampionships(data)).catch(console.error);
  }, []);

  useEffect(() => {
    setLoading(true);
    const suffix = championship ? `?campeonato=${championship}` : '';
    api.get<Stats>(`/public/estatisticas${suffix}`)
      .then(({ data }) => setStats(data))
      .catch(error => { console.error(error); setStats(null); })
      .finally(() => setLoading(false));
  }, [championship]);

  const leaders = useMemo(() => ranking === 'disciplina' ? stats?.lideres.disciplina ?? [] : stats?.lideres[ranking] ?? [], [ranking, stats]);

  return (
    <main className="page-enter flex-1 pb-16">
      <section className="app-shell pb-10 pt-14 md:pt-20">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-glass)] px-3 py-2">
              <Sparkles className="h-3.5 w-3.5 text-[var(--primary)]" />
              <span className="eyebrow">Dados oficiais do Zenith</span>
            </div>
            <h1 className="font-display text-6xl leading-[.85] tracking-wide md:text-8xl">CENTRAL DE<br /><span className="text-[var(--primary)]">ESTATÍSTICAS</span></h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-[var(--muted-foreground)]">Classificação de desempenho, líderes individuais e números dos clubes atualizados diretamente pelas súmulas.</p>
          </div>
          <label className="w-full max-w-sm">
            <span className="eyebrow mb-2 block">Competição</span>
            <select value={championship} onChange={event => { const value = event.target.value; setChampionship(value); setSearchParams(value ? { campeonato: value } : {}); }} className="h-12 w-full border border-[var(--border)] bg-[var(--card)] px-4 text-sm font-bold outline-none transition-colors focus:border-[var(--primary)]">
              <option value="">Todos os campeonatos</option>
              {championships.map(item => <option key={item.id_campeonato} value={item.id_campeonato}>{item.nome}</option>)}
            </select>
          </label>
        </div>
      </section>

      <section className="app-shell grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Summary icon={<Activity />} label="Ao vivo" value={stats?.resumo.partidas_ao_vivo ?? 0} highlight />
        <Summary icon={<Goal />} label="Gols registrados" value={stats?.resumo.gols ?? 0} />
        <Summary icon={<Trophy />} label="Jogos finalizados" value={stats?.resumo.partidas_finalizadas ?? 0} />
        <Summary icon={<Shield />} label="Competições" value={stats?.resumo.campeonatos ?? 0} />
      </section>

      <section className="app-shell mt-12 grid gap-5 lg:grid-cols-[1.15fr_.85fr]">
        <div className="surface-panel overflow-hidden rounded-3xl">
          <div className="flex flex-col gap-4 border-b border-[var(--border)] p-5 sm:flex-row sm:items-center sm:justify-between">
            <div><p className="eyebrow">Destaques individuais</p><h2 className="font-display mt-1 text-3xl tracking-wide">LÍDERES DA TEMPORADA</h2></div>
            <div className="scrollbar-hide flex overflow-x-auto rounded-full bg-[var(--background)] p-1">
              {([['gols', 'Gols'], ['assistencias', 'Assistências'], ['disciplina', 'Cartões']] as [Ranking, string][]).map(([id, label]) => <button key={id} onClick={() => setRanking(id)} className={`shrink-0 rounded-full px-4 py-2 text-xs font-extrabold transition-all ${ranking === id ? 'bg-[var(--primary)] text-[var(--primary-foreground)]' : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'}`}>{label}</button>)}
            </div>
          </div>
          <RankingList loading={loading} ranking={ranking} rows={leaders} />
        </div>

        <div className="surface-panel overflow-hidden rounded-3xl">
          <div className="border-b border-[var(--border)] p-5"><p className="eyebrow">Força coletiva</p><h2 className="font-display mt-1 text-3xl tracking-wide">ATAQUES MAIS EFICIENTES</h2></div>
          <div className="divide-y divide-[var(--border)]">
            {loading ? <LoadingRows /> : stats?.clubes.length ? stats.clubes.map((club, index) => (
              <div key={club.id_clube} className="grid grid-cols-[2rem_1fr_auto] items-center gap-3 px-5 py-4 transition-colors hover:bg-[var(--muted)]/40">
                <span className="font-display text-2xl text-[var(--muted-foreground)]">{String(index + 1).padStart(2, '0')}</span>
                <div className="min-w-0"><strong className="block truncate text-sm">{club.nome}</strong><span className="text-xs text-[var(--muted-foreground)]">{club.jogos} jogos · {club.sofridos} sofridos</span></div>
                <div className="text-right"><strong className="font-display block text-3xl text-[var(--primary)]">{club.gols}</strong><span className="text-[.6rem] font-bold uppercase tracking-widest text-[var(--muted-foreground)]">gols</span></div>
              </div>
            )) : <EmptyState />}
          </div>
        </div>
      </section>

      <section className="app-shell mt-5 rounded-3xl border border-[var(--border)] bg-[linear-gradient(120deg,var(--card),color-mix(in_srgb,var(--primary),transparent_94%))] p-6 md:flex md:items-center md:justify-between md:p-8">
        <div className="flex items-start gap-4"><div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[var(--primary)] text-[var(--primary-foreground)]"><Medal className="h-5 w-5" /></div><div><h3 className="text-lg font-extrabold">Cada evento conta uma história</h3><p className="mt-1 max-w-2xl text-sm leading-6 text-[var(--muted-foreground)]">Os dados vêm das súmulas registradas no aplicativo e são consolidados automaticamente no portal.</p></div></div>
        <a href="/partidas" className="button-secondary mt-5 md:mt-0">Ver partidas <ArrowUpRight className="h-4 w-4" /></a>
      </section>
    </main>
  );
}

function Summary({ icon, label, value, highlight }: { icon: React.ReactNode; label: string; value: number; highlight?: boolean }) {
  return <div className="surface-panel rounded-2xl p-5"><div className={`flex items-center gap-2 ${highlight ? 'text-red-400' : 'text-[var(--primary)]'}`}>{icon}<span className="text-[.65rem] font-extrabold uppercase tracking-[.14em]">{label}</span></div><strong className="font-display mt-4 block text-5xl font-normal">{value}</strong></div>;
}

function RankingList({ loading, ranking, rows }: { loading: boolean; ranking: Ranking; rows: (Leader | Discipline)[] }) {
  if (loading) return <LoadingRows />;
  if (!rows.length) return <EmptyState />;
  return <div className="divide-y divide-[var(--border)]">{rows.map((row, index) => {
    const score = ranking === 'disciplina' ? `${(row as Discipline).amarelos}A · ${(row as Discipline).vermelhos}V` : (row as Leader).total;
    return <div key={row.id_atleta} className="grid grid-cols-[2rem_2.5rem_1fr_auto] items-center gap-3 px-5 py-4 transition-colors hover:bg-[var(--muted)]/40"><span className="font-display text-2xl text-[var(--muted-foreground)]">{String(index + 1).padStart(2, '0')}</span><span className="grid h-10 w-10 place-items-center rounded-full bg-[var(--muted)] text-xs font-black">{row.nome.split(' ').slice(0, 2).map(part => part[0]).join('')}</span><div className="min-w-0"><strong className="block truncate text-sm">{row.nome}</strong><span className="text-xs text-[var(--muted-foreground)]">{row.clube || 'Sem clube'}</span></div><strong className="font-display text-3xl text-[var(--primary)]">{score}</strong></div>;
  })}</div>;
}

function LoadingRows() { return <div className="space-y-px">{Array.from({ length: 5 }).map((_, index) => <div key={index} className="h-[73px] animate-pulse bg-[var(--muted)]/40" />)}</div>; }
function EmptyState() { return <div className="px-6 py-14 text-center"><Users className="mx-auto h-7 w-7 text-[var(--muted-foreground)]" /><p className="mt-3 text-sm font-bold">Ainda não há dados suficientes.</p><p className="mt-1 text-xs text-[var(--muted-foreground)]">As estatísticas aparecerão após o registro das súmulas.</p></div>; }
