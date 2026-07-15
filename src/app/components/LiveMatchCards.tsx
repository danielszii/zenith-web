import { Eye, Zap } from 'lucide-react';

interface Match {
  id: string;
  category: string;
  homeTeam: {
    name: string;
    shortName: string;
    logo?: string;
  };
  awayTeam: {
    name: string;
    shortName: string;
    logo?: string;
  };
  homeScore: number;
  awayScore: number;
  date: string;
  time: string;
  competition: string;
  status: 'live' | 'scheduled' | 'completed';
}

const mockMatches: Match[] = [
  {
    id: '1',
    category: 'COPA REGIONAL - FINAL',
    homeTeam: {
      name: 'Cruzeiro Mineiro',
      shortName: 'CRU',
      logo: undefined,
    },
    awayTeam: {
      name: 'Danúbio Praia',
      shortName: 'DAN',
      logo: undefined,
    },
    homeScore: 0,
    awayScore: 3,
    date: 'dom, 20/05',
    time: '10:00',
    competition: 'BRASILEIRA',
    status: 'completed',
  },
  {
    id: '2',
    category: 'COPA REGIONAL - SEMI',
    homeTeam: {
      name: 'Saúde Cruzeiro',
      shortName: 'SAU',
      logo: undefined,
    },
    awayTeam: {
      name: 'Vitóri Rossela',
      shortName: 'VIT',
      logo: undefined,
    },
    homeScore: 2,
    awayScore: 1,
    date: 'dom, 18/05',
    time: '10:00',
    competition: 'BRASILEIRA',
    status: 'live',
  },
];

export function LiveMatchCards() {
  const getTeamLogo = (shortName: string) => {
    return (
      <div className="w-16 h-16 rounded-2xl bg-[var(--muted)] border border-[var(--border)] flex items-center justify-center">
        <span className="text-lg font-semibold text-[var(--foreground)]">{shortName}</span>
      </div>
    );
  };

  return (
    <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
      {mockMatches.map((match) => (
        <div
          key={match.id}
          className="flex-none w-[580px] bg-[var(--surface-glass)] backdrop-blur-xl rounded-2xl border border-[var(--border)] overflow-hidden shadow-xl hover:border-[var(--muted)] hover:bg-[var(--surface-glass-hover)] transition-all"
        >
          {/* Header com categoria */}
          <div className="px-5 py-3 bg-[var(--muted)] border-b border-[var(--border)]">
            <p className="text-xs font-semibold text-[var(--foreground)]">{match.category}</p>
          </div>

          {/* Conteúdo principal */}
          <div className="p-6">
            <div className="grid grid-cols-5 gap-4 items-center mb-4">
              {/* Time da casa */}
              <div className="col-span-2 flex flex-col items-center text-center gap-2">
                {getTeamLogo(match.homeTeam.shortName)}
                <p className="font-medium text-[var(--foreground)] text-sm leading-tight">{match.homeTeam.name}</p>
              </div>

              {/* Placar */}
              <div className="col-span-1 flex flex-col items-center justify-center">
                <div className="bg-[var(--muted)] rounded-xl py-3 px-5 border border-[var(--border)]">
                  <p className="text-3xl text-[var(--foreground)] text-center font-semibold">
                    {match.homeScore}
                    <span className="text-[var(--muted-foreground)] mx-2">×</span>
                    {match.awayScore}
                  </p>
                </div>
              </div>

              {/* Time visitante */}
              <div className="col-span-2 flex flex-col items-center text-center gap-2">
                {getTeamLogo(match.awayTeam.shortName)}
                <p className="font-medium text-[var(--foreground)] text-sm leading-tight">{match.awayTeam.name}</p>
              </div>
            </div>

            {/* Footer com data e ação */}
            <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
              <div>
                <p className="text-xs text-[var(--muted-foreground)] mb-1">
                  {match.date} - {match.time}
                </p>
                <p className="text-xs text-[var(--muted-foreground)]">{match.competition}</p>
              </div>

              {match.status === 'live' ? (
                <button className="px-4 py-2 bg-[var(--success)] hover:opacity-90 text-white rounded-lg font-medium text-xs transition-all flex items-center gap-2 active:scale-95">
                  <Zap className="w-4 h-4" />
                  Em Direto
                </button>
              ) : (
                <button className="px-4 py-2 bg-[var(--surface-glass-hover)] hover:bg-[var(--muted)] border border-[var(--border)] text-[var(--foreground)] rounded-lg font-medium text-xs transition-all flex items-center gap-2 active:scale-95">
                  <Eye className="w-4 h-4" />
                  Ver Detalhes
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
