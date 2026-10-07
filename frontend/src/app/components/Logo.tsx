interface LogoProps { showText?: boolean; className?: string; onClick?: () => void }
export function Logo({ showText = true, className = '', onClick }: LogoProps) {
  return <button onClick={onClick} className={`group flex items-center gap-3 ${className}`} aria-label="Ir para o início">
    <span className="grid h-10 w-10 place-items-center rounded-xl border border-[var(--border)] bg-[var(--foreground)] shadow-lg shadow-black/10">
      <img src="/Logotipo Zenith.svg" alt="" className="h-6 w-6 object-contain brightness-0"/>
    </span>
    {showText && <span className="hidden text-left lg:block"><span className="font-display block text-[1.65rem] leading-none tracking-[.06em]">ZENITH</span><span className="block text-[.55rem] font-bold tracking-[.24em] text-[var(--muted-foreground)]">SPORTS OS</span></span>}
  </button>;
}
