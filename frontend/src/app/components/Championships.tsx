import { Trophy } from 'lucide-react';

interface Championship {
  id: string;
  name: string;
  category: string;
  color: string;
}

export function Championships() {
  const championships: Championship[] = [
    { id: '1', name: 'Superliga Feminina', category: 'Feminino', color: '#525252' },
    { id: '2', name: 'Superliga Masculina', category: 'Masculino', color: '#737373' },
    { id: '3', name: 'SuperLiga B', category: 'Segunda Divisão', color: '#A3A3A3' },
    { id: '4', name: 'SuperLiga C', category: 'Terceira Divisão', color: '#525252' },
    { id: '5', name: 'SuperLiga Master', category: 'Master', color: '#737373' },
    { id: '6', name: 'Supercopa', category: 'Copa', color: '#A3A3A3' },
    { id: '7', name: 'Copa Brasil', category: 'Nacional', color: '#525252' },
    { id: '8', name: 'CBB', category: 'Basketball', color: '#737373' },
    { id: '9', name: 'CBF', category: 'Futebol', color: '#A3A3A3' },
    { id: '10', name: 'Vôlei Master', category: 'Vôlei', color: '#525252' },
  ];

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl text-[var(--foreground)] font-semibold mb-2">Campeonatos & Copas</h1>
          <p className="text-[var(--muted-foreground)] text-sm">Competições ativas</p>
        </div>

        {/* Championships Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {championships.map((championship) => (
            <div
              key={championship.id}
              className="group bg-[var(--surface-glass)] backdrop-blur-xl rounded-2xl border border-[var(--border)] hover:border-[var(--muted)] p-6 transition-all duration-300 hover:bg-[var(--surface-glass-hover)] cursor-pointer"
            >
              {/* Logo placeholder */}
              <div
                className="w-full aspect-square rounded-xl mb-4 flex items-center justify-center transition-transform duration-300 group-hover:scale-105"
                style={{
                  background: `linear-gradient(135deg, ${championship.color}20, ${championship.color}10)`,
                  border: `1px solid ${championship.color}30`,
                }}
              >
                <Trophy
                  className="w-12 h-12 transition-colors"
                  style={{ color: championship.color }}
                />
              </div>

              {/* Championship Info */}
              <div className="text-center">
                <h3 className="text-[var(--foreground)] text-sm mb-1 font-medium">
                  {championship.name}
                </h3>
                <p className="text-xs text-[var(--muted-foreground)]">
                  {championship.category}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-[var(--surface-glass)] backdrop-blur-xl rounded-2xl border border-[var(--border)] p-6 hover:bg-[var(--surface-glass-hover)] transition-all">
            <div className="text-xs text-[var(--muted-foreground)] mb-2 font-medium">Total de Campeonatos</div>
            <div className="text-3xl font-semibold text-[var(--foreground)] mb-1">10</div>
            <div className="text-xs text-[var(--success)]">+2 este mês</div>
          </div>

          <div className="bg-[var(--surface-glass)] backdrop-blur-xl rounded-2xl border border-[var(--border)] p-6 hover:bg-[var(--surface-glass-hover)] transition-all">
            <div className="text-xs text-[var(--muted-foreground)] mb-2 font-medium">Clubes Participantes</div>
            <div className="text-3xl font-semibold text-[var(--foreground)] mb-1">156</div>
            <div className="text-xs text-[var(--success)]">+8 novos</div>
          </div>

          <div className="bg-[var(--surface-glass)] backdrop-blur-xl rounded-2xl border border-[var(--border)] p-6 hover:bg-[var(--surface-glass-hover)] transition-all">
            <div className="text-xs text-[var(--muted-foreground)] mb-2 font-medium">Partidas Agendadas</div>
            <div className="text-3xl font-semibold text-[var(--foreground)] mb-1">247</div>
            <div className="text-xs text-[var(--muted-foreground)]">próximos 30 dias</div>
          </div>

          <div className="bg-[var(--surface-glass)] backdrop-blur-xl rounded-2xl border border-[var(--border)] p-6 hover:bg-[var(--surface-glass-hover)] transition-all">
            <div className="text-xs text-[var(--muted-foreground)] mb-2 font-medium">Atletas Ativos</div>
            <div className="text-3xl font-semibold text-[var(--foreground)] mb-1">2,547</div>
            <div className="text-xs text-[var(--success)]">+12% vs mês anterior</div>
          </div>
        </div>
      </div>
    </div>
  );
}
