import { useState } from 'react';
import { Trophy, Star, User } from 'lucide-react';

interface Player {
  id: string;
  name: string;
  number: string;
  position: string;
  team: string;
  rating: number;
  x: number;
  y: number;
  photo?: string;
}

type Sport = 'futebol' | 'futsal' | 'volei' | 'basquete';
type Category = 'profissional' | 'sub21' | 'sub19' | 'sub17';

const playersData: Record<Sport, Record<Category, Player[]>> = {
  futebol: {
    profissional: [
      { id: '1', name: 'Silva', number: '1', position: 'GOL', team: 'Cruzeiro FC', rating: 9.2, x: 10, y: 50 },
      { id: '2', name: 'Martins', number: '3', position: 'ZAG', team: 'Flamengo', rating: 8.8, x: 25, y: 30 },
      { id: '3', name: 'Costa', number: '4', position: 'ZAG', team: 'Palmeiras', rating: 8.9, x: 25, y: 70 },
      { id: '4', name: 'Santos', number: '2', position: 'LAT', team: 'São Paulo', rating: 8.5, x: 40, y: 15 },
      { id: '5', name: 'Rocha', number: '6', position: 'LAT', team: 'Atlético', rating: 8.4, x: 40, y: 85 },
      { id: '6', name: 'Mendes', number: '5', position: 'VOL', team: 'Santos', rating: 8.7, x: 52, y: 40 },
      { id: '7', name: 'Lima', number: '8', position: 'MEI', team: 'Corinthians', rating: 9.0, x: 52, y: 60 },
      { id: '8', name: 'Oliveira', number: '7', position: 'ATA', team: 'Vasco', rating: 8.6, x: 70, y: 25 },
      { id: '9', name: 'Ferreira', number: '9', position: 'ATA', team: 'Botafogo', rating: 9.5, x: 82, y: 50 },
      { id: '10', name: 'Alves', number: '11', position: 'ATA', team: 'Grêmio', rating: 8.8, x: 70, y: 75 },
    ],
    sub21: [
      { id: '1', name: 'Pedro', number: '1', position: 'GOL', team: 'Santos', rating: 8.9, x: 10, y: 50 },
      { id: '2', name: 'Silva', number: '3', position: 'ZAG', team: 'Palmeiras', rating: 8.5, x: 25, y: 30 },
      { id: '3', name: 'Rocha', number: '4', position: 'ZAG', team: 'Flamengo', rating: 8.6, x: 25, y: 70 },
      { id: '4', name: 'Lima', number: '2', position: 'LAT', team: 'Cruzeiro', rating: 8.3, x: 40, y: 15 },
      { id: '5', name: 'Costa', number: '6', position: 'LAT', team: 'Corinthians', rating: 8.2, x: 40, y: 85 },
      { id: '6', name: 'Mendes', number: '5', position: 'VOL', team: 'São Paulo', rating: 8.4, x: 52, y: 40 },
      { id: '7', name: 'Vinicius', number: '8', position: 'MEI', team: 'Vasco', rating: 8.8, x: 52, y: 60 },
      { id: '8', name: 'Alves', number: '7', position: 'ATA', team: 'Botafogo', rating: 8.4, x: 70, y: 25 },
      { id: '9', name: 'Eduardo', number: '9', position: 'ATA', team: 'Grêmio', rating: 9.2, x: 82, y: 50 },
      { id: '10', name: 'Igor', number: '11', position: 'ATA', team: 'Atlético', rating: 8.5, x: 70, y: 75 },
    ],
    sub19: [
      { id: '1', name: 'Carlos', number: '1', position: 'GOL', team: 'Flamengo', rating: 8.5, x: 10, y: 50 },
      { id: '2', name: 'Matheus', number: '3', position: 'ZAG', team: 'Santos', rating: 8.2, x: 25, y: 30 },
      { id: '3', name: 'Lucas', number: '4', position: 'ZAG', team: 'Palmeiras', rating: 8.3, x: 25, y: 70 },
      { id: '4', name: 'Pedro', number: '2', position: 'LAT', team: 'Cruzeiro', rating: 8.0, x: 40, y: 15 },
      { id: '5', name: 'Gabriel', number: '6', position: 'LAT', team: 'São Paulo', rating: 7.9, x: 40, y: 85 },
      { id: '6', name: 'Rafael', number: '5', position: 'VOL', team: 'Corinthians', rating: 8.1, x: 52, y: 40 },
      { id: '7', name: 'Felipe', number: '8', position: 'MEI', team: 'Vasco', rating: 8.4, x: 52, y: 60 },
      { id: '8', name: 'Bruno', number: '7', position: 'ATA', team: 'Botafogo', rating: 8.2, x: 70, y: 25 },
      { id: '9', name: 'Diego', number: '9', position: 'ATA', team: 'Grêmio', rating: 8.7, x: 82, y: 50 },
      { id: '10', name: 'Gustavo', number: '11', position: 'ATA', team: 'Atlético', rating: 8.3, x: 70, y: 75 },
    ],
    sub17: [
      { id: '1', name: 'João', number: '1', position: 'GOL', team: 'Santos', rating: 8.0, x: 10, y: 50 },
      { id: '2', name: 'André', number: '3', position: 'ZAG', team: 'Palmeiras', rating: 7.8, x: 25, y: 30 },
      { id: '3', name: 'Thiago', number: '4', position: 'ZAG', team: 'Flamengo', rating: 7.9, x: 25, y: 70 },
      { id: '4', name: 'Vitor', number: '2', position: 'LAT', team: 'Cruzeiro', rating: 7.6, x: 40, y: 15 },
      { id: '5', name: 'Igor', number: '6', position: 'LAT', team: 'Corinthians', rating: 7.5, x: 40, y: 85 },
      { id: '6', name: 'Daniel', number: '5', position: 'VOL', team: 'São Paulo', rating: 7.7, x: 52, y: 40 },
      { id: '7', name: 'Pablo', number: '8', position: 'MEI', team: 'Vasco', rating: 8.1, x: 52, y: 60 },
      { id: '8', name: 'Eduardo', number: '7', position: 'ATA', team: 'Botafogo', rating: 7.9, x: 70, y: 25 },
      { id: '9', name: 'Felipe', number: '9', position: 'ATA', team: 'Grêmio', rating: 8.3, x: 82, y: 50 },
      { id: '10', name: 'Marcelo', number: '11', position: 'ATA', team: 'Atlético', rating: 8.0, x: 70, y: 75 },
    ],
  },
  futsal: {
    profissional: [
      { id: '1', name: 'Silva', number: '1', position: 'GOL', team: 'Cruzeiro FC', rating: 9.2, x: 12, y: 50 },
      { id: '2', name: 'Martins', number: '4', position: 'FIX', team: 'Flamengo', rating: 8.8, x: 35, y: 50 },
      { id: '3', name: 'Costa', number: '7', position: 'ALA', team: 'Palmeiras', rating: 8.9, x: 60, y: 25 },
      { id: '4', name: 'Santos', number: '11', position: 'ALA', team: 'São Paulo', rating: 8.5, x: 60, y: 75 },
      { id: '5', name: 'Rocha', number: '9', position: 'PIV', team: 'Atlético', rating: 9.1, x: 85, y: 50 },
    ],
    sub21: [],
    sub19: [],
    sub17: [],
  },
  volei: {
    profissional: [],
    sub21: [],
    sub19: [],
    sub17: [],
  },
  basquete: {
    profissional: [],
    sub21: [],
    sub19: [],
    sub17: [],
  },
};

