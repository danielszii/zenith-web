import { useState } from 'react';
import { ChevronLeft, ChevronRight, Trophy, X, EyeOff, Radio } from 'lucide-react';

interface Match {
  id: string;
  championship: string;
  championshipIcon: string;
  phase: string;
  team1: {
    name: string;
    abbr: string;
    logo: string;
  };
  team2: {
    name: string;
    abbr: string;
    logo: string;
  };
  score1: number;
  score2: number;
  status: 'FINAL' | 'AO VIVO' | 'AGENDADO';
  date: string;
  region: string;
}

const mockMatches: Match[] = [
  {
    id: '1',
    championship: 'Liga Brasileira de Basquete - Leste',
    championshipIcon: '🏀',
    phase: '#B · FASE DE GRUPOS · IDA-VOLTA',
    team1: { name: 'Brasília', abbr: 'BRA', logo: '🔴' },
    team2: { name: 'Typhoons', abbr: 'TYP', logo: '🟣' },
    score1: 79,
    score2: 80,
    status: 'FINAL',
    date: '2026-05-07',
    region: 'americas',
  },
  {
    id: '2',
    championship: 'Campeonato Paulista de Vôlei',
    championshipIcon: '🏐',
    phase: '#2 · SEMI-FINAIS · PARTIDA ÚNICA',
    team1: { name: 'Vilhena', abbr: 'VILN', logo: '🔴' },
    team2: { name: 'Litoral FC', abbr: 'LITF', logo: '🟢' },
    score1: 87,
    score2: 69,
    status: 'FINAL',
    date: '2026-05-07',
    region: 'americas',
  },
  {
    id: '3',
    championship: 'Copa Nacional de Futsal',
    championshipIcon: '⚽',
    phase: '#1 · SEMI-FINAIS · PARTIDA ÚNICA',
    team1: { name: 'União', abbr: 'UNI', logo: '🟢' },
    team2: { name: 'Aek FC', abbr: 'AEK', logo: '🟡' },
    score1: 65,
    score2: 78,
    status: 'FINAL',
    date: '2026-05-07',
    region: 'americas',
  },
  {
    id: '4',
    championship: 'Liga Europeia de Futebol',
    championshipIcon: '⚽',
    phase: '#A · FASE DE GRUPOS · IDA-VOLTA',
    team1: { name: 'Real Madrid', abbr: 'RMA', logo: '⚪' },
    team2: { name: 'Barcelona', abbr: 'BAR', logo: '🔵' },
    score1: 2,
    score2: 1,
    status: 'FINAL',
    date: '2026-05-08',
    region: 'europe',
  },
  {
    id: '5',
    championship: 'Liga Asiática de Basquete',
    championshipIcon: '🏀',
    phase: '#C · OITAVAS · IDA',
    team1: { name: 'Tokyo Dragons', abbr: 'TOK', logo: '🔴' },
    team2: { name: 'Seoul Tigers', abbr: 'SEO', logo: '🟠' },
    score1: 92,
    score2: 88,
    status: 'FINAL',
    date: '2026-05-08',
    region: 'asia',
  },
];

const regions = [
  { id: 'all', label: 'Todos' },
  { id: 'americas', label: 'Américas' },
  { id: 'europe', label: 'Europa' },
  { id: 'asia', label: 'Ásia' },
  { id: 'africa', label: 'África' },
  { id: 'oceania', label: 'Oceania' },
];

const generateDateRange = () => {
  const dates = [];
  const today = new Date('2026-05-08');

  for (let i = -4; i <= 5; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push({
      dayName: date.toLocaleDateString('pt-BR', { weekday: 'short' }).toUpperCase(),
      dayNumber: date.getDate().toString().padStart(2, '0'),
      month: date.toLocaleDateString('pt-BR', { month: 'short' }).toUpperCase(),
      fullDate: date.toISOString().split('T')[0],
      isToday: i === 0,
    });
  }

  return dates;
};

