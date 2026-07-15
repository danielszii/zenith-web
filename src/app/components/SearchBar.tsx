import { Search, Users, Trophy, Calendar, Hash } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface SearchResult {
  id: string;
  type: 'club' | 'player' | 'championship' | 'match';
  title: string;
  subtitle: string;
  category?: string;
}

const mockResults: SearchResult[] = [
  // Clubes
  { id: '1', type: 'club', title: 'Real Madrid', subtitle: 'Espanha', category: 'Internacional' },
  { id: '2', type: 'club', title: 'Real Sociedad', subtitle: 'Espanha', category: 'Internacional' },
  { id: '3', type: 'club', title: 'Real Betis', subtitle: 'Espanha', category: 'Internacional' },
  { id: '4', type: 'club', title: 'Cruzeiro FC', subtitle: 'Brasil', category: 'Nacional' },
  { id: '5', type: 'club', title: 'Flamengo RJ', subtitle: 'Brasil', category: 'Nacional' },
  { id: '6', type: 'club', title: 'Palmeiras SP', subtitle: 'Brasil', category: 'Nacional' },

  // Jogadores
  { id: '7', type: 'player', title: 'Gabriel Silva', subtitle: 'Cruzeiro FC', category: 'Atacante' },
  { id: '8', type: 'player', title: 'Lucas Martins', subtitle: 'São Paulo SC', category: 'Meio-campo' },
  { id: '9', type: 'player', title: 'Pedro Costa', subtitle: 'Flamengo RJ', category: 'Atacante' },
  { id: '10', type: 'player', title: 'Rafael Santos', subtitle: 'Palmeiras SP', category: 'Goleiro' },

  // Campeonatos
  { id: '11', type: 'championship', title: 'Superliga Feminina', subtitle: 'Competição Nacional', category: 'Feminino' },
  { id: '12', type: 'championship', title: 'Superliga Masculina', subtitle: 'Competição Nacional', category: 'Masculino' },
  { id: '13', type: 'championship', title: 'Copa Brasil', subtitle: 'Competição Nacional', category: 'Copa' },
  { id: '14', type: 'championship', title: 'SuperLiga Master', subtitle: 'Categoria Master', category: 'Master' },

  // Partidas
  { id: '15', type: 'match', title: 'Cruzeiro vs Flamengo', subtitle: '15/05 - 10:00', category: 'Ao vivo' },
  { id: '16', type: 'match', title: 'Palmeiras vs São Paulo', subtitle: '16/05 - 14:30', category: 'Agendada' },
];

interface SearchBarProps {
  onNavigate?: (page: 'dashboard' | 'championships' | 'matches' | 'players' | 'gallery' | 'reports' | 'club') => void;
}

