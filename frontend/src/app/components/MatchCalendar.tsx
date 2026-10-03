import { Calendar, MapPin, Clock, Zap } from 'lucide-react';

interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  date: string;
  time: string;
  venue: string;
  competition: string;
  status: 'scheduled' | 'live' | 'completed';
}

const mockMatches: Match[] = [
  {
    id: '1',
    homeTeam: 'FC Unidos',
    awayTeam: 'Atlético Vila',
    date: '04 MAI',
    time: '16:00',
    venue: 'Campo do Parque',
    competition: 'Copa Regional',
    status: 'live',
  },
  {
    id: '2',
    homeTeam: 'Estrela FC',
    awayTeam: 'União Sport',
    date: '04 MAI',
    time: '18:30',
    venue: 'Várzea Central',
    competition: 'Campeonato Amador',
    status: 'scheduled',
  },
  {
    id: '3',
    homeTeam: 'Bairro Novo',
    awayTeam: 'Real da Vila',
    date: '05 MAI',
    time: '16:00',
    venue: 'Arena Comunitária',
    competition: 'Copa Regional',
    status: 'scheduled',
  },
];

export function MatchCalendar() {
  return (
    <div className="bg-[#121212] rounded-lg border border-[#2A2A2A] overflow-hidden">
      <div className="p-5 border-b border-[#2A2A2A] bg-black/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-[#4169E1]" />
            <h3 className="font-display text-lg text-white tracking-wider">AGENDA DE PARTIDAS</h3>
          </div>
          <button className="text-xs text-[#4169E1] hover:text-[#5B7FE8] font-semibold uppercase tracking-wide">
            Ver Todas
          </button>
        </div>
      </div>

      <div className="divide-y divide-[#2A2A2A]">
        {mockMatches.map((match) => (
          <div key={match.id} className={`p-4 hover:bg-[#0A1128] transition-colors group ${match.status === 'live' ? 'border-b-2 border-b-[#4169E1]' : ''}`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                {match.status === 'live' && (
                  <span className="flex items-center gap-2 px-3 py-1.5 bg-[#DC143C]/20 border border-[#DC143C] rounded text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#DC143C]/30">
                    <Zap className="w-3 h-3 text-[#DC143C] animate-pulse" />
                    <span className="text-[#DC143C]">AO VIVO</span>
                  </span>
                )}
                <span className="text-xs text-gray-500 uppercase tracking-wide">{match.competition}</span>
              </div>
              <span className="font-display text-sm text-[#4169E1]">{match.date}</span>
            </div>

            <div className="flex items-center gap-4 mb-3">
              <div className="flex-1 bg-[#1E1E1E] rounded p-3 border border-[#2A2A2A] group-hover:border-[#4169E1]/30 transition-colors">
                <p className="font-semibold text-white text-sm">{match.homeTeam}</p>
              </div>
              <div className="text-xs text-gray-600 font-bold">VS</div>
              <div className="flex-1 bg-[#1E1E1E] rounded p-3 border border-[#2A2A2A] group-hover:border-[#4169E1]/30 transition-colors">
                <p className="font-semibold text-white text-sm">{match.awayTeam}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#4169E1]" />
                <span className="uppercase tracking-wide">{match.time}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#4169E1]" />
                <span className="uppercase tracking-wide">{match.venue}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
