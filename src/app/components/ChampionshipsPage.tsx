import { useState } from 'react';
import { Search, Trophy, MapPin, Calendar, Users, TrendingUp, Filter, X } from 'lucide-react';

interface Championship {
  id: string;
  name: string;
  region: string;
  sport: string;
  category: string;
  startDate: string;
  endDate: string;
  teams: number;
  status: 'Em andamento' | 'Próximo' | 'Finalizado';
  logo: string;
  featured: boolean;
}

const mockChampionships: Championship[] = [
  {
    id: '1',
    name: 'Campeonato Brasileiro Série A',
    region: 'Nacional',
    sport: 'Futebol',
    category: 'Profissional',
    startDate: '2026-04-10',
    endDate: '2026-12-05',
    teams: 20,
    status: 'Em andamento',
    logo: '🏆',
    featured: true,
  },
  {
    id: '2',
    name: 'Copa do Brasil',
    region: 'Nacional',
    sport: 'Futebol',
    category: 'Profissional',
    startDate: '2026-02-15',
    endDate: '2026-11-20',
    teams: 92,
    status: 'Em andamento',
    logo: '🏆',
    featured: true,
  },
  {
    id: '3',
    name: 'Superliga Feminina de Vôlei',
    region: 'Nacional',
    sport: 'Vôlei',
    category: 'Feminino',
    startDate: '2025-10-15',
    endDate: '2026-05-30',
    teams: 12,
    status: 'Em andamento',
    logo: '🏐',
    featured: true,
  },
  {
    id: '4',
    name: 'Campeonato Paulista',
    region: 'Sudeste',
    sport: 'Futebol',
    category: 'Profissional',
    startDate: '2026-01-20',
    endDate: '2026-05-15',
    teams: 16,
    status: 'Em andamento',
    logo: '⚽',
    featured: false,
  },
  {
    id: '5',
    name: 'NBB - Novo Basquete Brasil',
    region: 'Nacional',
    sport: 'Basquete',
    category: 'Profissional',
    startDate: '2025-11-01',
    endDate: '2026-06-20',
    teams: 18,
    status: 'Em andamento',
    logo: '🏀',
    featured: true,
  },
  {
    id: '6',
    name: 'Campeonato Carioca',
    region: 'Sudeste',
    sport: 'Futebol',
    category: 'Profissional',
    startDate: '2026-01-25',
    endDate: '2026-05-10',
    teams: 12,
    status: 'Em andamento',
    logo: '⚽',
    featured: false,
  },
  {
    id: '7',
    name: 'Liga Nacional de Futsal',
    region: 'Nacional',
    sport: 'Futsal',
    category: 'Profissional',
    startDate: '2026-03-01',
    endDate: '2026-10-25',
    teams: 24,
    status: 'Em andamento',
    logo: '⚽',
    featured: false,
  },
  {
    id: '8',
    name: 'Campeonato Gaúcho',
    region: 'Sul',
    sport: 'Futebol',
    category: 'Profissional',
    startDate: '2026-01-18',
    endDate: '2026-05-08',
    teams: 12,
    status: 'Em andamento',
    logo: '⚽',
    featured: false,
  },
  {
    id: '9',
    name: 'Superliga Masculina de Vôlei',
    region: 'Nacional',
    sport: 'Vôlei',
    category: 'Masculino',
    startDate: '2025-10-20',
    endDate: '2026-05-28',
    teams: 12,
    status: 'Em andamento',
    logo: '🏐',
    featured: false,
  },
  {
    id: '10',
    name: 'Copa do Nordeste',
    region: 'Nordeste',
    sport: 'Futebol',
    category: 'Profissional',
    startDate: '2026-01-21',
    endDate: '2026-05-12',
    teams: 16,
    status: 'Em andamento',
    logo: '🏆',
    featured: false,
  },
  {
    id: '11',
    name: 'Campeonato Sub-20',
    region: 'Nacional',
    sport: 'Futebol',
    category: 'Sub-20',
    startDate: '2026-06-01',
    endDate: '2026-08-30',
    teams: 32,
    status: 'Próximo',
    logo: '⚽',
    featured: false,
  },
  {
    id: '12',
    name: 'Liga das Américas de Basquete',
    region: 'Internacional',
    sport: 'Basquete',
    category: 'Profissional',
    startDate: '2026-02-10',
    endDate: '2026-06-15',
    teams: 12,
    status: 'Em andamento',
    logo: '🏀',
    featured: false,
  },
];

