import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

interface StatusBadgeProps {
  status: 'APTO' | 'SUSPENSO' | 'PENDENTE';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  pulse?: boolean;
}

export function StatusBadge({ status, size = 'md', showLabel = true, pulse = false }: StatusBadgeProps) {
  const config = {
    APTO: {
      bg: 'bg-[#4169E1]',
      border: 'border-[#4169E1]',
      text: 'text-[#4169E1]',
      icon: CheckCircle,
      label: 'APTO',
    },
    SUSPENSO: {
      bg: 'bg-[#DC143C]',
      border: 'border-[#DC143C]',
      text: 'text-[#DC143C]',
      icon: XCircle,
      label: 'SUSPENSO',
    },
    PENDENTE: {
      bg: 'bg-[#FFB800]',
      border: 'border-[#FFB800]',
      text: 'text-[#FFB800]',
      icon: AlertTriangle,
      label: 'PENDENTE',
    },
  };

  const sizes = {
    sm: {
      container: 'w-6 h-6',
      icon: 'w-3 h-3',
      text: 'text-xs px-2 py-1',
    },
    md: {
      container: 'w-10 h-10',
      icon: 'w-5 h-5',
      text: 'text-sm px-3 py-1.5',
    },
    lg: {
      container: 'w-16 h-16',
      icon: 'w-8 h-8',
      text: 'text-base px-4 py-2',
    },
  };

  const style = config[status];
  const sizeStyle = sizes[size];
  const Icon = style.icon;

  if (!showLabel) {
    return (
      <div
        className={`
          ${sizeStyle.container}
          ${style.bg}
          rounded-full
          flex items-center justify-center
          border-2 border-black
          shadow-xl shadow-${style.bg}/50
          ${pulse ? 'animate-pulse' : ''}
        `}
      >
        <Icon className={`${sizeStyle.icon} text-white`} />
      </div>
    );
  }

  return (
    <div
      className={`
        inline-flex items-center gap-2
        ${sizeStyle.text}
        ${style.bg}/20
        border-2 ${style.border}
        rounded-lg
        font-bold uppercase tracking-wider
        ${pulse ? 'animate-pulse' : ''}
      `}
    >
      <Icon className={`${sizeStyle.icon} ${style.text}`} />
      <span className={style.text}>{style.label}</span>
    </div>
  );
}
