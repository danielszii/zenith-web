import { useState } from 'react';
import { TrendingUp, Trophy } from 'lucide-react';

interface Scorer {
  id: string;
  name: string;
  team: string;
  goals: number;
  matches: number;
  position: number;
  trend: 'up' | 'down' | 'same';
}

const scorersByCategory: Record<string, Scorer[]> = {
  profissional: [
    { id: '1', name: 'Gabriel Silva', team: 'Cruzeiro FC', goals: 28, matches: 24, position: 1, trend: 'up' },
    { id: '2', name: 'Lucas Martins', team: 'São Paulo SC', goals: 25, matches: 23, position: 2, trend: 'same' },
    { id: '3', name: 'Pedro Costa', team: 'Flamengo RJ', goals: 23, matches: 24, position: 3, trend: 'up' },
    { id: '4', name: 'Rafael Santos', team: 'Palmeiras SP', goals: 21, matches: 22, position: 4, trend: 'down' },
    { id: '5', name: 'Felipe Rocha', team: 'Atlético MG', goals: 19, matches: 24, position: 5, trend: 'same' },
  ],
  sub21: [
    { id: '1', name: 'João Mendes', team: 'Santos FC', goals: 22, matches: 20, position: 1, trend: 'up' },
    { id: '2', name: 'Matheus Lima', team: 'Corinthians', goals: 19, matches: 19, position: 2, trend: 'up' },
    { id: '3', name: 'Daniel Oliveira', team: 'Vasco RJ', goals: 17, matches: 20, position: 3, trend: 'same' },
    { id: '4', name: 'André Ferreira', team: 'Botafogo RJ', goals: 15, matches: 18, position: 4, trend: 'down' },
    { id: '5', name: 'Bruno Alves', team: 'Grêmio RS', goals: 14, matches: 20, position: 5, trend: 'up' },
  ],
  sub19: [
    { id: '1', name: 'Gustavo Dias', team: 'Internacional', goals: 18, matches: 17, position: 1, trend: 'up' },
    { id: '2', name: 'Thiago Sousa', team: 'Fluminense RJ', goals: 16, matches: 18, position: 2, trend: 'same' },
    { id: '3', name: 'Ricardo Nunes', team: 'Athletico PR', goals: 15, matches: 17, position: 3, trend: 'up' },
    { id: '4', name: 'Vinícius Jr', team: 'Bahia BA', goals: 13, matches: 16, position: 4, trend: 'up' },
    { id: '5', name: 'Carlos Eduardo', team: 'Ceará CE', goals: 12, matches: 18, position: 5, trend: 'down' },
  ],
  sub17: [
    { id: '1', name: 'Miguel Ângelo', team: 'São Paulo SC', goals: 15, matches: 15, position: 1, trend: 'up' },
    { id: '2', name: 'Pablo Santos', team: 'Palmeiras SP', goals: 14, matches: 14, position: 2, trend: 'up' },
    { id: '3', name: 'Arthur Cabral', team: 'Cruzeiro FC', goals: 12, matches: 15, position: 3, trend: 'same' },
    { id: '4', name: 'Igor Silva', team: 'Flamengo RJ', goals: 11, matches: 13, position: 4, trend: 'up' },
    { id: '5', name: 'Kaio Jorge', team: 'Santos FC', goals: 10, matches: 15, position: 5, trend: 'down' },
  ],
};

export function TrendingScorers() {
  const [activeCategory, setActiveCategory] = useState('profissional');

  const categories = [
    { id: 'profissional', label: 'Profissional' },
    { id: 'sub21', label: 'Sub-21' },
    { id: 'sub19', label: 'Sub-19' },
    { id: 'sub17', label: 'Sub-17' },
  ];

  const scorers = scorersByCategory[activeCategory] || [];

  const getTrendIcon = (trend: Scorer['trend']) => {
    if (trend === 'up') return '↑';
    if (trend === 'down') return '↓';
    return '•';
  };

  const getTrendColor = (trend: Scorer['trend']) => {
    if (trend === 'up') return 'text-[var(--success)]';
    if (trend === 'down') return 'text-[var(--destructive)]';
    return 'text-[var(--muted-foreground)]';
  };

  return (
    <div className="bg-[var(--surface-glass)] backdrop-blur-xl rounded-2xl border border-[var(--border)] p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-[var(--primary)]/10 border border-[var(--primary)]/30 rounded-lg">
          <TrendingUp className="w-4 h-4 text-[var(--primary)]" />
          <span className="text-xs font-semibold text-[var(--primary)] uppercase tracking-wider">
            Em Alta
          </span>
        </div>
        <h2 className="text-xl text-[var(--foreground)] font-semibold">Artilheiros</h2>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              activeCategory === category.id
                ? 'bg-[var(--muted)] text-[var(--foreground)]'
                : 'bg-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--surface-glass-hover)]'
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Scorers List */}
      <div className="space-y-3">
        {scorers.map((scorer, index) => (
          <div
            key={scorer.id}
            className="flex items-center gap-4 p-4 bg-[var(--surface-glass)] hover:bg-[var(--surface-glass-hover)] border border-[var(--border)] rounded-xl transition-all group"
          >
            {/* Position */}
            <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
              {index < 3 ? (
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                    index === 0
                      ? 'bg-[var(--primary)] text-[var(--primary-foreground)]'
                      : index === 1
                      ? 'bg-[var(--muted)] text-[var(--foreground)]'
                      : 'bg-[var(--muted)] text-[var(--muted-foreground)]'
                  }`}
                >
                  {scorer.position}
                </div>
              ) : (
                <span className="text-[var(--muted-foreground)] font-semibold text-sm">
                  {scorer.position}
                </span>
              )}
            </div>

            {/* Player Avatar */}
            <div className="w-10 h-10 rounded-lg bg-[var(--muted)] flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-semibold text-[var(--foreground)]">
                {scorer.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </span>
            </div>

            {/* Player Info */}
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-[var(--foreground)] truncate group-hover:text-[var(--primary)] transition-colors">
                {scorer.name}
              </h4>
              <p className="text-xs text-[var(--muted-foreground)] truncate">{scorer.team}</p>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="flex items-center gap-1">
                  <Trophy className="w-3.5 h-3.5 text-[var(--muted-foreground)]" />
                  <span className="text-lg font-bold text-[var(--foreground)]">{scorer.goals}</span>
                </div>
                <p className="text-xs text-[var(--muted-foreground)]">{scorer.matches} jogos</p>
              </div>

              {/* Trend */}
              <div className={`text-xl font-bold ${getTrendColor(scorer.trend)}`}>
                {getTrendIcon(scorer.trend)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Stats */}
      <div className="mt-6 pt-6 border-t border-[var(--border)] grid grid-cols-3 gap-4">
        <div className="text-center">
          <p className="text-xs text-[var(--muted-foreground)] mb-1">Total de Gols</p>
          <p className="text-xl font-bold text-[var(--foreground)]">
            {scorers.reduce((acc, scorer) => acc + scorer.goals, 0)}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-[var(--muted-foreground)] mb-1">Média/Jogo</p>
          <p className="text-xl font-bold text-[var(--foreground)]">
            {(scorers.reduce((acc, scorer) => acc + scorer.goals, 0) /
              scorers.reduce((acc, scorer) => acc + scorer.matches, 0)).toFixed(2)}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-[var(--muted-foreground)] mb-1">Artilheiro</p>
          <p className="text-xl font-bold text-[var(--foreground)]">
            {scorers[0]?.goals || 0}
          </p>
        </div>
      </div>
    </div>
  );
}