export function GamesAndResults() {
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedDate, setSelectedDate] = useState('2026-05-08');
  const [hideScores, setHideScores] = useState(false);
  const [showLiveOnly, setShowLiveOnly] = useState(false);
  const [dateOffset, setDateOffset] = useState(0);

  const dates = generateDateRange();
  const visibleDates = dates.slice(dateOffset, dateOffset + 7);

  const filteredMatches = mockMatches.filter((match) => {
    const regionMatch = selectedRegion === 'all' || match.region === selectedRegion;
    const dateMatch = match.date === selectedDate;
    const liveMatch = !showLiveOnly || match.status === 'AO VIVO';
    return regionMatch && dateMatch && liveMatch;
  });

  const liveCount = mockMatches.filter((m) => m.status === 'AO VIVO').length;

  const handlePrevDates = () => {
    if (dateOffset > 0) setDateOffset(dateOffset - 1);
  };

  const handleNextDates = () => {
    if (dateOffset < dates.length - 7) setDateOffset(dateOffset + 1);
  };

  return (
    <div className="bg-[var(--surface-glass)] backdrop-blur-xl rounded-2xl border border-[var(--border)] overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-[var(--border)]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl text-[var(--foreground)] font-semibold">
            Partidas & Resultados: {regions.find((r) => r.id === selectedRegion)?.label}
          </h2>
        </div>

        {/* Region Filters */}
        <div className="flex items-center gap-2 mb-6">
          {regions.map((region) => (
            <button
              key={region.id}
              onClick={() => setSelectedRegion(region.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedRegion === region.id
                  ? 'bg-[var(--primary)] text-[var(--primary-foreground)]'
                  : 'bg-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--surface-glass-hover)]'
              }`}
            >
              {region.label}
            </button>
          ))}
        </div>

        {/* Date Carousel */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={handlePrevDates}
            disabled={dateOffset === 0}
            className="w-10 h-10 rounded-lg bg-[var(--surface-glass)] hover:bg-[var(--surface-glass-hover)] border border-[var(--border)] flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5 text-[var(--foreground)]" />
          </button>

          <div className="flex-1 flex items-center gap-2 overflow-hidden">
            {visibleDates.map((date) => (
              <button
                key={date.fullDate}
                onClick={() => setSelectedDate(date.fullDate)}
                className={`flex-1 min-w-0 px-4 py-3 rounded-xl text-center transition-all ${
                  selectedDate === date.fullDate
                    ? 'bg-[var(--primary)] text-[var(--primary-foreground)]'
                    : 'bg-[var(--muted)]/30 text-[var(--muted-foreground)] hover:bg-[var(--surface-glass-hover)]'
                }`}
              >
                <div className="text-xs uppercase mb-1">{date.dayName}</div>
                <div className="text-2xl font-semibold mb-0.5">{date.dayNumber}</div>
                <div className="text-xs uppercase">{date.month}</div>
                {date.isToday && (
                  <div className="w-1.5 h-1.5 bg-[var(--success)] rounded-full mx-auto mt-1"></div>
                )}
              </button>
            ))}
          </div>

          <button
            onClick={handleNextDates}
            disabled={dateOffset >= dates.length - 7}
            className="w-10 h-10 rounded-lg bg-[var(--surface-glass)] hover:bg-[var(--surface-glass-hover)] border border-[var(--border)] flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-5 h-5 text-[var(--foreground)]" />
          </button>
        </div>

        {/* Toggles */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setHideScores(!hideScores)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--muted)]/30 hover:bg-[var(--surface-glass-hover)] transition-all"
          >
            <EyeOff className="w-4 h-4 text-[var(--muted-foreground)]" />
            <span className="text-sm text-[var(--muted-foreground)]">Ocultar Placares</span>
            <div
              className={`w-10 h-6 rounded-full transition-all ml-2 ${
                hideScores ? 'bg-[var(--primary)]' : 'bg-[var(--switch-background)]'
              }`}
            >
              <div
                className={`w-4 h-4 bg-white rounded-full mt-1 transition-all ${
                  hideScores ? 'ml-5' : 'ml-1'
                }`}
              ></div>
            </div>
          </button>

          <button
            onClick={() => setShowLiveOnly(!showLiveOnly)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--muted)]/30 hover:bg-[var(--surface-glass-hover)] transition-all"
          >
            <Radio className="w-4 h-4 text-[var(--muted-foreground)]" />
            <span className="text-sm text-[var(--muted-foreground)]">Ao Vivo ({liveCount})</span>
            <div
              className={`w-10 h-6 rounded-full transition-all ml-2 ${
                showLiveOnly ? 'bg-[var(--primary)]' : 'bg-[var(--switch-background)]'
              }`}
            >
              <div
                className={`w-4 h-4 bg-white rounded-full mt-1 transition-all ${
                  showLiveOnly ? 'ml-5' : 'ml-1'
                }`}
              ></div>
            </div>
          </button>
        </div>
      </div>

      {/* Match Cards */}
      <div className="p-6 space-y-4">
        {filteredMatches.length === 0 ? (
          <div className="text-center py-12">
            <Trophy className="w-12 h-12 text-[var(--muted-foreground)] mx-auto mb-3" />
            <p className="text-[var(--muted-foreground)]">
              Nenhuma partida encontrada para esta data
            </p>
          </div>
        ) : (
          filteredMatches.map((match) => (
            <div
              key={match.id}
              className="bg-[var(--background)] rounded-xl border border-[var(--border)] overflow-hidden"
            >
              {/* Championship Header */}
              <div className="px-4 py-3 bg-[var(--muted)]/20 border-b border-[var(--border)]">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{match.championshipIcon}</span>
                  <span className="text-sm font-semibold text-[var(--foreground)]">
                    {match.championship}
                  </span>
                </div>
              </div>

              {/* Match Details */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs text-[var(--muted-foreground)] uppercase">
                    {match.phase}
                  </span>
                  <span className="text-xs text-[var(--muted-foreground)] uppercase font-semibold">
                    {match.status}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  {/* Team 1 */}
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-8 h-8 rounded-lg bg-[var(--muted)] flex items-center justify-center text-lg">
                      {match.team1.logo}
                    </div>
                    <span className="font-semibold text-[var(--foreground)]">
                      {match.team1.abbr}
                    </span>
                  </div>

                  {/* Scores */}
                  <div className="flex items-center gap-4 px-6">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-[var(--foreground)]">
                        {hideScores ? '-' : match.score1}
                      </span>
                      {!hideScores && match.score1 > match.score2 && match.status === 'FINAL' && (
                        <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[8px] border-b-[var(--destructive)]"></div>
                      )}
                    </div>
                    <span className="text-[var(--muted-foreground)]">-</span>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-[var(--foreground)]">
                        {hideScores ? '-' : match.score2}
                      </span>
                      {!hideScores && match.score2 > match.score1 && match.status === 'FINAL' && (
                        <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[8px] border-b-[var(--destructive)]"></div>
                      )}
                    </div>
                  </div>

                  {/* Team 2 */}
                  <div className="flex items-center gap-3 flex-1 justify-end">
                    <span className="font-semibold text-[var(--foreground)]">
                      {match.team2.abbr}
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-[var(--muted)] flex items-center justify-center text-lg">
                      {match.team2.logo}
                    </div>
                  </div>

                  {/* More Button */}
                  <button className="ml-4 px-4 py-2 bg-[var(--muted)] hover:bg-[var(--surface-glass-hover)] rounded-lg text-sm font-medium text-[var(--foreground)] transition-all">
                    + Mais
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
