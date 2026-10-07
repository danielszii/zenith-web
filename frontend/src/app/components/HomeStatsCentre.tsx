import { useEffect, useState } from 'react';
import { ArrowRight, Goal, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';

type Stats = { resumo: { gols: number; partidas_finalizadas: number }; lideres: { gols: { id_atleta: string; nome: string; clube: string | null; total: number }[] }; clubes: { id_clube: string; nome: string; jogos: number; gols: number; sofridos: number }[] };

export function HomeStatsCentre() {
  const [stats, setStats] = useState<Stats | null>(null);
  useEffect(() => { api.get<Stats>('/public/estatisticas').then(({ data }) => setStats(data)).catch(console.error); }, []);
  const scorers = stats?.lideres.gols.slice(0, 5) ?? [];
  const clubs = stats?.clubes.slice(0, 5) ?? [];

  return <section className="app-shell mt-20">
    <div className="section-rule mb-7 flex items-end justify-between gap-4"><div><p className="eyebrow">Performance oficial</p><h2 className="font-display mt-2 text-5xl tracking-wide md:text-6xl">CENTRAL ESTATÍSTICA</h2></div><Link to="/statistics" className="button-quiet hidden sm:inline-flex">Ver todos os dados <ArrowRight className="h-4 w-4" /></Link></div>
    <div className="grid gap-px overflow-hidden border border-[var(--border)] bg-[var(--border)] lg:grid-cols-2">
      <div className="bg-[var(--card)]"><div className="flex items-center justify-between border-b border-[var(--border)] p-5"><div className="flex items-center gap-3"><Goal className="h-5 w-5 text-[var(--primary)]" /><div><p className="text-[.6rem] font-black uppercase tracking-[.16em] text-[var(--muted-foreground)]">Ranking individual</p><h3 className="text-sm font-black">Artilheiros</h3></div></div><span className="font-display text-4xl text-[var(--primary)]">{stats?.resumo.gols ?? 0}</span></div><Ranking rows={scorers.map(row => ({ id: row.id_atleta, name: row.nome, sub: row.clube || 'Sem clube', value: row.total }))} /></div>
      <div className="bg-[var(--card)]"><div className="flex items-center justify-between border-b border-[var(--border)] p-5"><div className="flex items-center gap-3"><Trophy className="h-5 w-5 text-[var(--primary)]" /><div><p className="text-[.6rem] font-black uppercase tracking-[.16em] text-[var(--muted-foreground)]">Ranking coletivo</p><h3 className="text-sm font-black">Melhores ataques</h3></div></div><span className="text-[.6rem] font-black uppercase tracking-wider text-[var(--muted-foreground)]">{stats?.resumo.partidas_finalizadas ?? 0} jogos</span></div><Ranking rows={clubs.map(row => ({ id: row.id_clube, name: row.nome, sub: `${row.jogos} jogos · ${row.sofridos} sofridos`, value: row.gols }))} /></div>
    </div>
  </section>;
}

function Ranking({ rows }: { rows: { id: string; name: string; sub: string; value: number }[] }) {
  if (!rows.length) return <div className="p-10 text-center text-sm text-[var(--muted-foreground)]">Os rankings aparecerão após as primeiras súmulas.</div>;
  return <div>{rows.map((row, index) => <div key={row.id} className="grid grid-cols-[2rem_1fr_auto] items-center gap-3 border-b border-[var(--border)] px-5 py-3.5 last:border-0"><span className="font-display text-xl text-[var(--muted-foreground)]">{String(index + 1).padStart(2, '0')}</span><div className="min-w-0"><strong className="block truncate text-sm">{row.name}</strong><span className="block truncate text-[.7rem] text-[var(--muted-foreground)]">{row.sub}</span></div><strong className="font-display text-3xl text-[var(--primary)]">{row.value}</strong></div>)}</div>;
}
