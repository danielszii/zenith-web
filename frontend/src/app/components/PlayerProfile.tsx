import { Trophy, TrendingUp, Target, Activity, ArrowRightLeft, Building2 } from 'lucide-react';

export function PlayerProfile() {
  const recentMatches = [
    { date: '04/05', home: 'CRZ', homeScore: 3, away: 'FLA', awayScore: 1 },
    { date: '28/04', home: 'FLU', homeScore: 2, away: 'CRZ', awayScore: 3 },
    { date: '21/04', home: 'CRZ', homeScore: 0, away: 'BOT', awayScore: 1 },
    { date: '14/04', home: 'SFC', homeScore: 1, away: 'CRZ', awayScore: 2 },
    { date: '07/04', home: 'LEC', homeScore: 0, away: 'CRZ', awayScore: 1 },
    { date: '31/03', home: 'SCP', homeScore: 1, away: 'CRZ', awayScore: 1 },
    { date: '24/03', home: 'VYS', homeScore: 1, away: 'CRZ', awayScore: 3 },
    { date: '17/03', home: 'CRZ', homeScore: 2, away: 'INT', awayScore: 0 },
    { date: '10/03', home: 'CRZ', homeScore: 1, away: 'CAC', awayScore: 2 },
  ];

  const stats = [
    { label: 'Gols dentro', value: '0' },
    { label: 'Gols durante jogo', value: '0' },
    { label: 'Total de chutes', value: '0' },
    { label: 'Chutes a gol', value: '0' },
    { label: 'Chutes na trave', value: '1' },
    { label: 'Assistências', value: '0' },
  ];

  const transferHistory = [
    {
      date: 'Jan 2025',
      from: 'Palmeiras SP',
      to: 'CRZ FC',
      type: 'Transferência',
      value: 'R$ 2.5M',
      contractYears: 3
    },
    {
      date: 'Jul 2023',
      from: 'Santos FC',
      to: 'Palmeiras SP',
      type: 'Transferência',
      value: 'R$ 1.8M',
      contractYears: 2
    },
    {
      date: 'Jan 2022',
      from: 'Juventus SC',
      to: 'Santos FC',
      type: 'Transferência',
      value: 'R$ 800K',
      contractYears: 2
    },
    {
      date: 'Mar 2020',
      from: 'Base CRZ',
      to: 'Juventus SC',
      type: 'Primeira Contratação',
      value: 'Formação',
      contractYears: 2
    },
  ];

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">

        {/* Header Section */}
        <div className="bg-[var(--surface-glass)] backdrop-blur-xl rounded-2xl border border-[var(--border)] p-8 mb-6">
          <div className="flex gap-8">
            {/* Player Photo */}
            <div className="relative">
              <div className="w-48 h-64 bg-[var(--muted)] rounded-2xl border border-[var(--border)] overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Activity className="w-20 h-20 text-[var(--muted-foreground)]" />
                </div>
              </div>
            </div>

            {/* Player Info */}
            <div className="flex-1">
              <div className="mb-6">
                <h1 className="text-4xl text-[var(--foreground)] font-semibold mb-2">
                  Thiago "TH" Brito
                </h1>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-[var(--primary)] font-semibold">CRZ FC</span>
                  <span className="text-[var(--muted-foreground)]">•</span>
                  <span className="text-[var(--foreground)]">Atacante</span>
                  <span className="text-[var(--muted-foreground)]">•</span>
                  <span className="text-[var(--foreground)]">23 anos</span>
                  <span className="text-[var(--muted-foreground)]">•</span>
                  <span className="text-[var(--foreground)]">Brasil</span>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-6 gap-4">
                <div className="bg-[var(--muted)] rounded-xl p-4 border border-[var(--border)]">
                  <div className="text-xs text-[var(--muted-foreground)] mb-1 font-medium">Altura</div>
                  <div className="text-xl font-semibold text-[var(--foreground)]">1.82</div>
                </div>
                <div className="bg-[var(--muted)] rounded-xl p-4 border border-[var(--border)]">
                  <div className="text-xs text-[var(--muted-foreground)] mb-1 font-medium">Peso</div>
                  <div className="text-xl font-semibold text-[var(--foreground)]">78kg</div>
                </div>
                <div className="bg-[var(--muted)] rounded-xl p-4 border border-[var(--border)]">
                  <div className="text-xs text-[var(--muted-foreground)] mb-1 font-medium">Pé</div>
                  <div className="text-xl font-semibold text-[var(--foreground)]">Direito</div>
                </div>
                <div className="bg-[var(--muted)] rounded-xl p-4 border border-[var(--border)]">
                  <div className="text-xs text-[var(--muted-foreground)] mb-1 font-medium">Camisa</div>
                  <div className="text-xl font-semibold text-[var(--foreground)]">10</div>
                </div>
                <div className="bg-[var(--muted)] rounded-xl p-4 border border-[var(--border)]">
                  <div className="text-xs text-[var(--muted-foreground)] mb-1 font-medium">Títulos</div>
                  <div className="text-xl font-semibold text-[var(--foreground)]">3</div>
                </div>
                <div className="bg-[var(--muted)] rounded-xl p-4 border border-[var(--border)]">
                  <div className="text-xs text-[var(--muted-foreground)] mb-1 font-medium">Jogos</div>
                  <div className="text-xl font-semibold text-[var(--foreground)]">127</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Matches */}
          <div className="lg:col-span-2">
            <div className="bg-[var(--surface-glass)] backdrop-blur-xl rounded-2xl border border-[var(--border)] p-6">
              <div className="flex items-center gap-3 mb-6">
                <Activity className="w-5 h-5 text-[var(--primary)]" />
                <h2 className="text-xl text-[var(--foreground)] font-semibold">Últimos Jogos</h2>
              </div>

              <div className="space-y-3">
                {recentMatches.map((match, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-[var(--surface-glass)] rounded-xl p-4 border border-[var(--border)] hover:border-[var(--muted)] hover:bg-[var(--surface-glass-hover)] transition-all"
                  >
                    <div className="text-xs text-[var(--muted-foreground)] w-16 font-medium">{match.date}</div>
                    <div className="flex items-center gap-4 flex-1">
                      <div className="text-sm font-semibold text-[var(--foreground)] w-12 text-right">{match.home}</div>
                      <div className="flex items-center gap-3 bg-[var(--muted)] px-4 py-2 rounded-lg border border-[var(--border)]">
                        <span className="text-lg font-semibold text-[var(--foreground)] w-6 text-center">{match.homeScore}</span>
                        <span className="text-[var(--muted-foreground)]">-</span>
                        <span className="text-lg font-semibold text-[var(--foreground)] w-6 text-center">{match.awayScore}</span>
                      </div>
                      <div className="text-sm font-semibold text-[var(--foreground)] w-12">{match.away}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Stats */}
            <div className="bg-[var(--surface-glass)] backdrop-blur-xl rounded-2xl border border-[var(--border)] p-6 mt-6">
              <div className="flex items-center gap-3 mb-6">
                <Target className="w-5 h-5 text-[var(--primary)]" />
                <h2 className="text-xl text-[var(--foreground)] font-semibold">Estatísticas Detalhadas</h2>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-[var(--surface-glass)] rounded-xl p-4 border border-[var(--border)]"
                  >
                    <span className="text-sm text-[var(--foreground)] font-medium">{stat.label}</span>
                    <span className="text-2xl font-semibold text-[var(--foreground)]">{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Transfer History */}
            <div className="bg-[var(--surface-glass)] backdrop-blur-xl rounded-2xl border border-[var(--border)] p-6 mt-6">
              <div className="flex items-center gap-3 mb-6">
                <ArrowRightLeft className="w-5 h-5 text-[var(--primary)]" />
                <h2 className="text-xl text-[var(--foreground)] font-semibold">Histórico de Transferências</h2>
              </div>

              <div className="space-y-4">
                {transferHistory.map((transfer, index) => (
                  <div
                    key={index}
                    className="relative bg-[var(--surface-glass)] rounded-xl p-4 border border-[var(--border)] hover:border-[var(--muted)] hover:bg-[var(--surface-glass-hover)] transition-all"
                  >
                    {/* Timeline Connector */}
                    {index < transferHistory.length - 1 && (
                      <div className="absolute left-8 top-full w-0.5 h-4 bg-[var(--border)]"></div>
                    )}

                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className="w-8 h-8 bg-[var(--primary)]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Building2 className="w-4 h-4 text-[var(--primary)]" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-semibold text-[var(--muted-foreground)] uppercase">
                            {transfer.date}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded ${
                            transfer.type === 'Primeira Contratação'
                              ? 'bg-blue-500/10 text-blue-500'
                              : 'bg-[var(--success)]/10 text-[var(--success)]'
                          }`}>
                            {transfer.type}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-medium text-[var(--foreground)] truncate">
                            {transfer.from}
                          </span>
                          <ArrowRightLeft className="w-3 h-3 text-[var(--muted-foreground)] flex-shrink-0" />
                          <span className="text-sm font-medium text-[var(--primary)] truncate">
                            {transfer.to}
                          </span>
                        </div>

                        <div className="flex items-center gap-4 text-xs text-[var(--muted-foreground)]">
                          <span className="font-semibold">{transfer.value}</span>
                          <span>•</span>
                          <span>{transfer.contractYears} anos de contrato</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* MVP Stats */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-[var(--muted)] rounded-2xl border border-[var(--border)] p-6">
              <div className="flex items-center gap-3 mb-6">
                <Trophy className="w-6 h-6 text-[var(--foreground)]" />
                <h2 className="text-xl text-[var(--foreground)] font-semibold">MVP</h2>
              </div>

              <div className="space-y-4">
                <div className="bg-[var(--surface-glass)] rounded-xl p-4 border border-[var(--border)]">
                  <div className="text-xs text-[var(--muted-foreground)] mb-2 font-medium">MVP Jogos</div>
                  <div className="text-4xl font-semibold text-[var(--foreground)]">0</div>
                </div>

                <div className="bg-[var(--surface-glass)] rounded-xl p-4 border border-[var(--border)]">
                  <div className="text-xs text-[var(--muted-foreground)] mb-2 font-medium">MVP Rodadas</div>
                  <div className="text-4xl font-semibold text-[var(--foreground)]">0</div>
                </div>
              </div>
            </div>

            <div className="bg-[var(--surface-glass)] backdrop-blur-xl rounded-2xl border border-[var(--border)] p-6">
              <div className="flex items-center gap-3 mb-6">
                <TrendingUp className="w-5 h-5 text-[var(--success)]" />
                <h2 className="text-xl text-[var(--foreground)] font-semibold">Performance</h2>
              </div>

              <div className="space-y-4">
                <div className="bg-[var(--muted)] rounded-xl p-4 border border-[var(--border)]">
                  <div className="text-xs text-[var(--muted-foreground)] mb-2 font-medium">Gols</div>
                  <div className="text-3xl font-semibold text-[var(--foreground)]">15</div>
                </div>

                <div className="bg-[var(--muted)] rounded-xl p-4 border border-[var(--border)]">
                  <div className="text-xs text-[var(--muted-foreground)] mb-2 font-medium">Assistências</div>
                  <div className="text-3xl font-semibold text-[var(--foreground)]">8</div>
                </div>

                <div className="bg-[var(--muted)] rounded-xl p-4 border border-[var(--border)]">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-xs text-[var(--muted-foreground)] font-medium">Cartões</div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-6 bg-yellow-500 rounded"></div>
                      <span className="text-xl font-semibold text-[var(--foreground)]">3</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-6 bg-red-500 rounded"></div>
                      <span className="text-xl font-semibold text-[var(--foreground)]">0</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
