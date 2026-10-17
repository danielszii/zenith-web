interface LogoProps {
  compact?: boolean;
  full?: boolean;
  className?: string;
  onClick?: () => void;
}

export function Logo({ compact = false, full = false, className = '', onClick }: LogoProps) {
  const content = (
    <>
      {!full && <img src="/zenith-isotipo.png" alt={compact ? 'Zenith Sports OS' : ''} aria-hidden={!compact} className={`${compact ? 'h-11 w-11 lg:h-14 lg:w-14' : 'h-10 w-10 lg:hidden'} shrink-0 object-contain`} />}
      {!compact && <img src="/zenith-logo-completa.png" alt="Zenith Sports OS" className={`${full ? 'block' : 'hidden lg:block'} h-11 w-auto max-w-[210px] object-contain`} />}
    </>
  );

  if (!onClick) return <div className={`inline-flex items-center ${className}`}>{content}</div>;

  return (
    <button type="button" onClick={onClick} className={`inline-flex items-center transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] ${className}`} aria-label="Ir para a pagina inicial">
      {content}
    </button>
  );
}
