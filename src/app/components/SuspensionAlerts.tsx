import { AlertTriangle, XCircle, Ban } from 'lucide-react';

interface SuspendedPlayer {
  id: string;
  name: string;
  club: string;
  reason: string;
  gamesRemaining: number;
  type: 'cards' | 'disciplinary';
}

const mockSuspensions: SuspendedPlayer[] = [
  {
    id: '1',
    name: 'Carlos Alberto',
    club: 'FC Unidos',
    reason: '3º Cartão Amarelo',
    gamesRemaining: 1,
    type: 'cards',
  },
  {
    id: '2',
    name: 'João Pedro',
    club: 'Atlético Vila',
    reason: 'Cartão Vermelho',
    gamesRemaining: 2,
    type: 'disciplinary',
  },
  {
    id: '3',
    name: 'Gabriel Silva',
    club: 'Estrela FC',
    reason: 'Acúmulo de Cartões',
    gamesRemaining: 1,
    type: 'cards',
  },
];

export function SuspensionAlerts() {
  return (
    <div className="bg-[#121212] rounded-lg border border-[#2A2A2A] overflow-hidden">
      <div className="p-5 border-b border-[#2A2A2A] bg-[#DC143C]/10">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-[#DC143C]" />
          <h3 className="font-display text-lg text-white tracking-wider flex-1">SUSPENSÕES</h3>
          <span className="bg-[#DC143C]/20 border border-[#DC143C] text-[#DC143C] px-3 py-1 rounded text-xs font-bold uppercase tracking-wider">
            {mockSuspensions.length} ATLETAS
          </span>
        </div>
      </div>

      <div className="divide-y divide-[#2A2A2A]">
        {mockSuspensions.map((player) => (
          <div key={player.id} className="p-4 hover:bg-[#1E1E1E] transition-colors group">
            <div className="flex items-start gap-3">
              <div className={`w-11 h-11 rounded-lg flex items-center justify-center border-2 animate-pulse ${
                player.type === 'disciplinary'
                  ? 'bg-[#DC143C]/20 border-[#DC143C]'
                  : 'bg-[#FFD700]/20 border-[#FFD700]'
              }`}>
                {player.type === 'disciplinary' ? (
                  <Ban className="w-6 h-6 text-[#DC143C]" />
                ) : (
                  <XCircle className="w-6 h-6 text-[#FFD700]" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white truncate uppercase text-sm tracking-wide">{player.name}</p>
                <p className="text-xs text-gray-400 mt-1 uppercase tracking-wide">{player.club}</p>
                <p className="text-xs text-gray-500 mt-1.5 uppercase tracking-wide">{player.reason}</p>
              </div>

              <div className="text-right">
                <span className="inline-block px-3 py-1.5 bg-black/60 border border-[#2A2A2A] text-white rounded text-xs font-bold uppercase tracking-wider">
                  {player.gamesRemaining} {player.gamesRemaining === 1 ? 'JOGO' : 'JOGOS'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-black/40 border-t border-[#2A2A2A]">
        <button className="w-full text-xs text-[#DC143C] hover:text-[#FF5555] font-bold uppercase tracking-wider">
          Ver Todos os Suspensos
        </button>
      </div>
    </div>
  );
}
