import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { KPICard } from './components/KPICard';
import { MatchCalendar } from './components/MatchCalendar';
import { SuspensionAlerts } from './components/SuspensionAlerts';
import { RankingTable } from './components/RankingTable';
import { TopScorers } from './components/TopScorers';
import { LiveMatchCards } from './components/LiveMatchCards';
import { TrendingScorers } from './components/TrendingScorers';
import { TeamOfTheWeekV2 } from './components/TeamOfTheWeekV2';
import { SearchBar } from './components/SearchBar';
import { PlayerProfile } from './components/PlayerProfile';
import { Championships } from './components/Championships';
import { ChampionshipsPage } from './components/ChampionshipsPage';
import { Gallery } from './components/Gallery';
import { ThemeToggle } from './components/ThemeToggle';
import { Footer } from './components/Footer';
import { GamesAndResults } from './components/GamesAndResults';
import { ClubProfile } from './components/ClubProfile';
import { AdBanner } from './components/AdBanner';
import { MatchReport } from './components/MatchReport';
import { FutsalMatchReport } from './components/FutsalMatchReport';
import { Login } from './components/Login';
import { Users, Trophy, Calendar, FileCheck, TrendingUp } from 'lucide-react';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Verificar se há sessão salva no localStorage
    return localStorage.getItem('isAuthenticated') === 'true';
  });
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'championships' | 'matches' | 'players' | 'gallery' | 'reports' | 'club' | 'sumula'>('dashboard');

  const handleLogin = (credentials: { email: string; password: string }) => {
    // Aqui você faria a validação real com o backend
    // Por enquanto, vamos apenas simular
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('userEmail', credentials.email);
    setIsAuthenticated(true);
    setShowLoginModal(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    setIsAuthenticated(false);
    setCurrentPage('dashboard');
  };

  return (
    <div className="min-h-screen bg-[var(--background)] transition-colors flex flex-col">
      {/* Header with Navbar and Search */}
      <header className="backdrop-blur-xl bg-[var(--surface-glass)] border-b border-[var(--border)] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 py-4">
          <div className="flex items-center justify-between gap-8 mb-4">
            {/* Logo/Brand */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[var(--primary)] rounded-xl flex items-center justify-center">
                <Trophy className="w-5 h-5 text-[var(--primary-foreground)]" />
              </div>
              <h1 className="text-xl font-semibold text-[var(--foreground)]">Sports Manager</h1>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-md">
              <SearchBar onNavigate={setCurrentPage} />
            </div>

            {/* Theme Toggle & User Profile */}
            <div className="flex items-center gap-3">
              <ThemeToggle />

              {isAuthenticated ? (
                <div className="relative group">
                  <div className="flex items-center gap-3 px-4 py-2 bg-[var(--surface-glass)] hover:bg-[var(--surface-glass-hover)] rounded-xl border border-[var(--border)] transition-all cursor-pointer">
                    <div className="w-8 h-8 bg-[var(--primary)] rounded-lg flex items-center justify-center">
                      <span className="text-[var(--primary-foreground)] text-xs font-semibold">AD</span>
                    </div>
                    <div className="text-sm">
                      <div className="text-[var(--foreground)] font-medium">Admin</div>
                      <div className="text-[var(--muted-foreground)] text-xs">Gestor</div>
                    </div>
                  </div>

                  {/* Dropdown Menu */}
                  <div className="absolute right-0 top-full mt-2 w-48 bg-[var(--background)] border border-[var(--border)] rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                    <div className="p-2">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[var(--foreground)] hover:bg-[var(--surface-glass-hover)] rounded-lg transition-all"
                      >
                        <span>Sair</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[var(--primary)] hover:opacity-90 rounded-xl text-[var(--primary-foreground)] font-medium transition-all"
                >
                  <span>Entrar</span>
                </button>
              )}
            </div>
          </div>

          {/* Navigation */}
          <Navbar activePage={currentPage} onNavigate={setCurrentPage} />
        </div>
      </header>

      {currentPage === 'players' ? (
        <>
          <PlayerProfile />
          <Footer />
        </>
      ) : currentPage === 'club' ? (
        <>
          <ClubProfile />
          <Footer />
        </>
      ) : currentPage === 'championships' ? (
        <>
          <ChampionshipsPage />
          <Footer />
        </>
      ) : currentPage === 'gallery' ? (
        <>
          <Gallery />
          <Footer />
        </>
      ) : currentPage === 'matches' ? (
        <>
          <main className="p-8 flex-1">
            <div className="max-w-7xl mx-auto">
              <GamesAndResults />
            </div>
          </main>
          <Footer />
        </>
      ) : currentPage === 'reports' ? (
        <>
          <main className="p-8 flex-1">
            <div className="max-w-7xl mx-auto">
              <div className="bg-[var(--surface-glass)] backdrop-blur-xl rounded-2xl border border-[var(--border)] p-20">
                <div className="text-center">
                  <FileCheck className="w-16 h-16 text-[var(--muted-foreground)] mx-auto mb-4" />
                  <h2 className="text-2xl text-[var(--foreground)] font-semibold mb-2">Relatórios</h2>
                  <p className="text-[var(--muted-foreground)] mb-6">Seção em desenvolvimento</p>
                  <button
                    onClick={() => setCurrentPage('sumula')}
                    className="px-6 py-3 bg-[var(--primary)] hover:opacity-90 rounded-xl text-[var(--primary-foreground)] font-medium transition-all"
                  >
                    Abrir Súmula Digital (Tablet)
                  </button>
                </div>
              </div>
            </div>
          </main>
          <Footer />
        </>
      ) : currentPage === 'sumula' ? (
        <FutsalMatchReport />
      ) : (
        <>
          <main className="p-8 flex-1">
            <div className="max-w-7xl mx-auto">

              {/* 1. HERO: Partidas em Destaque (Carrossel) */}
              <section className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <h2 className="text-2xl text-[var(--foreground)] font-semibold">Partidas em Destaque</h2>
                  <div className="h-px flex-1 bg-[var(--border)]"></div>
                </div>
                <LiveMatchCards />
              </section>

              {/* KPIs - Métricas Rápidas */}
              <section className="mb-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                  <KPICard
                    title="Atletas Ativos"
                    value="2,547"
                    change="+12% vs mês"
                    changeType="positive"
                    icon={Users}
                    iconColor="#737373"
                  />
                  <KPICard
                    title="Clubes"
                    value="156"
                    change="+8 novos"
                    changeType="positive"
                    icon={Trophy}
                    iconColor="#525252"
                  />
                  <KPICard
                    title="Partidas Hoje"
                    value="18"
                    change="3 ao vivo"
                    changeType="neutral"
                    icon={Calendar}
                    iconColor="#A3A3A3"
                  />
                  <KPICard
                    title="Súmulas"
                    value="5"
                    change="Pendentes"
                    changeType="negative"
                    icon={FileCheck}
                    iconColor="#737373"
                  />
                </div>
              </section>

              {/* 2. AÇÃO: Agenda do Fim de Semana (Rápido/Útil) */}
              <section className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <h2 className="text-2xl text-[var(--foreground)] font-semibold">Agenda do Fim de Semana</h2>
                  <div className="h-px flex-1 bg-[var(--border)]"></div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <MatchCalendar />
                  </div>
                  <div className="lg:col-span-1">
                    <SuspensionAlerts />
                  </div>
                </div>
              </section>

              {/* Espaço Publicitário */}
              <section className="mb-12">
                <AdBanner
                  type="video"
                  title="Parceiro Oficial 2026"
                  description="Apoiando o esporte brasileiro"
                  ctaText="Conheça Mais"
                  ctaUrl="#"
                />
              </section>

              {/* 3. ENGAJAMENTO: Seleção da Semana (Visual/Tático) */}
              <section className="mb-12">
                <TeamOfTheWeekV2 />
              </section>

              {/* 4. DADOS: Artilharias e Power Ranking (Estatística) */}
              <section className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <h2 className="text-2xl text-[var(--foreground)] font-semibold">Estatísticas e Rankings</h2>
                  <div className="h-px flex-1 bg-[var(--border)]"></div>
                </div>

                {/* Artilharias por Categoria */}
                <div className="mb-8">
                  <TrendingScorers />
                </div>

                {/* Power Ranking */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <RankingTable />
                  </div>
                  <div className="lg:col-span-1">
                    <TopScorers />
                  </div>
                </div>
              </section>

              {/* Status do Sistema */}
              <section>
                <div className="bg-[var(--surface-glass)] backdrop-blur-xl rounded-2xl border border-[var(--border)] p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <TrendingUp className="w-5 h-5 text-[var(--success)]" />
                    <h3 className="text-lg text-[var(--foreground)] font-semibold">Status do Sistema</h3>
                    <span className="ml-auto flex items-center gap-2 px-3 py-1.5 bg-[var(--success)]/10 border border-[var(--success)]/30 rounded-lg text-xs font-medium">
                      <span className="w-2 h-2 bg-[var(--success)] rounded-full animate-pulse"></span>
                      <span className="text-[var(--success)]">Operacional</span>
                    </span>
                  </div>
                  <p className="text-[var(--muted-foreground)] text-sm">Todos os sistemas funcionando normalmente. Última sincronização: há 2 minutos.</p>
                </div>
              </section>
            </div>
          </main>
          <Footer />
        </>
      )}

      {/* Login Modal */}
      <Login
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={handleLogin}
      />
    </div>
  );
}