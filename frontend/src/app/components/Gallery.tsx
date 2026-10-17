import { useMemo, useState } from 'react';
import { Camera, Clock3, Image as ImageIcon, Play, Sparkles, Video } from 'lucide-react';

type MediaCategory = 'todos' | 'jogos' | 'bastidores' | 'comunidade';
type MediaItem = {
  id: string;
  type: 'foto' | 'video';
  title: string;
  description: string;
  category: Exclude<MediaCategory, 'todos'>;
  tone: string;
  featured?: boolean;
};

const demoMedia: MediaItem[] = [
  { id: '1', type: 'video', title: 'Melhores momentos da rodada', description: 'Gols, defesas e os lances que decidiram os jogos.', category: 'jogos', featured: true, tone: 'from-lime-400/35 via-emerald-900/20 to-transparent' },
  { id: '2', type: 'foto', title: 'Aquecimento antes do apito', description: 'Preparação das equipes minutos antes da partida.', category: 'bastidores', tone: 'from-blue-500/30 via-cyan-900/15 to-transparent' },
  { id: '3', type: 'foto', title: 'A energia das arquibancadas', description: 'Torcida e comunidade fazendo parte da competição.', category: 'comunidade', tone: 'from-amber-400/30 via-orange-900/15 to-transparent' },
  { id: '4', type: 'video', title: 'Gol da rodada', description: 'O lance escolhido para representar a rodada.', category: 'jogos', tone: 'from-fuchsia-500/25 via-purple-900/15 to-transparent' },
  { id: '5', type: 'foto', title: 'Vestiário e concentração', description: 'Os detalhes que antecedem a entrada em quadra.', category: 'bastidores', tone: 'from-rose-500/25 via-red-950/15 to-transparent' },
];

const filters: { id: MediaCategory; label: string }[] = [
  { id: 'todos', label: 'Todos' },
  { id: 'jogos', label: 'Jogos' },
  { id: 'bastidores', label: 'Bastidores' },
  { id: 'comunidade', label: 'Comunidade' },
];

export function Gallery() {
  const [activeFilter, setActiveFilter] = useState<MediaCategory>('todos');
  const filtered = useMemo(
    () => demoMedia.filter(item => activeFilter === 'todos' || item.category === activeFilter),
    [activeFilter],
  );

  return (
    <main className="page-enter flex-1 pb-16">
      <section className="app-shell grid gap-8 pb-10 pt-14 lg:grid-cols-[1fr_auto] lg:items-end lg:pt-20">
        <div>
          <p className="eyebrow">Histórias além do placar</p>
          <h1 className="font-display mt-3 text-6xl leading-[.88] md:text-8xl">MÍDIA<br /><span className="text-[var(--primary)]">ZENITH</span></h1>
          <p className="mt-5 max-w-xl text-sm leading-6 text-[var(--muted-foreground)]">
            Um espaço preparado para reunir fotos, melhores momentos e histórias das competições.
          </p>
        </div>
        <div className="rounded-2xl border border-amber-400/20 bg-amber-400/5 px-4 py-3 text-xs leading-5 text-amber-200/80">
          <span className="flex items-center gap-2 font-bold text-amber-300"><Sparkles className="h-3.5 w-3.5" /> Conteúdo demonstrativo</span>
          <span className="mt-1 block max-w-64">A publicação oficial será conectada ao módulo de mídia.</span>
        </div>
      </section>

      <section className="app-shell">
        <div className="mb-7 flex items-center gap-1 overflow-x-auto rounded-2xl border border-[var(--border)] bg-[var(--surface-glass)] p-1.5">
          {filters.map(filter => (
            <button key={filter.id} type="button" onClick={() => setActiveFilter(filter.id)} className={`shrink-0 rounded-xl px-4 py-2.5 text-xs font-extrabold transition-colors ${activeFilter === filter.id ? 'bg-[var(--primary)] text-[var(--primary-foreground)]' : 'text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]'}`}>
              {filter.label}
            </button>
          ))}
        </div>

        <div className="grid auto-rows-[18rem] gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item, index) => (
            <article key={item.id} className={`group relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--card)] ${index === 0 && activeFilter === 'todos' ? 'md:col-span-2 lg:row-span-2 lg:min-h-[37rem]' : ''}`}>
              <div className={`absolute inset-0 bg-gradient-to-br ${item.tone}`} />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,.08)_1px,transparent_0)] bg-[length:14px_14px] opacity-50" />
              <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-3 py-1.5 text-[.6rem] font-black uppercase tracking-[.14em] text-white backdrop-blur-md">
                {item.type === 'video' ? <Video className="h-3.5 w-3.5" /> : <ImageIcon className="h-3.5 w-3.5" />}{item.type}
              </div>
              <div className="absolute inset-0 grid place-items-center">
                <span className="grid h-16 w-16 place-items-center rounded-full border border-white/15 bg-black/25 text-white backdrop-blur-md transition-transform duration-300 group-hover:scale-110">
                  {item.type === 'video' ? <Play className="ml-1 h-6 w-6 fill-current" /> : <Camera className="h-6 w-6" />}
                </span>
              </div>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/75 to-transparent p-5 pt-24 sm:p-6">
                <p className="text-[.62rem] font-black uppercase tracking-[.15em] text-[var(--primary)]">{categoryLabel(item.category)}</p>
                <h2 className={`${index === 0 && activeFilter === 'todos' ? 'mt-2 text-3xl sm:text-4xl' : 'mt-1 text-xl'} font-black leading-tight text-white`}>{item.title}</h2>
                <p className="mt-2 max-w-xl text-xs leading-5 text-white/60">{item.description}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 flex items-start gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface-glass)] p-5">
          <Clock3 className="mt-0.5 h-5 w-5 shrink-0 text-[var(--primary)]" />
          <div><strong className="text-sm">Publicação em preparação</strong><p className="mt-1 text-xs leading-5 text-[var(--muted-foreground)]">Quando o módulo estiver conectado, esta página exibirá registros oficiais com data, partida e créditos do conteúdo.</p></div>
        </div>
      </section>
    </main>
  );
}

function categoryLabel(category: MediaItem['category']) {
  return ({ jogos: 'Dentro de quadra', bastidores: 'Bastidores', comunidade: 'Comunidade' })[category];
}
