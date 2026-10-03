import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { api } from './services/api';

// Importações dos Componentes
import { Navbar } from './components/Navbar';
import { LiveMatchCards, Match } from './components/LiveMatchCards';
import { SearchBar } from './components/SearchBar';
import { PlayerProfile } from './components/PlayerProfile';
import { ChampionshipsPage } from './components/ChampionshipsPage';
import { Gallery } from './components/Gallery';
import { ThemeToggle } from './components/ThemeToggle';
import { Footer } from './components/Footer';
import { GamesAndResults } from './components/GamesAndResults';
import { ClubProfile } from './components/ClubProfile';
import { AdBanner } from './components/AdBanner';
import { FutsalMatchReport } from './components/FutsalMatchReport';
import { Logo } from './components/Logo';

// Ícones
import { FileCheck, TrendingUp } from 'lucide-react';

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  // Estados apenas para os dados da Dashboard
  const [liveMatches, setLiveMatches] = useState<Match[]>([]);
  const [loadingMatches, setLoadingMatches] = useState<boolean>(true);

  // Mapeia o caminho da URL para a Navbar entender qual aba destacar
  const currentPage = location.pathname.split('/')[1] || 'dashboard';

  const handleNavigate = (page: string) => {
    if (page === 'dashboard') {
      navigate('/');
    } else {
      navigate(`/${page}`);
    }
  };

  // Busca partidas ao vivo/em andamento
  useEffect(() => {
    async function fetchLiveMatches() {
      try {
        setLoadingMatches(true);
        const response = await api.get('/partidas');

        // Filtra para exibir apenas as partidas que estão "em_andamento" ou "agendadas" no banco
        const partidasAoVivo = response.data.filter(
          (partida: any) => partida.status === 'em_andamento' || partida.status === 'agendado'
        );

        setLiveMatches(partidasAoVivo);
      } catch (error) {
        console.error("Erro ao carregar partidas:", error);
      } finally {
        setLoadingMatches(false);
      }
    }

    fetchLiveMatches();
  }, []);

  return (
    <div className="min-h-screen bg-[var(--background)] transition-colors flex flex-col">
      {/* Header Alinhado com a barra de pesquisa colada à direita com o ThemeToggle */}
      <header className="backdrop-blur-xl bg-[var(--surface-glass)] border-b border-[var(--border)] sticky top-0 z-50 h-20 flex items-center">
        <div className="w-full max-w-[95%] mx-auto px-6">
          <div className="flex items-center w-full">

            {/* GRUPO ESQUERDA: Logótipo + Menu de Navegação */}
            <div className="flex items-center gap-8 shrink-0">
              <div className="shrink-0 flex items-center">
                <Logo onClick={() => navigate('/')} />
              </div>

              <nav className="flex items-center">
                <Navbar activePage={currentPage} onNavigate={handleNavigate} />
              </nav>
            </div>

            {/* GRUPO DIREITA: Barra de Pesquisa + ThemeToggle */}
            <div className="ml-auto flex items-center gap-6">
              {/* Barra de Pesquisa com tamanho ajustado */}
              <div className="w-80 shrink-0">
                <SearchBar onNavigate={handleNavigate} />
              </div>

              <div className="h-6 w-px bg-[var(--border)] shrink-0" />

              {/* Apenas o controle de tema agora */}
              <ThemeToggle />
            </div>

          </div>
        </div>
      </header>

      {/* Roteamento das páginas */}
      <Routes>
        {/* Rota Raiz: Dashboard */}
        <Route path="/" element={
          /* main limpo e sem travas laterais */
          <main className="py-8 flex-1 overflow-x-hidden w-full">

            {/* 1. HERO: Partidas em Destaque */}
            <section className="mb-12 w-full overflow-visible">
              <div className="max-w-[90%] mx-auto mb-6 flex items-center gap-3">
                <h2 className="text-2xl text-[var(--foreground)] font-semibold">Partidas ao Vivo</h2>
                <div className="h-px flex-1 bg-[var(--border)]"></div>
              </div>

              {loadingMatches ? (
                <div className="text-sm text-[var(--muted-foreground)] animate-pulse py-4">
                  Carregando partidas em tempo real...
                </div>
              ) : (
                /* Renderize o componente diretamente! */
                <LiveMatchCards matches={liveMatches} />
              )}
            </section>

            {/* =========================================================================
                2. DIV CENTRALIZADORA DE 90% (AdBanner e Status)
                Isso garante que os outros elementos continuem comportados no centro.
               ========================================================================= */}
            <div className="max-w-[90%] mx-auto w-full">

              {/* Espaço Publicitário */}
              <section className="mb-12">
                <AdBanner
                  type="video"
                  videoUrl="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                  title="Parceiro Oficial 2026"
                  description="Apoiando o esporte brasileiro"
                  ctaText="Conheça Mais"
                  ctaUrl="#"
                />
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
        } />

        {/* Demais Rotas Públicas */}
        <Route path="/players" element={<PlayerProfile />} />
        <Route path="/club" element={<ClubProfile />} />
        <Route path="/championships" element={<ChampionshipsPage />} />
        <Route path="/gallery" element={<Gallery />} />

        <Route path="/matches" element={
          <main className="p-8 flex-1">
            <div className="max-w-[90%] mx-auto">
              <GamesAndResults />
            </div>
          </main>
        } />

        <Route path="/reports" element={
          <main className="p-8 flex-1">
            <div className="max-w-[90%] mx-auto">
              <div className="bg-[var(--surface-glass)] backdrop-blur-xl rounded-2xl border border-[var(--border)] p-20">
                <div className="text-center">
                  <FileCheck className="w-16 h-16 text-[var(--muted-foreground)] mx-auto mb-4" />
                  <h2 className="text-2xl text-[var(--foreground)] font-semibold mb-2">Relatórios</h2>
                  <p className="text-[var(--muted-foreground)] mb-6">Seção em desenvolvimento</p>
                  <button
                    onClick={() => navigate('/sumula')}
                    className="px-6 py-3 bg-[var(--primary)] hover:opacity-90 rounded-xl text-[var(--primary-foreground)] font-medium transition-all"
                  >
                    Abrir Súmula Digital (Tablet)
                  </button>
                </div>
              </div>
            </div>
          </main>
        } />

        {/* Súmula do jogo */}
        <Route path="/sumula" element={<FutsalMatchReport />} />
      </Routes>

      {/* Footer */}
      {location.pathname !== '/sumula' && <Footer />}
    </div>
  );
}