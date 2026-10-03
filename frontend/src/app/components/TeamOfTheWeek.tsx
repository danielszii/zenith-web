import { useState } from 'react';
import { Trophy, Star } from 'lucide-react';

interface Player {
  id: string;
  name: string;
  position: string;
  team: string;
  rating: number;
  x: number; // Posição X no campo (0-100%)
  y: number; // Posição Y no campo (0-100%)
}

type Sport = 'futebol' | 'futsal' | 'volei' | 'basquete';

const playersData: Record<Sport, Player[]> = {
  futebol: [
    { id: '1', name: 'Gabriel Silva', position: 'GOL', team: 'Cruzeiro FC', rating: 9.2, x: 5, y: 50 },
    { id: '2', name: 'Lucas Martins', position: 'ZAG', team: 'Flamengo', rating: 8.8, x: 20, y: 30 },
    { id: '3', name: 'Pedro Costa', position: 'ZAG', team: 'Palmeiras', rating: 8.9, x: 20, y: 70 },
    { id: '4', name: 'Rafael Santos', position: 'LAT', team: 'São Paulo', rating: 8.5, x: 35, y: 15 },
    { id: '5', name: 'Felipe Rocha', position: 'LAT', team: 'Atlético', rating: 8.4, x: 35, y: 85 },
    { id: '6', name: 'João Mendes', position: 'VOL', team: 'Santos', rating: 8.7, x: 45, y: 40 },
    { id: '7', name: 'Matheus Lima', position: 'MEI', team: 'Corinthians', rating: 9.0, x: 45, y: 60 },
    { id: '8', name: 'Daniel Oliveira', position: 'ATA', team: 'Vasco', rating: 8.6, x: 65, y: 25 },
    { id: '9', name: 'André Ferreira', position: 'ATA', team: 'Botafogo', rating: 9.5, x: 75, y: 50 },
    { id: '10', name: 'Bruno Alves', position: 'ATA', team: 'Grêmio', rating: 8.8, x: 65, y: 75 },
    { id: '11', name: 'Gustavo Dias', position: 'ATA', team: 'Internacional', rating: 8.3, x: 90, y: 50 },
  ],
  futsal: [
    { id: '1', name: 'Gabriel Silva', position: 'GOL', team: 'Cruzeiro FC', rating: 9.2, x: 8, y: 50 },
    { id: '2', name: 'Lucas Martins', position: 'FIX', team: 'Flamengo', rating: 8.8, x: 30, y: 50 },
    { id: '3', name: 'Pedro Costa', position: 'ALA', team: 'Palmeiras', rating: 8.9, x: 55, y: 25 },
    { id: '4', name: 'Rafael Santos', position: 'ALA', team: 'São Paulo', rating: 8.5, x: 55, y: 75 },
    { id: '5', name: 'Felipe Rocha', position: 'PIV', team: 'Atlético', rating: 9.1, x: 85, y: 50 },
  ],
  volei: [
    { id: '1', name: 'Ana Silva', position: 'LEV', team: 'Cruzeiro', rating: 9.0, x: 35, y: 20 },
    { id: '2', name: 'Maria Santos', position: 'CEN', team: 'Flamengo', rating: 8.8, x: 35, y: 40 },
    { id: '3', name: 'Julia Costa', position: 'OPO', team: 'Palmeiras', rating: 9.2, x: 35, y: 60 },
    { id: '4', name: 'Paula Lima', position: 'LEV', team: 'São Paulo', rating: 8.5, x: 35, y: 80 },
    { id: '5', name: 'Beatriz Rocha', position: 'CEN', team: 'Atlético', rating: 8.7, x: 65, y: 30 },
    { id: '6', name: 'Fernanda Dias', position: 'LIB', team: 'Santos', rating: 8.9, x: 65, y: 70 },
  ],
  basquete: [
    { id: '1', name: 'Carlos Silva', position: 'ARM', team: 'Cruzeiro', rating: 9.1, x: 15, y: 50 },
    { id: '2', name: 'João Santos', position: 'ALA', team: 'Flamengo', rating: 8.7, x: 35, y: 25 },
    { id: '3', name: 'Pedro Lima', position: 'ALA', team: 'Palmeiras', rating: 8.9, x: 35, y: 75 },
    { id: '4', name: 'Lucas Costa', position: 'PIV', team: 'São Paulo', rating: 9.3, x: 60, y: 35 },
    { id: '5', name: 'Rafael Dias', position: 'PIV', team: 'Atlético', rating: 8.6, x: 60, y: 65 },
  ],
};

