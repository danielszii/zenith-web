import { LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  iconColor?: string;
}

export function KPICard({ title, value, change, changeType = 'neutral', icon: Icon, iconColor = '#737373' }: KPICardProps) {
  const changeColors = {
    positive: 'text-[var(--success)]',
    negative: 'text-[var(--destructive)]',
    neutral: 'text-[var(--muted-foreground)]',
  };

  return (
    <div className="bg-[var(--surface-glass)] backdrop-blur-xl rounded-2xl p-6 border border-[var(--border)] hover:border-[var(--muted)] transition-all hover:bg-[var(--surface-glass-hover)] group">
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center transition-all group-hover:scale-105"
          style={{
            background: `linear-gradient(135deg, ${iconColor}20, ${iconColor}10)`,
          }}
        >
          <Icon className="w-5 h-5" style={{ color: iconColor }} />
        </div>
      </div>

      <div>
        <p className="text-xs text-[var(--muted-foreground)] mb-2 font-medium">{title}</p>
        <p className="text-3xl text-[var(--foreground)] mb-1 font-semibold">{value}</p>
        {change && (
          <p className={`text-xs font-medium ${changeColors[changeType]}`}>
            {change}
          </p>
        )}
      </div>
    </div>
  );
}
