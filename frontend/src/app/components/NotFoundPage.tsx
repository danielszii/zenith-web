import { ArrowLeft, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <main className="app-shell page-enter flex min-h-[65vh] flex-1 items-center py-16">
      <div className="max-w-2xl">
        <p className="eyebrow">Erro 404</p>
        <h1 className="font-display mt-4 text-7xl leading-[.85] sm:text-9xl">FORA DE<br /><span className="text-[var(--primary)]">JOGO.</span></h1>
        <p className="mt-6 max-w-lg text-sm leading-6 text-[var(--muted-foreground)]">
          A página que você tentou acessar não existe ou mudou de endereço.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/" className="button-primary"><Home className="h-4 w-4" /> Ir para o início</Link>
          <Link to="/partidas" className="button-secondary"><ArrowLeft className="h-4 w-4" /> Ver partidas</Link>
        </div>
      </div>
    </main>
  );
}
