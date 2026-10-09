import { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { api } from './services/api';
import { Navbar } from './components/Navbar';
import type { Match } from './types/api';
import { SearchBar } from './components/SearchBar';
import { PlayerProfile } from './components/PlayerProfile';
import { ChampionshipsPage } from './components/ChampionshipsPage';
import { Gallery } from './components/Gallery';
import { Footer } from './components/Footer';
import { GamesAndResults } from './components/GamesAndResults';
import { ClubProfile } from './components/ClubProfile';
import { Logo } from './components/Logo';
import { ManagementPage } from './components/ManagementPage';
import { StatisticsPage } from './components/StatisticsPage';
import { MatchCentre } from './components/MatchCentre';
import { HomeStatsCentre } from './components/HomeStatsCentre';
import { MatchTicker } from './components/MatchTicker';
import { HomeCompetitions } from './components/HomeCompetitions';
import { HomeFeaturedAthletes } from './components/HomeFeaturedAthletes';
import { AthletesPage } from './components/AthletesPage';

const pageRoutes: Record<string, string> = {
  dashboard: '/',
  championships: '/competicoes',
  matches: '/partidas',
  statistics: '/estatisticas',
  gallery: '/midia',
  management: '/gestao',
  players: '/atletas',
  club: '/clubes',
};

const routePages: Record<string, string> = {
  competicoes: 'championships',
  partidas: 'matches',
  estatisticas: 'statistics',
  midia: 'gallery',
  gestao: 'management',
  atletas: 'players',
  clubes: 'club',
};

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const routeSegment = location.pathname.split('/')[1];
  const currentPage = routePages[routeSegment] || 'dashboard';

  const go = (page: string) => navigate(pageRoutes[page] || '/');

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get<Match[]>('/partidas');
        setMatches(previous => JSON.stringify(previous) === JSON.stringify(data) ? previous : data);
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
            <SearchBar />
          </div>
          <button
            type="button"
            onClick={() => navigate('/gestao')}
            className="button-secondary min-h-10 shrink-0 px-3 sm:px-4"
            aria-label="Entrar na gestão"
          >
            <LogIn className="h-4 w-4" />
            <span className="hidden lg:inline">Entrar</span>
          </button>
        </div>
      </header>

      <Routes>
        <Route path="/" element={<Dashboard matches={matches} loading={loading} />} />
        <Route path="/atletas" element={<AthletesPage />} />
        <Route path="/atletas/:id" element={<PlayerProfile />} />
        <Route path="/clubes/:id?" element={<ClubProfile />} />
        <Route path="/competicoes" element={<ChampionshipsPage />} />
        <Route path="/midia" element={<Gallery />} />
        <Route path="/gestao" element={<ManagementPage />} />
        <Route path="/partidas" element={<GamesAndResults />} />
        <Route path="/partidas/:id" element={<MatchCentre />} />
        <Route path="/estatisticas" element={<StatisticsPage />} />
        <Route path="/players/:id?" element={<LegacyRedirect target="/atletas" />} />
        <Route path="/club/:id?" element={<LegacyRedirect target="/clubes" />} />
        <Route path="/championships" element={<Navigate to="/competicoes" replace />} />
        <Route path="/gallery" element={<Navigate to="/midia" replace />} />
        <Route path="/management" element={<Navigate to="/gestao" replace />} />
        <Route path="/matches/:id?" element={<LegacyRedirect target="/partidas" />} />
        <Route path="/statistics" element={<Navigate to="/estatisticas" replace />} />
      </Routes>

      <Footer />
    </div>
  );
}

function Dashboard({ matches, loading }: { matches: Match[]; loading: boolean }) {
  return (
    <main className="page-enter min-w-0 flex-1 pb-8">
      {!loading && <MatchTicker matches={matches} />}

      <HomeFeaturedAthletes />
      <HomeCompetitions />
      <HomeStatsCentre />
    </main>
  );
}

function LegacyRedirect({ target }: { target: string }) {
  const location = useLocation();
  const id = location.pathname.split('/')[2];
  return <Navigate to={id ? `${target}/${id}` : target} replace />;
}
