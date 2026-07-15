import { LucideIcon } from 'lucide-react';

interface PrimaryButtonProps {
  children: React.ReactNode;
  icon?: LucideIcon;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export function PrimaryButton({
  children,
  icon: Icon,
  onClick,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
}: PrimaryButtonProps) {
  const variants = {
    primary: 'bg-[#4169E1] hover:bg-[#5B7FE8] text-white shadow-lg shadow-[#4169E1]/30 hover:shadow-[#4169E1]/50',
    secondary: 'bg-[#0A1128] hover:bg-[#1a2550] text-white border border-[#4169E1]/30 hover:border-[#4169E1]',
    danger: 'bg-[#DC143C] hover:bg-[#FF1744] text-white shadow-lg shadow-[#DC143C]/30 hover:shadow-[#DC143C]/50',
  };

  const sizes = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  };

  return (
    <button
      onClick={onClick}
      className={`
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        rounded-lg font-bold uppercase tracking-wider
        transition-all duration-200
        flex items-center justify-center gap-2
        active:scale-95
        disabled:opacity-50 disabled:cursor-not-allowed
      `}
    >
      {Icon && <Icon className="w-5 h-5" />}
      {children}
    </button>
  );
}
