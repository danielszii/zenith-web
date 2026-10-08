import { BarChart3, CalendarDays, Images, LayoutDashboard, Trophy, Users } from 'lucide-react';

interface NavbarProps {
  activePage: string;
  onNavigate: (page: string) => void;
}

const items = [
  { id: 'dashboard', label: 'Início', icon: LayoutDashboard },
  { id: 'championships', label: 'Competições', icon: Trophy },
  { id: 'matches', label: 'Partidas', icon: CalendarDays },
  { id: 'players', label: 'Atletas', icon: Users },
  { id: 'statistics', label: 'Estatísticas', icon: BarChart3 },
  { id: 'gallery', label: 'Mídia', icon: Images },
];

export function Navbar({ activePage, onNavigate }: NavbarProps) {
  return (
    <nav aria-label="Navegação principal" className="scrollbar-hide flex items-center gap-0.5 overflow-x-auto rounded-full border border-[var(--border)] bg-[var(--surface-glass)] p-1 shadow-[0_12px_35px_rgba(0,0,0,.14)] backdrop-blur-xl sm:gap-1">
      {items.map(item => {
        const Icon = item.icon;
        const active = activePage === item.id;

        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            aria-label={item.label}
            className={`group relative flex h-9 shrink-0 items-center gap-2 rounded-full px-3 text-xs font-bold transition-all duration-200 sm:px-4 ${
              active
                ? 'bg-[var(--primary)] text-[var(--primary-foreground)] shadow-[0_6px_20px_rgba(184,243,61,.18)]'
                : 'text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]'
            }`}
          >
            <Icon className="h-4 w-4 transition-transform duration-200 group-hover:scale-105" />
            <span className="hidden md:inline">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
