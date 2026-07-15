import { useState } from 'react';
import { Star, Calendar, MapPin, Video, Image as ImageIcon } from 'lucide-react';
import { PhotoUpload } from './PhotoUpload';

interface GalleryItem {
  id: string;
  type: 'photo' | 'video';
  title: string;
  date: string;
  location: string;
  category: string;
  featured: boolean;
  imageUrl?: string;
}

const mockGalleryItems: GalleryItem[] = [
  {
    id: '1',
    type: 'photo',
    title: 'Estrela Mundial da Praia de Praia',
    date: '15/04',
    location: 'SuperLiga',
    category: 'feminino',
    featured: true,
  },
  {
    id: '2',
    type: 'video',
    title: 'Superliga Feminina',
    date: '12/04',
    location: 'São Paulo',
    category: 'feminino',
    featured: true,
  },
  {
    id: '3',
    type: 'photo',
    title: 'Estrela Mundial da Praia de Praia',
    date: '10/04',
    location: 'SuperLiga',
    category: 'feminino',
    featured: true,
  },
  {
    id: '4',
    type: 'photo',
    title: 'Celubes - Final da Superliga Masculina',
    date: '08/04',
    location: 'Rio de Janeiro',
    category: 'masculino',
    featured: false,
  },
  {
    id: '5',
    type: 'photo',
    title: 'Campeonato Brasileiro Sub-21',
    date: '05/04',
    location: 'Belo Horizonte',
    category: 'evento',
    featured: false,
  },
  {
    id: '6',
    type: 'video',
    title: 'Melhores Momentos - Semifinal',
    date: '03/04',
    location: 'Brasília',
    category: 'evento',
    featured: true,
  },
  {
    id: '7',
    type: 'photo',
    title: 'Treino da Seleção Nacional',
    date: '01/04',
    location: 'Centro de Treinamento',
    category: 'masculino',
    featured: false,
  },
  {
    id: '8',
    type: 'photo',
    title: 'Abertura do Campeonato Regional',
    date: '28/03',
    location: 'Porto Alegre',
    category: 'evento',
    featured: false,
  },
];

export function Gallery() {
  const [activeFilter, setActiveFilter] = useState('todos');

  const filters = [
    { id: 'todos', label: 'Todos' },
    { id: 'feminino', label: 'Feminino' },
    { id: 'masculino', label: 'Masculino' },
    { id: 'evento', label: 'Evento' },
    { id: 'destaque', label: 'Destaque' },
  ];

  const filteredItems = mockGalleryItems.filter((item) => {
    if (activeFilter === 'todos') return true;
    if (activeFilter === 'destaque') return item.featured;
    return item.category === activeFilter;
  });

  return (
    <div className="p-8">
      <PhotoUpload />
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl text-[var(--foreground)] font-semibold mb-2">
            Galeria de Fotos e Vídeos
          </h1>
          <p className="text-[var(--muted-foreground)] text-sm">Momentos marcantes das competições</p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                activeFilter === filter.id
                  ? 'bg-[var(--primary)] text-[var(--primary-foreground)]'
                  : 'bg-[var(--surface-glass)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--surface-glass-hover)] border border-[var(--border)]'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group bg-[var(--surface-glass)] backdrop-blur-xl rounded-2xl border border-[var(--border)] overflow-hidden hover:border-[var(--muted)] transition-all cursor-pointer"
            >
              {/* Image/Video Thumbnail */}
              <div className="relative aspect-video bg-[var(--muted)] flex items-center justify-center overflow-hidden">
                {/* Placeholder for image */}
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/10 to-[var(--secondary)]/10 group-hover:scale-105 transition-transform duration-300">
                  {item.type === 'video' ? (
                    <div className="flex items-center justify-center h-full">
                      <Video className="w-12 h-12 text-[var(--muted-foreground)]" />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <ImageIcon className="w-12 h-12 text-[var(--muted-foreground)]" />
                    </div>
                  )}
                </div>

                {/* Featured Badge */}
                {item.featured && (
                  <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 bg-[var(--primary)] rounded-lg text-xs font-medium text-[var(--primary-foreground)]">
                    <Star className="w-3 h-3 fill-current" />
                    Destaque
                  </div>
                )}

                {/* Video Badge */}
                {item.type === 'video' && (
                  <div className="absolute top-3 right-3 p-2 bg-black/50 backdrop-blur-sm rounded-lg">
                    <Video className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="text-[var(--foreground)] font-medium text-sm mb-3 line-clamp-2 group-hover:text-[var(--primary)] transition-colors">
                  {item.title}
                </h3>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-xs text-[var(--muted-foreground)]">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{item.date}</span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-[var(--muted-foreground)]">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{item.location}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-[var(--surface-glass)] backdrop-blur-xl rounded-2xl border border-[var(--border)] p-6 hover:bg-[var(--surface-glass-hover)] transition-all">
            <div className="text-xs text-[var(--muted-foreground)] mb-2 font-medium">Total de Fotos</div>
            <div className="text-3xl font-semibold text-[var(--foreground)] mb-1">1,247</div>
            <div className="text-xs text-[var(--success)]">+45 esta semana</div>
          </div>

          <div className="bg-[var(--surface-glass)] backdrop-blur-xl rounded-2xl border border-[var(--border)] p-6 hover:bg-[var(--surface-glass-hover)] transition-all">
            <div className="text-xs text-[var(--muted-foreground)] mb-2 font-medium">Total de Vídeos</div>
            <div className="text-3xl font-semibold text-[var(--foreground)] mb-1">324</div>
            <div className="text-xs text-[var(--success)]">+12 esta semana</div>
          </div>

          <div className="bg-[var(--surface-glass)] backdrop-blur-xl rounded-2xl border border-[var(--border)] p-6 hover:bg-[var(--surface-glass-hover)] transition-all">
            <div className="text-xs text-[var(--muted-foreground)] mb-2 font-medium">Eventos Cobertos</div>
            <div className="text-3xl font-semibold text-[var(--foreground)] mb-1">89</div>
            <div className="text-xs text-[var(--muted-foreground)]">este ano</div>
          </div>

          <div className="bg-[var(--surface-glass)] backdrop-blur-xl rounded-2xl border border-[var(--border)] p-6 hover:bg-[var(--surface-glass-hover)] transition-all">
            <div className="text-xs text-[var(--muted-foreground)] mb-2 font-medium">Visualizações</div>
            <div className="text-3xl font-semibold text-[var(--foreground)] mb-1">2.5M</div>
            <div className="text-xs text-[var(--success)]">+15% vs mês anterior</div>
          </div>
        </div>
      </div>
    </div>
  );
}