export function SearchBar({ onNavigate }: SearchBarProps) {
  const [searchValue, setSearchValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const filteredResults = searchValue.trim()
    ? mockResults.filter((result) =>
        result.title.toLowerCase().includes(searchValue.toLowerCase()) ||
        result.subtitle.toLowerCase().includes(searchValue.toLowerCase())
      )
    : [];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setShowResults(isFocused && (searchValue.trim().length > 0 || isFocused));
  }, [searchValue, isFocused]);

  const getIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'club':
        return Trophy;
      case 'player':
        return Users;
      case 'championship':
        return Hash;
      case 'match':
        return Calendar;
    }
  };

  const getTypeLabel = (type: SearchResult['type']) => {
    switch (type) {
      case 'club':
        return 'Clube';
      case 'player':
        return 'Atleta';
      case 'championship':
        return 'Campeonato';
      case 'match':
        return 'Partida';
    }
  };

  return (
    <div className="relative" ref={searchRef}>
      <div
        className={`flex items-center gap-3 bg-[var(--surface-glass)] backdrop-blur-xl border rounded-xl px-4 py-2.5 transition-all duration-200 ${
          isFocused ? 'border-[var(--muted)] bg-[var(--surface-glass-hover)]' : 'border-[var(--border)]'
        }`}
      >
        <Search className={`w-4 h-4 transition-colors ${isFocused ? 'text-[var(--foreground)]' : 'text-[var(--muted-foreground)]'}`} />
        <input
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder="Pesquisar clubes, jogadores e campeonatos..."
          className="flex-1 bg-transparent text-[var(--foreground)] placeholder-[var(--muted-foreground)] outline-none text-sm"
        />
        {searchValue && (
          <button
            onClick={() => {
              setSearchValue('');
              setShowResults(false);
            }}
            className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors text-xs font-medium"
          >
            Limpar
          </button>
        )}
      </div>

      {/* Search Results Popup */}
      {showResults && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[var(--background)] backdrop-blur-xl border border-[var(--border)] rounded-2xl shadow-2xl overflow-hidden z-50 max-h-[500px] overflow-y-auto">
          {filteredResults.length > 0 ? (
            <div className="p-2">
              {/* Group by type */}
              {['club', 'player', 'championship', 'match'].map((type) => {
                const typeResults = filteredResults.filter((r) => r.type === type);
                if (typeResults.length === 0) return null;

                return (
                  <div key={type} className="mb-2 last:mb-0">
                    <div className="px-3 py-2">
                      <span className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">
                        {getTypeLabel(type as SearchResult['type'])}s
                      </span>
                    </div>
                    <div className="space-y-1">
                      {typeResults.map((result) => {
                        const Icon = getIcon(result.type);
                        return (
                          <button
                            key={result.id}
                            onClick={() => {
                              setSearchValue('');
                              setShowResults(false);
                              if (onNavigate) {
                                if (result.type === 'club') {
                                  onNavigate('club');
                                } else if (result.type === 'player') {
                                  onNavigate('players');
                                } else if (result.type === 'championship') {
                                  onNavigate('championships');
                                }
                              }
                            }}
                            className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-[var(--surface-glass-hover)] rounded-xl transition-all group"
                          >
                            <div className="w-10 h-10 bg-[var(--muted)] rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-[var(--primary)] transition-colors">
                              <Icon className="w-5 h-5 text-[var(--muted-foreground)] group-hover:text-[var(--primary-foreground)] transition-colors" />
                            </div>
                            <div className="flex-1 text-left min-w-0">
                              <h4 className="text-sm font-semibold text-[var(--foreground)] truncate">
                                {result.title}
                              </h4>
                              <p className="text-xs text-[var(--muted-foreground)] truncate">
                                {result.subtitle}
                              </p>
                            </div>
                            {result.category && (
                              <span className="px-2 py-1 bg-[var(--surface-glass)] border border-[var(--border)] rounded-lg text-xs text-[var(--muted-foreground)] font-medium">
                                {result.category}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : searchValue.trim() ? (
            <div className="p-12 text-center">
              <Search className="w-12 h-12 text-[var(--muted-foreground)] mx-auto mb-3 opacity-50" />
              <p className="text-sm text-[var(--muted-foreground)] mb-1">Nenhum resultado encontrado</p>
              <p className="text-xs text-[var(--muted-foreground)]">
                Tente buscar por outro termo
              </p>
            </div>
          ) : (
            <div className="p-6">
              <div className="mb-4">
                <h4 className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-3">
                  Buscas Recentes
                </h4>
                <div className="space-y-1">
                  {['Real Madrid', 'Gabriel Silva', 'Superliga'].map((term) => (
                    <button
                      key={term}
                      onClick={() => setSearchValue(term)}
                      className="w-full flex items-center gap-3 px-3 py-2 hover:bg-[var(--surface-glass-hover)] rounded-xl transition-all text-left"
                    >
                      <Search className="w-4 h-4 text-[var(--muted-foreground)]" />
                      <span className="text-sm text-[var(--foreground)]">{term}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="pt-4 border-t border-[var(--border)]">
                <h4 className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-3">
                  Sugestões
                </h4>
                <div className="flex flex-wrap gap-2">
                  {['Clubes', 'Jogadores', 'Campeonatos', 'Partidas'].map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setSearchValue(tag.toLowerCase())}
                      className="px-3 py-1.5 bg-[var(--surface-glass)] hover:bg-[var(--surface-glass-hover)] border border-[var(--border)] rounded-lg text-xs font-medium text-[var(--foreground)] transition-all"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
