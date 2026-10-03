import { Target, Award } from 'lucide-react';

interface Scorer {
  id: string;
  name: string;
  club: string;
  goals: number;
  matches: number;
  rank: number;
}

const mockScorers: Scorer[] = [
  { id: '1', name: 'Roberto Silva', club: 'FC Unidos', goals: 18, matches: 16, rank: 1 },
  { id: '2', name: 'Marcelo Costa', club: 'Atlético Vila', goals: 15, matches: 18, rank: 2 },
  { id: '3', name: 'André Souza', club: 'Estrela FC', goals: 12, matches: 17, rank: 3 },
  { id: '4', name: 'Paulo Santos', club: 'União Sport', goals: 11, matches: 18, rank: 4 },
  { id: '5', name: 'Diego Lima', club: 'Bairro Novo', goals: 9, matches: 15, rank: 5 },
];

export function TopScorers() {
  const getMedalColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'from-[#FFD700] to-[#FFA500]';
      case 2:
        return 'from-[#C0C0C0] to-[#808080]';
      case 3:
        return 'from-[#CD7F32] to-[#8B4513]';
      default:
        return 'from-[#2A2A2A] to-[#1E1E1E]';
    }
  };

  return (
    <div className="bg-[#121212] rounded-lg border border-[#2A2A2A] overflow-hidden">
      <div className="p-5 border-b border-[#2A2A2A] bg-black/40">
        <div className="flex items-center gap-3">
          <Target className="w-5 h-5 text-[#4169E1]" />
          <h3 className="font-display text-lg text-white tracking-wider">ARTILHARIA</h3>
          <span className="ml-auto text-xs text-gray-500 uppercase tracking-wide">Top 5</span>
        </div>
      </div>

      <div className="divide-y divide-[#2A2A2A]">
        {mockScorers.map((scorer) => (
          <div key={scorer.id} className="p-4 hover:bg-[#1E1E1E] transition-colors group">
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${getMedalColor(scorer.rank)} flex items-center justify-center shadow-lg`}>
                {scorer.rank <= 3 ? (
                  <Award className="w-5 h-5 text-white" />
                ) : (
                  <span className="font-display text-lg text-white">{scorer.rank}</span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white uppercase tracking-wide text-sm truncate">
                  {scorer.name}
                </p>
                <p className="text-xs text-gray-400 mt-0.5 uppercase tracking-wide">{scorer.club}</p>
              </div>

              <div className="text-right">
                <div className="font-display text-2xl text-[#4169E1]">{scorer.goals}</div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">{scorer.matches} jogos</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-black/40 border-t border-[#2A2A2A]">
        <button className="w-full text-xs text-[#4169E1] hover:text-[#5B7FE8] font-bold uppercase tracking-wider">
          Ver Artilharia Completa
        </button>
      </div>
    </div>
  );
}
