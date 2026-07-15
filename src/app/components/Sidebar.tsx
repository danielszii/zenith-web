import { LayoutDashboard, Trophy, Users, Calendar, ClipboardList, Settings, FileText } from 'lucide-react';

interface SidebarProps {
  activePage?: string;
}

export function Sidebar({ activePage = 'dashboard' }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'DASHBOARD' },
    { id: 'competitions', icon: Trophy, label: 'COMPETIÇÕES' },
    { id: 'clubs', icon: Users, label: 'CLUBES' },
    { id: 'athletes', icon: Users, label: 'ATLETAS' },
    { id: 'matches', icon: Calendar, label: 'PARTIDAS' },
    { id: 'reports', icon: FileText, label: 'SÚMULAS' },
    { id: 'documents', icon: ClipboardList, label: 'DOCUMENTOS' },
    { id: 'settings', icon: Settings, label: 'CONFIG' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-black flex flex-col border-r border-[#2A2A2A]">
      <div className="p-6 border-b border-[#2A2A2A]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#4169E1] to-[#2E5FCC] rounded flex items-center justify-center shadow-lg shadow-[#4169E1]/20">
            <Trophy className="w-6 h-6 text-black" />
          </div>
          <div>
            <h1 className="font-display text-xl text-[#4169E1] tracking-wider">ZENITH</h1>
            <p className="text-xs text-gray-400 uppercase tracking-wide">Elite System</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.id === activePage;

          return (
            <button
              key={item.id}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded transition-all group relative ${
                isActive
                  ? 'bg-gradient-to-r from-[#4169E1] to-transparent text-white shadow-lg shadow-[#4169E1]/20'
                  : 'text-gray-400 hover:bg-[#0A1128] hover:text-white'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? '' : 'group-hover:text-[#4169E1]'} transition-colors`} />
              <span className="text-xs font-semibold tracking-wide">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[#2A2A2A]">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-9 h-9 bg-gradient-to-br from-[#4169E1] to-[#2E5FCC] rounded-full flex items-center justify-center">
            <span className="text-xs font-bold text-black">AD</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-white">Admin</p>
            <p className="text-xs text-gray-500">Sistema</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
