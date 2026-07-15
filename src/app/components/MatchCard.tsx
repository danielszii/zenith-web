import { MapPin, Clock, Calendar, Zap } from 'lucide-react';

interface MatchCardProps {
  match: {
    id: string;
    homeTeam: string;
    awayTeam: string;
    homeScore?: number;
    awayScore?: number;
    date: string;
    time: string;
    venue: string;
    competition: string;
    status: 'scheduled' | 'live' | 'completed';
  };
  highlighted?: boolean;
}

export function MatchCard({ match, highlighted = false }: MatchCardProps) {
  const isLive = match.status === 'live';

  return (
    <div
      className={`
        bg-[#121212] rounded-lg border-2
        ${isLive ? 'border-[#4169E1] shadow-lg shadow-[#4169E1]/30' : 'border-[#2A2A2A]'}
        ${highlighted ? 'border-b-[6px] border-b-[#4169E1]' : ''}
        hover:bg-[#0A1128] transition-all
        overflow-hidden
      `}
    >
      <div className={`p-4 ${isLive ? 'bg-[#4169E1]/10' : 'bg-black/40'} border-b border-[#2A2A2A]`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isLive && (
              <span className="flex items-center gap-2 px-3 py-1 bg-[#DC143C]/20 border border-[#DC143C] rounded-full text-xs font-bold uppercase tracking-wider">
                <Zap className="w-3 h-3 text-[#DC143C] animate-pulse" />
                <span className="text-[#DC143C]">AO VIVO</span>
              </span>
            )}
            <span className="text-xs text-gray-500 uppercase tracking-wide">{match.competition}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <Calendar className="w-3.5 h-3.5" />
            <span>{match.date}</span>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-5 gap-4 items-center mb-4">
          <div className="col-span-2 text-right">
            <p className="font-semibold text-white text-lg uppercase tracking-wide">{match.homeTeam}</p>
          </div>

          <div className="col-span-1 text-center">
            {match.status !== 'scheduled' && match.homeScore !== undefined && match.awayScore !== undefined ? (
              <div className="bg-black/60 rounded-lg py-3 px-4 border border-[#2A2A2A]">
                <p className="font-display text-3xl text-[#4169E1]">
                  {match.homeScore} - {match.awayScore}
                </p>
              </div>
            ) : (
              <div className="text-gray-600 font-bold text-sm">VS</div>
            )}
          </div>

          <div className="col-span-2 text-left">
            <p className="font-semibold text-white text-lg uppercase tracking-wide">{match.awayTeam}</p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#4169E1]" />
            <span className="uppercase tracking-wide">{match.time}</span>
          </div>
          <div className="w-px h-4 bg-[#2A2A2A]"></div>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#4169E1]" />
            <span className="uppercase tracking-wide">{match.venue}</span>
          </div>
        </div>
      </div>

      {isLive && (
        <div className="h-1 bg-gradient-to-r from-transparent via-[#4169E1] to-transparent animate-pulse"></div>
      )}
    </div>
  );
}
