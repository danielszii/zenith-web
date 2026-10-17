import { useEffect, useState } from 'react';
import { ArrowLeft, CalendarDays, Ruler, Shield, UserRound, Weight } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../services/api';
import type { AthleteStats, Club, PublicAthlete } from '../types/api';
import defaultPlayerPhoto from '../../assets/player-default.png';

type ProfileData = { athlete: PublicAthlete; stats: AthleteStats; club?: Club; teammates: PublicAthlete[] };

export function PlayerProfile() {
  const { id } = useParams();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    Promise.all([
      api.get<PublicAthlete>(`/public/atletas/${id}`),
      api.get<AthleteStats>(`/public/atletas/${id}/estatisticas`),
      api.get<Club[]>('/clubes'),
      api.get<PublicAthlete[]>('/public/atletas'),
    ]).then(([athleteResponse, statsResponse, clubsResponse, athletesResponse]) => {
      const athlete = athleteResponse.data;
      setProfile({
        athlete,
        stats: statsResponse.data,
        club: clubsResponse.data.find(club => club.id_clube === athlete.id_clube),
        teammates: athletesResponse.data.filter(item => item.id_clube === athlete.id_clube && item.id_atleta !== athlete.id_atleta).slice(0, 6),
      });
    }).catch(() => setFailed(true)).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <ProfileSkeleton />;
  if (failed || !profile) return <main className="app-shell flex-1 py-24 text-center"><p className="font-display text-5xl">ATLETA NÃO ENCONTRADO</p><Link to="/atletas" className="button-secondary mt-6">Voltar aos atletas</Link></main>;

  const { athlete, stats, club, teammates } = profile;
  const performance = stats.estatisticas;

  return (
    <main className="page-enter flex-1 pb-16">
      <section className="app-shell pt-8"><Link to="/atletas" className="button-quiet inline-flex"><ArrowLeft className="h-4 w-4" /> Todos os atletas</Link></section>

      <section className="mt-6 border-y border-[var(--border)] bg-[var(--card)]">
        <div className="app-shell grid min-h-72 md:grid-cols-[220px_1fr_auto]">
          <div className="relative grid min-h-52 place-items-center overflow-hidden border-b border-[var(--border)] bg-[var(--primary)] text-[var(--primary-foreground)] md:border-b-0 md:border-r">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(8,11,10,.18)_1px,transparent_0)] bg-[length:10px_10px]" />
            <img src={athlete.foto_perfil || defaultPlayerPhoto} alt={athlete.nome} onError={(e) => { e.currentTarget.src = defaultPlayerPhoto; }} className="absolute inset-0 h-full w-full object-cover object-[center_12%]" />
          </div>
          <div className="flex flex-col justify-center px-6 py-9 md:px-10">
            <p className="eyebrow">Perfil oficial</p>
            <h1 className="font-display mt-3 text-5xl leading-none md:text-7xl">{athlete.nome}</h1>
            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-[var(--muted-foreground)]">
              <span className="font-bold text-[var(--primary)]">{club?.nome || stats.jogador.time_atual || 'Sem clube'}</span>
              <span>{ageFrom(athlete.data_nasc)} anos</span>
              <span className="capitalize">Situação: {athlete.status}</span>
            </div>
          </div>
          <div className="flex items-center border-t border-[var(--border)] px-6 py-6 md:border-l md:border-t-0 md:px-10">
            <div><span className="font-display block text-7xl text-[var(--primary)]">{performance.gols}</span><span className="text-[.65rem] font-black uppercase tracking-[.16em] text-[var(--muted-foreground)]">Gols na temporada</span></div>
          </div>
        </div>
      </section>

      <section className="app-shell mt-12">
        <div className="grid gap-px overflow-hidden border border-[var(--border)] bg-[var(--border)] sm:grid-cols-2 lg:grid-cols-4">
          <Metric value={performance.partidas_jogadas} label="Partidas" />
          <Metric value={performance.gols} label="Gols" accent />
          <Metric value={performance.assistencias} label="Assistências" />
          <Metric value={performance.cartoes_amarelos + performance.cartoes_vermelhos} label="Cartões" />
        </div>
      </section>

      <section className="app-shell mt-10 grid gap-8 lg:grid-cols-[1.5fr_.8fr]">
        <div>
          <div className="section-rule mb-5"><p className="eyebrow">Dados do atleta</p><h2 className="font-display mt-2 text-4xl">INFORMAÇÕES</h2></div>
          <div className="grid gap-px overflow-hidden border border-[var(--border)] bg-[var(--border)] sm:grid-cols-2">
            <Info icon={<CalendarDays />} label="Nascimento" value={formatDate(athlete.data_nasc)} />
            <Info icon={<Ruler />} label="Altura" value={athlete.altura ? `${athlete.altura} m` : 'Não informada'} />
            <Info icon={<Weight />} label="Peso" value={athlete.peso ? `${athlete.peso} kg` : 'Não informado'} />
            <Info icon={<Shield />} label="Situação" value={athlete.status || 'Não informada'} />
          </div>

          <div className="mt-8 border border-[var(--border)] bg-[var(--card)]">
            <div className="border-b border-[var(--border)] p-5"><p className="eyebrow">Disciplina</p></div>
            <div className="grid grid-cols-2 gap-px bg-[var(--border)]">
              <Metric value={performance.cartoes_amarelos} label="Amarelos" tone="warning" />
              <Metric value={performance.cartoes_vermelhos} label="Vermelhos" tone="danger" />
            </div>
          </div>
        </div>

        <aside>
          <div className="section-rule mb-5"><p className="eyebrow">Elenco atual</p><h2 className="font-display mt-2 text-4xl">COMPANHEIROS</h2></div>
          <div className="border border-[var(--border)] bg-[var(--card)]">
            {teammates.length ? teammates.map(teammate => (
              <Link key={teammate.id_atleta} to={`/atletas/${teammate.id_atleta}`} className="group grid grid-cols-[2.5rem_1fr_auto] items-center gap-3 border-b border-[var(--border)] p-4 last:border-0 hover:bg-[var(--surface-glass-hover)]">
                <span className="grid h-10 w-10 place-items-center overflow-hidden bg-[var(--muted)]">
                  <img src={teammate.foto_perfil || defaultPlayerPhoto} alt={teammate.nome} onError={(e) => { e.currentTarget.src = defaultPlayerPhoto; }} className="h-full w-full object-cover" />
                </span>
                <span className="min-w-0 truncate text-sm font-bold">{teammate.nome}</span>
                <ArrowLeft className="h-4 w-4 rotate-180 text-[var(--primary)] transition-transform group-hover:translate-x-1" />
              </Link>
            )) : <p className="p-8 text-center text-sm text-[var(--muted-foreground)]">Nenhum companheiro cadastrado.</p>}
          </div>
        </aside>
      </section>
    </main>
  );
}

