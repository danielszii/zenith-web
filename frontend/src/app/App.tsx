import { useEffect, useState, type ReactNode } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, Radio, ShieldCheck, Sparkles } from 'lucide-react';
import { api } from './services/api';
import { Navbar } from './components/Navbar';
import { LiveMatchCards, type Match } from './components/LiveMatchCards';
import { SearchBar } from './components/SearchBar';
import { PlayerProfile } from './components/PlayerProfile';
import { ChampionshipsPage } from './components/ChampionshipsPage';
import { Gallery } from './components/Gallery';
import { ThemeToggle } from './components/ThemeToggle';
import { Footer } from './components/Footer';
import { GamesAndResults } from './components/GamesAndResults';
import { ClubProfile } from './components/ClubProfile';
import { Logo } from './components/Logo';
import { ManagementPage } from './components/ManagementPage';
import { StatisticsPage } from './components/StatisticsPage';
import { MatchCentre } from './components/MatchCentre';
import { HomeStatsCentre } from './components/HomeStatsCentre';
import { MatchTicker } from './components/MatchTicker';

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const currentPage = location.pathname.split('/')[1] || 'dashboard';

  const go = (page: string) => navigate(page === 'dashboard' ? '/' : `/${page}`);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get<Match[]>('/partidas');
        setMatches(prev => {
          if (JSON.stringify(prev) === JSON.stringify(data)) return prev;
          return data;
        });
      } catch (error) {
        console.error('Erro ao carregar partidas:', error);
      } finally {
        setLoading(false);
      }
    };

    void load();
    const timer = window.setInterval(load, 10000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="flex min-h-screen flex-col text-[var(--foreground)]">
      <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[color:var(--background)]/85 backdrop-blur-2xl">
        <div className="app-shell flex h-[72px] min-w-0 items-center gap-2 sm:gap-4">
          <Logo onClick={() => navigate('/')} />
          <div className="ml-auto min-w-0 md:ml-5">
            <Navbar activePage={currentPage} onNavigate={go} />
          </div>
          <div className="ml-auto hidden w-64 2xl:block">
            <SearchBar onNavigate={go} />
          </div>
          <div className="hidden sm:block">
            <ThemeToggle />
          </div>
        </div>
      </header>

      <Routes>
        <Route path="/" element={<Dashboard matches={matches} loading={loading} onExplore={() => navigate('/matches')} />} />
        <Route path="/players" element={<PlayerProfile />} />
        <Route path="/club" element={<ClubProfile />} />
        <Route path="/championships" element={<ChampionshipsPage />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/management" element={<ManagementPage />} />
        <Route path="/matches" element={<GamesAndResults />} />
        <Route path="/matches/:id" element={<MatchCentre />} />
        <Route path="/statistics" element={<StatisticsPage />} />
      </Routes>

      <Footer />
    </div>
  );
}

function Dashboard({ matches, loading, onExplore }: { matches: Match[]; loading: boolean; onExplore: () => void }) {
  return (
    <main className="page-enter min-w-0 flex-1 pb-8">
      {!loading && <MatchTicker matches={matches} />}

      {/* Hero */}
      <section className="border-b border-[var(--border)] bg-[var(--background)]">
        <div className="app-shell flex min-h-[460px] flex-col justify-center py-20">
          <p className="eyebrow mb-5">Plataforma oficial Zenith</p>
          <h1 className="font-display max-w-3xl text-[clamp(2.6rem,9vw,7rem)] leading-[.86] tracking-[.015em]">
            TODOS OS JOGOS.<br />
            <span className="text-[var(--primary)]">UM SÓ LUGAR.</span>
          </h1>
        </div>
      </section>

      <section className="app-shell mt-4">
        <div className="section-rule mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Agora no Zenith</p>
            <h2 className="font-display mt-2 text-4xl tracking-wide md:text-5xl">CENTRAL DE PARTIDAS</h2>
          </div>
          <button onClick={onExplore} className="button-quiet hidden sm:inline-flex">
            Ver calendário <ArrowRight className="h-4 w-4" />
          </button>
        </div>
        {loading ? (
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="h-72 animate-pulse rounded-3xl bg-[var(--muted)] lg:col-span-2" />
            <div className="h-56 animate-pulse rounded-3xl bg-[var(--muted)]" />
            <div className="h-56 animate-pulse rounded-3xl bg-[var(--muted)]" />
          </div>
        ) : <LiveMatchCards matches={matches} />}
      </section>

      <HomeStatsCentre />

      <section className="app-shell mt-20 grid gap-px overflow-hidden border border-[var(--border)] bg-[var(--border)] md:grid-cols-3">
        <Feature icon={<Radio />} title="Placar ao vivo" text="Eventos chegam do aplicativo de súmula e aparecem no portal em segundos." />
        <Feature icon={<ShieldCheck />} title="Dados oficiais" text="Escalações, cartões e resultados validados em um fluxo seguro." />
        <Feature icon={<Sparkles />} title="Experiência completa" text="Informação clara para atletas, clubes, gestores e torcedores." />
      </section>
    </main>
  );
}

function Feature({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  return (
    <div className="bg-[var(--card)] p-6">
      <div className="mb-5 grid h-10 w-10 place-items-center bg-[var(--primary)] text-[var(--primary-foreground)]">{icon}</div>
      <h3 className="text-base font-bold">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">{text}</p>
    </div>
  );
}
