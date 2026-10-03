interface LogoProps {
  showText?: boolean;
  color?: 'primary' | 'white' | 'muted' | 'none';
  className?: string;
  onClick?: () => void;
}

export function Logo({ showText = true, color = 'white', className = '', onClick }: LogoProps) {
  
  const colorFilters = {
    white: 'brightness-0 invert',
    muted: 'opacity-50 brightness-0 invert',
    primary: 'invert-[65%] sepia-[6%] saturate-[22%] hue-rotate-[314deg] brightness-[91%] contrast-[84%]',
    none: ''
  };

  return (
    <div 
      onClick={onClick}
      className={`flex items-center gap-3.5 cursor-pointer select-none transition-all duration-200 py-1.5 ${className}`}
    >
      {/* 
        Aumentado de h-9 (36px) para h-11 (44px). 
        Isso equipara o tamanho ao padrão dos inputs e botões altos do header.
      */}
      <img 
        src="/Logotipo Zenith.svg" 
        alt="Zenith Logo" 
        className={`h-9 w-auto object-contain transition-all duration-200 ${colorFilters[color]}`}
      />
      
      {/* Texto da Logo ajustado para text-2xl para acompanhar o tamanho */}
      {showText && (
        <h1 className="text-2xl font-bold text-[var(--foreground)] tracking-wider uppercase font-mono mt-0.5">
        </h1>
      )}
    </div>
  );
}