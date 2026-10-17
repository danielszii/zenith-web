import { useEffect, useState } from 'react';
import { ArrowLeft, CalendarDays, Clock3, Goal, MapPin, Radio, RefreshCw, ShieldAlert } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../services/api';

type Event = { id_evento: string; tipo_evento: string; minuto_evento?: number | null; nome_atleta?: string | null; nome_clube?: string | null; detalhe_evento?: string | null };
type MatchSheet = { detalhes_partida: { id_partida: string; nome_campeonato: string; nome_mandante: string; nome_visitante: string; gols_mandante: number; gols_visitante: number; data: string; hora: string; local: string; status: string }; sumula_eventos: Event[] };

export function MatchCentre() {
  const { id } = useParams();
  const [sheet, setSheet] = useState<MatchSheet | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const load = () => api.get<MatchSheet>(`/partidas/${id}/sumula`).then(({ data }) => setSheet(data)).catch(console.error).finally(() => setLoading(false));
    void load();
    const timer = window.setInterval(load, 5000);
    return () => window.clearInterval(timer);
  }, [id]);

  if (loading) return <main className="app-shell flex-1 py-16"><div className="h-96 animate-pulse rounded-3xl bg-[var(--muted)]" /></main>;
  if (!sheet) return <main className="app-shell flex-1 py-20 text-center"><p className="font-display text-5xl">PARTIDA NÃO ENCONTRADA</p><Link to="/partidas" className="button-secondary mt-6">Voltar às partidas</Link></main>;
  const match = sheet.detalhes_partida;
  const live = match.status === 'em_andamento';

  return <main className="page-enter flex-1 pb-16">
    <section className="app-shell pt-10"><Link to="/partidas" className="button-quiet inline-flex"><ArrowLeft className="h-4 w-4" /> Todas as partidas</Link></section>
    <section className="app-shell mt-7 overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[var(--card)]">
      <div className="border-b border-[var(--border)] p-6 text-center md:p-8"><div className="flex flex-wrap items-center justify-center gap-3"><span className="eyebrow">{match.nome_campeonato}</span><span className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[.65rem] font-black tracking-wider ${live ? 'bg-red-500/10 text-red-400' : 'bg-[var(--muted)] text-[var(--muted-foreground)]'}`}>{live && <Radio className="h-3 w-3 animate-pulse" />}{statusLabel(match.status)}</span></div><p className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-[var(--muted-foreground)]"><span className="flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5" />{formatDate(match.data)}</span><span className="flex items-center gap-1.5"><Clock3 className="h-3.5 w-3.5" />{match.hora.slice(0, 5)}</span><span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{match.local}</span></p></div>
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 px-4 py-12 sm:gap-8 md:px-12 md:py-16"><Team name={match.nome_mandante} /><div className="text-center"><p className="font-display whitespace-nowrap text-6xl leading-none sm:text-8xl">{match.gols_mandante}<span className="mx-3 text-[var(--muted-foreground)]">:</span>{match.gols_visitante}</p>{live && <p className="mt-4 inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-red-400"><RefreshCw className="h-3.5 w-3.5 animate-spin" /> atualizando ao vivo</p>}</div><Team name={match.nome_visitante} right /></div>
    </section>
    <section className="app-shell mt-6 grid gap-5 lg:grid-cols-[1fr_320px]">
      <div className="surface-panel overflow-hidden rounded-3xl"><div className="border-b border-[var(--border)] p-5"><p className="eyebrow">Súmula oficial</p><h2 className="font-display mt-1 text-3xl">LINHA DO TEMPO</h2></div>{sheet.sumula_eventos.length ? <div className="divide-y divide-[var(--border)]">{sheet.sumula_eventos.map(event => <div key={event.id_evento} className="grid grid-cols-[3rem_2.5rem_1fr] items-center gap-3 px-5 py-4"><strong className="font-display text-2xl text-[var(--primary)]">{event.minuto_evento ?? 0}'</strong><span className={`grid h-10 w-10 place-items-center rounded-full ${event.tipo_evento === 'GOL' ? 'bg-[var(--primary)] text-[var(--primary-foreground)]' : 'bg-[var(--muted)]'}`}>{eventIcon(event.tipo_evento)}</span><div><strong className="block text-sm">{eventTitle(event.tipo_evento)}</strong><span className="text-xs text-[var(--muted-foreground)]">{event.nome_atleta || event.nome_clube || 'Evento da partida'}{event.detalhe_evento ? ` · ${event.detalhe_evento}` : ''}</span></div></div>)}</div> : <div className="px-6 py-14 text-center"><Clock3 className="mx-auto h-7 w-7 text-[var(--muted-foreground)]" /><p className="mt-3 text-sm font-bold">A linha do tempo ainda está vazia.</p><p className="mt-1 text-xs text-[var(--muted-foreground)]">Os eventos aparecerão durante a partida.</p></div>}</div>
      <aside className="rounded-3xl border border-[var(--border)] p-6"><p className="eyebrow">Como funciona</p><h3 className="font-display mt-2 text-3xl">DADOS EM TEMPO REAL</h3><p className="mt-4 text-sm leading-6 text-[var(--muted-foreground)]">O Match Centre recebe gols, cartões e substituições enviados pelo aplicativo de súmula e atualiza esta página automaticamente.</p><div className="mt-6 flex items-center gap-2 rounded-xl bg-[var(--muted)] p-3 text-xs font-bold text-[var(--muted-foreground)]"><RefreshCw className="h-4 w-4 text-[var(--primary)]" /> Atualização a cada 5 segundos</div></aside>
    </section>
  </main>;
}

function Team({ name, right }: { name: string; right?: boolean }) { const initials = name.split(' ').filter(Boolean).slice(0, 2).map(word => word[0]).join(''); return <div className={`min-w-0 ${right ? 'text-right' : ''}`}><span className={`grid h-14 w-14 place-items-center rounded-2xl border border-[var(--border)] bg-[var(--muted)] text-sm font-black sm:h-20 sm:w-20 ${right ? 'ml-auto' : ''}`}>{initials}</span><h1 className="mt-4 text-sm font-extrabold sm:text-xl">{name}</h1></div>; }
function formatDate(value: string) { return String(value).slice(0, 10).split('-').reverse().join('/'); }
function statusLabel(status: string) { return ({ agendado: 'AGENDADA', em_andamento: 'AO VIVO', encerrado: 'ENCERRADA', cancelado: 'CANCELADA' } as Record<string, string>)[status] || status.toUpperCase(); }
function eventTitle(type: string) { return ({ GOL: 'Gol', CARTAO_AMARELO: 'Cartão amarelo', CARTAO_VERMELHO: 'Cartão vermelho', SUBSTITUICAO: 'Substituição', FALTA: 'Falta', PEDIDO_TEMPO: 'Pedido de tempo' } as Record<string, string>)[type] || type.replaceAll('_', ' '); }
function eventIcon(type: string) { return type === 'GOL' ? <Goal className="h-4 w-4" /> : <ShieldAlert className="h-4 w-4" />; }
