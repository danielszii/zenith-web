import { ImageOff } from 'lucide-react';

export function Gallery() {
  return (
    <main className="page-enter flex-1 pb-16">
      <section className="app-shell pb-10 pt-14 lg:pt-20">
        <p className="eyebrow">Histórias além do placar</p>
        <h1 className="font-display mt-3 text-6xl leading-[.88] md:text-8xl">
          MÍDIA<br /><span className="text-[var(--primary)]">ZENITH</span>
        </h1>
        <p className="mt-5 max-w-xl text-sm leading-6 text-[var(--muted-foreground)]">
          Fotos, melhores momentos e histórias oficiais das competições Zenith.
        </p>
      </section>

      <section className="app-shell">
        <div className="grid min-h-72 place-items-center rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface-glass)] px-6 py-16 text-center">
          <div className="max-w-md">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-[var(--border)] bg-[var(--card)] text-[var(--primary)]">
              <ImageOff className="h-6 w-6" />
            </span>
            <h2 className="mt-5 text-xl font-black">Nenhuma publicação disponível</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
              Fotos e vídeos oficiais aparecerão aqui após as primeiras competições.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}