const regions = [
  { id: 'all', label: 'Todas as Regiões', icon: '🌎' },
  { id: 'Nacional', label: 'Nacional', icon: '🇧🇷' },
  { id: 'Internacional', label: 'Internacional', icon: '🌐' },
  { id: 'Nordeste', label: 'Nordeste', icon: '🌴' },
  { id: 'Sudeste', label: 'Sudeste', icon: '🏙️' },
  { id: 'Sul', label: 'Sul', icon: '❄️' },
  { id: 'Centro-Oeste', label: 'Centro-Oeste', icon: '🌾' },
  { id: 'Norte', label: 'Norte', icon: '🌳' },
];

const sports = [
  { id: 'all', label: 'Todos os Esportes' },
  { id: 'Futebol', label: 'Futebol' },
  { id: 'Futsal', label: 'Futsal' },
  { id: 'Vôlei', label: 'Vôlei' },
  { id: 'Basquete', label: 'Basquete' },
];

const statuses = [
  { id: 'all', label: 'Todos os Status' },
  { id: 'Em andamento', label: 'Em Andamento' },
  { id: 'Próximo', label: 'Próximos' },
  { id: 'Finalizado', label: 'Finalizados' },
];

export function ChampionshipsPage() {
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedSport, setSelectedSport] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const filteredChampionships = mockChampionships.filter((championship) => {
    const regionMatch = selectedRegion === 'all' || championship.region === selectedRegion;
    const sportMatch = selectedSport === 'all' || championship.sport === selectedSport;
    const statusMatch = selectedStatus === 'all' || championship.status === selectedStatus;
    const searchMatch =
      searchQuery === '' ||
      championship.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      championship.category.toLowerCase().includes(searchQuery.toLowerCase());

    return regionMatch && sportMatch && statusMatch && searchMatch;
  });

  const featuredChampionships = filteredChampionships.filter((c) => c.featured);
  const otherChampionships = filteredChampionships.filter((c) => !c.featured);

  const getStatusColor = (status: Championship['status']) => {
    switch (status) {
      case 'Em andamento':
        return 'bg-[var(--success)]/10 border-[var(--success)]/30 text-[var(--success)]';
      case 'Próximo':
        return 'bg-blue-500/10 border-blue-500/30 text-blue-500';
      case 'Finalizado':
        return 'bg-[var(--muted)] border-[var(--border)] text-[var(--muted-foreground)]';
    }
  };

  const activeFiltersCount = [
    selectedRegion !== 'all',
    selectedSport !== 'all',
    selectedStatus !== 'all',
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <main className="p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-semibold text-[var(--foreground)] mb-2">Campeonatos</h1>
            <p className="text-[var(--muted-foreground)]">
              Explore todos os campeonatos e competições disponíveis
            </p>
          </div>

          {/* Search and Filters Bar */}
          <div className="bg-[var(--surface-glass)] backdrop-blur-xl rounded-2xl border border-[var(--border)] p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--muted-foreground)]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar campeonatos..."
                    className="w-full pl-12 pr-4 py-3 bg-[var(--input-background)] border border-[var(--border)] rounded-xl text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Filter Toggle Button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                  showFilters || activeFiltersCount > 0
                    ? 'bg-[var(--primary)] text-[var(--primary-foreground)]'
                    : 'bg-[var(--muted)]/20 text-[var(--foreground)] hover:bg-[var(--muted)]/30'
                }`}
              >
                <Filter className="w-5 h-5" />
                <span>Filtros</span>
                {activeFiltersCount > 0 && (
                  <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs font-semibold">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
            </div>

            {/* Filters Panel */}
            {showFilters && (
              <div className="mt-6 pt-6 border-t border-[var(--border)] space-y-6">
                {/* Region Filter */}
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-3">
                    Região
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {regions.map((region) => (
                      <button
                        key={region.id}
                        onClick={() => setSelectedRegion(region.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          selectedRegion === region.id
                            ? 'bg-[var(--primary)] text-[var(--primary-foreground)]'
                            : 'bg-[var(--muted)]/20 text-[var(--foreground)] hover:bg-[var(--muted)]/30'
                        }`}
                      >
                        <span>{region.icon}</span>
                        <span>{region.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sport Filter */}
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-3">
                    Esporte
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {sports.map((sport) => (
                      <button
                        key={sport.id}
                        onClick={() => setSelectedSport(sport.id)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          selectedSport === sport.id
                            ? 'bg-[var(--primary)] text-[var(--primary-foreground)]'
                            : 'bg-[var(--muted)]/20 text-[var(--foreground)] hover:bg-[var(--muted)]/30'
                        }`}
                      >
                        {sport.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-3">
                    Status
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {statuses.map((status) => (
                      <button
                        key={status.id}
                        onClick={() => setSelectedStatus(status.id)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          selectedStatus === status.id
                            ? 'bg-[var(--primary)] text-[var(--primary-foreground)]'
                            : 'bg-[var(--muted)]/20 text-[var(--foreground)] hover:bg-[var(--muted)]/30'
                        }`}
                      >
                        {status.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Clear Filters */}
                {activeFiltersCount > 0 && (
                  <button
                    onClick={() => {
                      setSelectedRegion('all');
                      setSelectedSport('all');
                      setSelectedStatus('all');
                    }}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
                  >
                    <X className="w-4 h-4" />
                    <span>Limpar filtros</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-sm text-[var(--muted-foreground)]">
              {filteredChampionships.length} campeonato(s) encontrado(s)
            </p>
          </div>

          {/* Featured Championships */}
          {featuredChampionships.length > 0 && (
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-2xl font-semibold text-[var(--foreground)]">Em Destaque</h2>
                <div className="h-px flex-1 bg-[var(--border)]"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredChampionships.map((championship) => (
                  <div
                    key={championship.id}
                    className="bg-[var(--surface-glass)] backdrop-blur-xl rounded-2xl border border-[var(--border)] overflow-hidden hover:border-[var(--primary)]/50 transition-all cursor-pointer group"
                  >
                    {/* Header with Logo */}
                    <div className="bg-gradient-to-br from-[var(--primary)]/20 to-[var(--accent)]/20 p-8 text-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-[var(--primary)]/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <div className="relative text-6xl mb-2">{championship.logo}</div>
                      <div
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-semibold border ${getStatusColor(
                          championship.status
                        )}`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                        {championship.status}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="font-semibold text-lg text-[var(--foreground)] mb-3 line-clamp-2">
                        {championship.name}
                      </h3>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
                          <MapPin className="w-4 h-4" />
                          <span>{championship.region}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
                          <Trophy className="w-4 h-4" />
                          <span>{championship.sport} · {championship.category}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
                          <Users className="w-4 h-4" />
                          <span>{championship.teams} equipes</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {new Date(championship.startDate).toLocaleDateString('pt-BR')} -{' '}
                            {new Date(championship.endDate).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                      </div>

                      <button className="w-full px-4 py-2.5 bg-[var(--primary)] hover:opacity-90 rounded-xl text-[var(--primary-foreground)] font-medium transition-all">
                        Ver Detalhes
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Other Championships */}
          {otherChampionships.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-2xl font-semibold text-[var(--foreground)]">
                  Todos os Campeonatos
                </h2>
                <div className="h-px flex-1 bg-[var(--border)]"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {otherChampionships.map((championship) => (
                  <div
                    key={championship.id}
                    className="bg-[var(--surface-glass)] backdrop-blur-xl rounded-2xl border border-[var(--border)] overflow-hidden hover:border-[var(--primary)]/50 transition-all cursor-pointer group"
                  >
                    {/* Header with Logo */}
                    <div className="bg-[var(--muted)]/20 p-6 text-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-[var(--primary)]/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <div className="relative text-4xl mb-2">{championship.logo}</div>
                      <div
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-semibold border ${getStatusColor(
                          championship.status
                        )}`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                        {championship.status}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="font-semibold text-[var(--foreground)] mb-3 line-clamp-2">
                        {championship.name}
                      </h3>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
                          <MapPin className="w-4 h-4" />
                          <span>{championship.region}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
                          <Trophy className="w-4 h-4" />
                          <span>{championship.sport} · {championship.category}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
                          <Users className="w-4 h-4" />
                          <span>{championship.teams} equipes</span>
                        </div>
                      </div>

                      <button className="w-full px-4 py-2.5 bg-[var(--muted)]/20 hover:bg-[var(--muted)]/30 rounded-xl text-[var(--foreground)] font-medium transition-all">
                        Ver Detalhes
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {filteredChampionships.length === 0 && (
            <div className="bg-[var(--surface-glass)] backdrop-blur-xl rounded-2xl border border-[var(--border)] p-20 text-center">
              <Trophy className="w-16 h-16 text-[var(--muted-foreground)] mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold text-[var(--foreground)] mb-2">
                Nenhum campeonato encontrado
              </h3>
              <p className="text-[var(--muted-foreground)] mb-6">
                Tente ajustar os filtros ou fazer uma nova busca
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedRegion('all');
                  setSelectedSport('all');
                  setSelectedStatus('all');
                }}
                className="px-6 py-3 bg-[var(--primary)] hover:opacity-90 rounded-xl text-[var(--primary-foreground)] font-medium transition-all"
              >
                Limpar filtros
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