export function TeamOfTheWeekV2() {
  const [selectedSport, setSelectedSport] = useState<Sport>('futebol');
  const [selectedCategory, setSelectedCategory] = useState<Category>('profissional');
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  const sports = [
    { id: 'futebol' as Sport, label: 'Futebol', icon: '⚽' },
    { id: 'futsal' as Sport, label: 'Futsal', icon: '👟' },
  ];

  const categories = [
    { id: 'profissional' as Category, label: 'Profissional' },
    { id: 'sub21' as Category, label: 'Sub-21' },
    { id: 'sub19' as Category, label: 'Sub-19' },
    { id: 'sub17' as Category, label: 'Sub-17' },
  ];

  const players = playersData[selectedSport][selectedCategory] || [];

  const renderField = () => {
    switch (selectedSport) {
      case 'futebol':
        return (
          <svg viewBox="0 0 130 100" className="w-full h-full">
            {/* Campo de futebol horizontal - fundo escuro */}
            <defs>
              <pattern id="grass-dark" patternUnits="userSpaceOnUse" width="130" height="100">
                <rect width="130" height="100" fill="#0F2C1C" />
                <rect width="130" height="100" fill="#134D2E" opacity="0.5" />
              </pattern>
            </defs>
            <rect x="0" y="0" width="130" height="100" fill="url(#grass-dark)" stroke="#1a6644" strokeWidth="0.5" />
            {/* Linha do meio */}
            <line x1="65" y1="0" x2="65" y2="100" stroke="#1a6644" strokeWidth="0.5" />
            {/* Círculo central */}
            <circle cx="65" cy="50" r="8" fill="none" stroke="#1a6644" strokeWidth="0.5" />
            <circle cx="65" cy="50" r="0.5" fill="#1a6644" />
            {/* Área pequena esquerda */}
            <rect x="0" y="36" width="8" height="28" fill="none" stroke="#1a6644" strokeWidth="0.5" />
            {/* Área grande esquerda */}
            <rect x="0" y="22" width="18" height="56" fill="none" stroke="#1a6644" strokeWidth="0.5" />
            {/* Área pequena direita */}
            <rect x="122" y="36" width="8" height="28" fill="none" stroke="#1a6644" strokeWidth="0.5" />
            {/* Área grande direita */}
            <rect x="112" y="22" width="18" height="56" fill="none" stroke="#1a6644" strokeWidth="0.5" />
          </svg>
        );

      case 'futsal':
        return (
          <svg viewBox="0 0 130 100" className="w-full h-full">
            {/* Quadra de futsal horizontal */}
            <rect x="0" y="0" width="130" height="100" fill="#1a3a4a" stroke="#2a5a6a" strokeWidth="0.5" />
            {/* Linha do meio */}
            <line x1="65" y1="0" x2="65" y2="100" stroke="#2a5a6a" strokeWidth="0.5" />
            {/* Círculo central */}
            <circle cx="65" cy="50" r="8" fill="none" stroke="#2a5a6a" strokeWidth="0.5" />
            <circle cx="65" cy="50" r="0.5" fill="#2a5a6a" />
            {/* Área esquerda */}
            <path d="M 0,35 L 12,35 A 15 15 0 0 1 12,65 L 0,65" fill="none" stroke="#2a5a6a" strokeWidth="0.5" />
            {/* Área direita */}
            <path d="M 130,35 L 118,35 A 15 15 0 0 0 118,65 L 130,65" fill="none" stroke="#2a5a6a" strokeWidth="0.5" />
          </svg>
        );
    }
  };

  return (
    <div className="bg-[var(--surface-glass)] backdrop-blur-xl rounded-2xl border border-[var(--border)] overflow-hidden">
      {/* Header Section */}
      <div className="p-6 border-b border-[var(--border)]">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-[var(--primary)]/10 border border-[var(--primary)]/30 rounded-lg">
              <Star className="w-4 h-4 text-[var(--primary)]" />
              <span className="text-xs font-semibold text-[var(--primary)] uppercase tracking-wider">
                Destaque
              </span>
            </div>
            <h2 className="text-xl text-[var(--foreground)] font-semibold">Seleção da Semana</h2>
          </div>

          {/* Sport Filters */}
          <div className="flex items-center gap-2">
            {sports.map((sport) => (
              <button
                key={sport.id}
                onClick={() => {
                  setSelectedSport(sport.id);
                  setSelectedPlayer(null);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                  selectedSport === sport.id
                    ? 'bg-[var(--primary)] text-[var(--primary-foreground)]'
                    : 'bg-[var(--surface-glass)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--surface-glass-hover)] border border-[var(--border)]'
                }`}
              >
                <span className="text-lg">{sport.icon}</span>
                <span>{sport.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => {
                setSelectedCategory(category.id);
                setSelectedPlayer(null);
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedCategory === category.id
                  ? 'bg-[var(--muted)] text-[var(--foreground)]'
                  : 'bg-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--surface-glass-hover)]'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* Field with Players */}
      <div className="relative bg-[var(--muted)]/30" style={{ aspectRatio: '2.6/1' }}>
        {/* Field SVG - Full Background */}
        <div className="absolute inset-0">
          {renderField()}
        </div>

        {/* Player Nodes */}
        {players.map((player) => (
          <div
            key={player.id}
            onClick={() => setSelectedPlayer(player)}
            className="absolute group z-10 cursor-pointer"
            style={{
              left: `${player.x}%`,
              top: `${player.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            {/* Player Photo Circle */}
            <div
              className={`w-16 h-16 rounded-full border-2 flex items-center justify-center transition-all overflow-hidden ${
                selectedPlayer?.id === player.id
                  ? 'border-[var(--primary)] scale-110 shadow-lg shadow-[var(--primary)]/50'
                  : 'border-white hover:scale-110 hover:border-[var(--primary)] hover:shadow-lg'
              }`}
            >
              {player.photo ? (
                <img src={player.photo} alt={player.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[var(--muted)] to-[var(--muted)]/50 flex items-center justify-center">
                  <User className="w-8 h-8 text-[var(--muted-foreground)]" />
                </div>
              )}
            </div>

            {/* Player Info Below Photo */}
            <div className="absolute top-full mt-1 left-1/2 -translate-x-1/2 whitespace-nowrap text-center">
              <div className="bg-[var(--background)]/90 backdrop-blur-sm border border-[var(--border)] rounded-lg px-2 py-1">
                <p className="text-xs font-bold text-[var(--foreground)]">
                  {player.number} {player.name}
                </p>
              </div>
            </div>

            {/* Hover Card with Details */}
            <div className="absolute bottom-full mb-20 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
              <div className="bg-[var(--background)] border border-[var(--border)] rounded-xl shadow-xl p-4 min-w-[220px]">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2 py-0.5 bg-[var(--primary)]/10 border border-[var(--primary)]/30 rounded text-xs font-semibold text-[var(--primary)]">
                    {player.position}
                  </span>
                  <div className="flex items-center gap-1 px-2 py-0.5 bg-[var(--muted)] rounded">
                    <Trophy className="w-3 h-3 text-[var(--foreground)]" />
                    <span className="text-xs font-bold text-[var(--foreground)]">{player.rating}</span>
                  </div>
                </div>
                <h4 className="font-bold text-sm text-[var(--foreground)] mb-1">
                  #{player.number} {player.name}
                </h4>
                <p className="text-xs text-[var(--muted-foreground)]">{player.team}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
