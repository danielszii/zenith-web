import { Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Logo } from './Logo';

export function Footer() {
  return (
    <footer className="mt-20 border-t border-[var(--border)] bg-[var(--surface-glass)]">
      <div className="app-shell grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div><Logo /><p className="mt-5 max-w-sm text-sm leading-6 text-[var(--muted-foreground)]">Competições, partidas e histórias esportivas conectadas em uma plataforma rápida e confiável.</p></div>
        <div>
          <p className="eyebrow mb-4">Navegação</p>
          <div className="grid gap-2 text-sm text-[var(--muted-foreground)]">
            <Link to="/competicoes" className="hover:text-[var(--foreground)]">Competições</Link>
            <Link to="/partidas" className="hover:text-[var(--foreground)]">Partidas</Link>
            <Link to="/atletas" className="hover:text-[var(--foreground)]">Atletas</Link>
            <Link to="/midia" className="hover:text-[var(--foreground)]">Galeria</Link>
          </div>
        </div>
        <div><p className="eyebrow mb-4">Sistema</p><div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-xs font-bold text-emerald-400"><Activity className="h-3.5 w-3.5" /> Todos os serviços operacionais</div></div>
      </div>
      <div className="app-shell flex flex-wrap justify-between gap-3 border-t border-[var(--border)] py-5 text-xs text-[var(--muted-foreground)]"><span>© {new Date().getFullYear()} Zenith Sports OS</span><span>Feito para quem vive o jogo.</span></div>
    </footer>
  );
}
