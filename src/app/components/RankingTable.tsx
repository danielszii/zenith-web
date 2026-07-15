import { Trophy, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface TeamStats {
  position: number;
  team: string;
  points: number;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  lastFive: ('W' | 'D' | 'L')[];
  zone?: 'promotion' | 'relegation';
}

const mockRanking: TeamStats[] = [
  {
    position: 1,
    team: 'FC Unidos',
    points: 45,
    played: 18,
    wins: 14,
    draws: 3,
    losses: 1,
    goalsFor: 38,
    goalsAgainst: 12,
    goalDifference: 26,
    lastFive: ['W', 'W', 'W', 'D', 'W'],
    zone: 'promotion',
  },
  {
    position: 2,
    team: 'Atlético Vila',
    points: 38,
    played: 18,
    wins: 11,
    draws: 5,
    losses: 2,
    goalsFor: 32,
    goalsAgainst: 15,
    goalDifference: 17,
    lastFive: ['W', 'D', 'W', 'W', 'D'],
    zone: 'promotion',
  },
  {
    position: 3,
    team: 'Estrela FC',
    points: 34,
    played: 18,
    wins: 10,
    draws: 4,
    losses: 4,
    goalsFor: 28,
    goalsAgainst: 18,
    goalDifference: 10,
    lastFive: ['W', 'L', 'W', 'D', 'W'],
  },
  {
    position: 4,
    team: 'União Sport',
    points: 30,
    played: 18,
    wins: 9,
    draws: 3,
    losses: 6,
    goalsFor: 25,
    goalsAgainst: 22,
    goalDifference: 3,
    lastFive: ['D', 'W', 'L', 'W', 'D'],
  },
  {
    position: 5,
    team: 'Bairro Novo',
    points: 22,
    played: 18,
    wins: 6,
    draws: 4,
    losses: 8,
    goalsFor: 20,
    goalsAgainst: 28,
    goalDifference: -8,
    lastFive: ['L', 'D', 'L', 'W', 'L'],
    zone: 'relegation',
  },
];

export function RankingTable() {
  const getResultBadge = (result: 'W' | 'D' | 'L') => {
    const config = {
      W: { bg: 'bg-[#4169E1]/20', border: 'border-[#4169E1]', text: 'text-[#4169E1]', label: 'V' },
      D: { bg: 'bg-[#FFD700]/20', border: 'border-[#FFD700]', text: 'text-[#FFD700]', label: 'E' },
      L: { bg: 'bg-[#DC143C]/20', border: 'border-[#DC143C]', text: 'text-[#DC143C]', label: 'D' },
    };

    const style = config[result];
    return (
      <div className={`w-6 h-6 rounded ${style.bg} border ${style.border} flex items-center justify-center`}>
        <span className={`text-xs font-bold ${style.text}`}>{style.label}</span>
      </div>
    );
  };

  const getPositionIndicator = (position: number, zone?: string) => {
    if (zone === 'promotion') {
      return <TrendingUp className="w-4 h-4 text-[#4169E1]" />;
    }
    if (zone === 'relegation') {
      return <TrendingDown className="w-4 h-4 text-[#DC143C]" />;
    }
    return <Minus className="w-4 h-4 text-gray-600" />;
  };

  return (
    <div className="bg-[#121212] rounded-lg border border-[#2A2A2A] overflow-hidden">
      <div className="p-5 border-b border-[#2A2A2A] bg-black/40">
        <div className="flex items-center gap-3">
          <Trophy className="w-5 h-5 text-[#4169E1]" />
          <h3 className="font-display text-lg text-white tracking-wider">CLASSIFICAÇÃO</h3>
          <span className="ml-auto text-xs text-gray-500 uppercase tracking-wide">Copa Regional 2026</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#2A2A2A] bg-black/60">
              <th className="px-4 py-3 text-left">
                <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">#</span>
              </th>
              <th className="px-4 py-3 text-left">
                <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Clube</span>
              </th>
              <th className="px-4 py-3 text-center">
                <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">P</span>
              </th>
              <th className="px-4 py-3 text-center">
                <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">J</span>
              </th>
              <th className="px-4 py-3 text-center">
                <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">V</span>
              </th>
              <th className="px-4 py-3 text-center">
                <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">E</span>
              </th>
              <th className="px-4 py-3 text-center">
                <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">D</span>
              </th>
              <th className="px-4 py-3 text-center">
                <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">GP</span>
              </th>
              <th className="px-4 py-3 text-center">
                <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">GC</span>
              </th>
              <th className="px-4 py-3 text-center">
                <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">SG</span>
              </th>
              <th className="px-4 py-3 text-center">
                <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Últimos 5</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {mockRanking.map((team) => (
              <tr
                key={team.position}
                className={`border-b border-[#2A2A2A] hover:bg-[#0A1128] transition-colors group relative ${
                  team.zone === 'promotion'
                    ? 'border-l-[6px] border-l-[#4169E1] shadow-[inset_6px_0_12px_-6px_rgba(65,105,225,0.3)]'
                    : team.zone === 'relegation'
                    ? 'border-l-[6px] border-l-[#DC143C] shadow-[inset_6px_0_12px_-6px_rgba(220,20,60,0.3)]'
                    : ''
                }`}
              >
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    {getPositionIndicator(team.position, team.zone)}
                    <span className="font-display text-lg text-white">{team.position}</span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className="font-semibold text-white uppercase tracking-wide text-sm">{team.team}</span>
                </td>
                <td className="px-4 py-4 text-center">
                  <span className="font-display text-lg text-[#4169E1]">{team.points}</span>
                </td>
                <td className="px-4 py-4 text-center">
                  <span className="text-sm text-gray-400">{team.played}</span>
                </td>
                <td className="px-4 py-4 text-center">
                  <span className="text-sm text-gray-400">{team.wins}</span>
                </td>
                <td className="px-4 py-4 text-center">
                  <span className="text-sm text-gray-400">{team.draws}</span>
                </td>
                <td className="px-4 py-4 text-center">
                  <span className="text-sm text-gray-400">{team.losses}</span>
                </td>
                <td className="px-4 py-4 text-center">
                  <span className="text-sm text-gray-400">{team.goalsFor}</span>
                </td>
                <td className="px-4 py-4 text-center">
                  <span className="text-sm text-gray-400">{team.goalsAgainst}</span>
                </td>
                <td className="px-4 py-4 text-center">
                  <span className={`text-sm font-semibold ${
                    team.goalDifference > 0 ? 'text-[#4169E1]' : team.goalDifference < 0 ? 'text-[#DC143C]' : 'text-gray-400'
                  }`}>
                    {team.goalDifference > 0 ? '+' : ''}{team.goalDifference}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center justify-center gap-1">
                    {team.lastFive.map((result, idx) => (
                      <div key={idx}>{getResultBadge(result)}</div>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 bg-black/40 border-t border-[#2A2A2A] flex items-center gap-6 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-[#4169E1] rounded"></div>
          <span className="text-gray-400 uppercase tracking-wide">Classificação</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-[#DC143C] rounded"></div>
          <span className="text-gray-400 uppercase tracking-wide">Rebaixamento</span>
        </div>
      </div>
    </div>
  );
}