export function TeamOfTheWeek() {
  const [selectedSport, setSelectedSport] = useState<Sport>('futebol');
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  const sports = [
    { id: 'futebol' as Sport, label: 'Futebol', icon: '⚽' },
    { id: 'futsal' as Sport, label: 'Futsal', icon: '🏐' },
    { id: 'volei' as Sport, label: 'Vôlei', icon: '🏐' },
    { id: 'basquete' as Sport, label: 'Basquete', icon: '🏀' },
  ];

  const players = playersData[selectedSport];

  const renderField = () => {
    switch (selectedSport) {
      case 'futebol':
        return (
          <svg viewBox="0 0 130 100" className="w-full h-full">
            {/* Campo de futebol horizontal */}
            <rect x="0" y="0" width="130" height="100" fill="url(#grass)" stroke="white" strokeWidth="0.3" />
            {/* Linha do meio */}
            <line x1="65" y1="0" x2="65" y2="100" stroke="white" strokeWidth="0.3" />
            {/* Círculo central */}
            <circle cx="65" cy="50" r="8" fill="none" stroke="white" strokeWidth="0.3" />
            <circle cx="65" cy="50" r="0.5" fill="white" />
            {/* Área pequena esquerda */}
            <rect x="0" y="36" width="8" height="28" fill="none" stroke="white" strokeWidth="0.3" />
            {/* Área grande esquerda */}
            <rect x="0" y="22" width="18" height="56" fill="none" stroke="white" strokeWidth="0.3" />
            {/* Área pequena direita */}
            <rect x="122" y="36" width="8" height="28" fill="none" stroke="white" strokeWidth="0.3" />
            {/* Área grande direita */}
            <rect x="112" y="22" width="18" height="56" fill="none" stroke="white" strokeWidth="0.3" />

            <defs>
              <pattern id="grass" patternUnits="userSpaceOnUse" width="130" height="100">
                <rect width="130" height="100" fill="#2D5016" />
                <rect width="130" height="100" fill="#357520" opacity="0.3" />
              </pattern>
            </defs>
          </svg>
        );

      case 'futsal':
        return (
          <svg viewBox="0 0 130 100" className="w-full h-full">
            {/* Quadra de futsal horizontal */}
            <rect x="0" y="0" width="130" height="100" fill="#C19A6B" stroke="white" strokeWidth="0.4" />
            {/* Linha do meio */}
            <line x1="65" y1="0" x2="65" y2="100" stroke="white" strokeWidth="0.4" />
            {/* Círculo central */}
            <circle cx="65" cy="50" r="8" fill="none" stroke="white" strokeWidth="0.4" />
            <circle cx="65" cy="50" r="0.5" fill="white" />
            {/* Área esquerda */}
            <path d="M 0,35 L 12,35 A 15 15 0 0 1 12,65 L 0,65" fill="none" stroke="white" strokeWidth="0.4" />
            {/* Área direita */}
            <path d="M 130,35 L 118,35 A 15 15 0 0 0 118,65 L 130,65" fill="none" stroke="white" strokeWidth="0.4" />
            {/* Marca do goleiro esquerda */}
            <circle cx="8" cy="50" r="0.5" fill="white" />
            {/* Marca do goleiro direita */}
            <circle cx="122" cy="50" r="0.5" fill="white" />
          </svg>
        );

      case 'volei':
        return (
          <svg viewBox="0 0 130 100" className="w-full h-full">
            {/* Quadra de vôlei horizontal */}
            <rect x="0" y="0" width="130" height="100" fill="#D4A574" stroke="white" strokeWidth="0.4" />
            {/* Linha do meio (rede) */}
            <line x1="65" y1="0" x2="65" y2="100" stroke="white" strokeWidth="0.8" />
            {/* Linha de ataque esquerda */}
            <line x1="35" y1="0" x2="35" y2="100" stroke="white" strokeWidth="0.3" />
            {/* Linha de ataque direita */}
            <line x1="95" y1="0" x2="95" y2="100" stroke="white" strokeWidth="0.3" />
            {/* Zona de saque */}
            <line x1="0" y1="15" x2="15" y2="15" stroke="white" strokeWidth="0.2" />
            <line x1="115" y1="85" x2="130" y2="85" stroke="white" strokeWidth="0.2" />
          </svg>
        );

      case 'basquete':
        return (
          <svg viewBox="0 0 130 100" className="w-full h-full">
            {/* Quadra de basquete horizontal */}
            <rect x="0" y="0" width="130" height="100" fill="#C8956D" stroke="white" strokeWidth="0.4" />
            {/* Linha do meio */}
            <line x1="65" y1="0" x2="65" y2="100" stroke="white" strokeWidth="0.4" />
            {/* Círculo central */}
            <circle cx="65" cy="50" r="12" fill="none" stroke="white" strokeWidth="0.4" />
            <circle cx="65" cy="50" r="4" fill="none" stroke="white" strokeWidth="0.4" />
            {/* Garrafão esquerdo */}
            <rect x="0" y="35" width="20" height="30" fill="none" stroke="white" strokeWidth="0.4" />
            <circle cx="20" cy="50" r="6" fill="none" stroke="white" strokeWidth="0.4" />
            {/* Garrafão direito */}
            <rect x="110" y="35" width="20" height="30" fill="none" stroke="white" strokeWidth="0.4" />
            <circle cx="110" cy="50" r="6" fill="none" stroke="white" strokeWidth="0.4" />
            {/* Linha de 3 pontos esquerda */}
            <path d="M 0,10 L 25,10 Q 40,10 40,50 Q 40,90 25,90 L 0,90" fill="none" stroke="white" strokeWidth="0.3" />
            {/* Linha de 3 pontos direita */}
            <path d="M 130,10 L 105,10 Q 90,10 90,50 Q 90,90 105,90 L 130,90" fill="none" stroke="white" strokeWidth="0.3" />
          </svg>
        );
    }
  };

  return (
    <div className="bg-[var(--surface-glass)] backdrop-blur-xl rounded-2xl border border-[var(--border)] overflow-hidden">
      {/* Header Section */}
      <div className="p-6 border-b border-[var(--border)]">
        <div className="flex items-center justify-between">
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
      </div>

      {/* Field/Court with Players */}
      <div className="relative bg-[var(--muted)]/30" style={{ aspectRatio: '2.6/1' }}>
        {/* Field SVG - Full Background */}
        <div className="absolute inset-0">
          {renderField()}
        </div>

        {/* Player Nodes */}
        {players.map((player) => (
          <button
            key={player.id}
            onClick={() => setSelectedPlayer(player)}
            className="absolute group z-10"
            style={{
              left: `${player.x}%`,
              top: `${player.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            {/* Player Node */}
            <div
              className={`w-14 h-14 rounded-full border-3 flex items-center justify-center transition-all cursor-pointer ${
                selectedPlayer?.id === player.id
                  ? 'bg-[var(--primary)] border-[var(--primary)] scale-110 shadow-lg shadow-[var(--primary)]/50'
                  : 'bg-[var(--background)] border-white hover:scale-110 hover:border-[var(--primary)] hover:shadow-lg'
              }`}
            >
              <span className="text-sm font-bold text-[var(--foreground)]">
                {player.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </span>
            </div>

            {/* Player Info Card on Hover */}
            <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              <div className="bg-[var(--background)] border border-[var(--border)] rounded-xl shadow-xl p-3 min-w-[200px]">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 bg-[var(--primary)]/10 border border-[var(--primary)]/30 rounded text-xs font-semibold text-[var(--primary)]">
                    {player.position}
                  </span>
                  <div className="flex items-center gap-1 px-2 py-0.5 bg-[var(--muted)] rounded">
                    <Trophy className="w-3 h-3 text-[var(--foreground)]" />
                    <span className="text-xs font-bold text-[var(--foreground)]">{player.rating}</span>
                  </div>
                </div>
                <h4 className="font-bold text-sm text-[var(--foreground)] mb-1">{player.name}</h4>
                <p className="text-xs text-[var(--muted-foreground)]">{player.team}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