function Metric({ value, label, accent, tone }: { value: number; label: string; accent?: boolean; tone?: 'warning' | 'danger' }) {
  const color = tone === 'warning' ? 'text-amber-400' : tone === 'danger' ? 'text-red-400' : accent ? 'text-[var(--primary)]' : '';
  return <div className="bg-[var(--card)] p-6"><strong className={`font-display block text-5xl ${color}`}>{value}</strong><span className="mt-1 block text-[.62rem] font-black uppercase tracking-[.15em] text-[var(--muted-foreground)]">{label}</span></div>;
}

function Info({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return <div className="flex items-center gap-4 bg-[var(--card)] p-5"><span className="grid h-10 w-10 place-items-center bg-[var(--muted)] text-[var(--primary)] [&>svg]:h-4 [&>svg]:w-4">{icon}</span><div><span className="block text-[.6rem] font-black uppercase tracking-[.14em] text-[var(--muted-foreground)]">{label}</span><strong className="mt-1 block text-sm">{value}</strong></div></div>;
}

function ProfileSkeleton() {
  return <main className="app-shell flex-1 py-16"><div className="h-72 animate-pulse bg-[var(--muted)]" /><div className="mt-8 grid grid-cols-4 gap-1">{Array.from({ length: 4 }).map((_, index) => <div key={index} className="h-32 animate-pulse bg-[var(--muted)]" />)}</div></main>;
}

function ageFrom(value: string) {
  const birth = new Date(value);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  if (today.getMonth() < birth.getMonth() || (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())) age--;
  return age;
}

function formatDate(value: string) { return String(value).slice(0, 10).split('-').reverse().join('/'); }
