import { useRef, useEffect } from 'react';
import { Eye, Zap } from 'lucide-react';

export interface Match {
  id_partida: string;
  id_campeonato: string;
  id_mandante: string;
  id_visitante: string;
  data: string;
  hora: string;
  local: string;
  status: 'agendado' | 'em_andamento' | 'encerrado' | 'cancelado';
  gols_mandante: number;
  gols_visitante: number;
  mandante?: { nome: string };
  visitante?: { nome: string };
  campeonato?: { nome: string; categoria?: string };
}

interface LiveMatchCardsProps {
  matches: Match[];
}

export function LiveMatchCards({ matches }: LiveMatchCardsProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // 1. SCROLL COM A RODINHA DO MOUSE (VERTICAL -> HORIZONTAL)
    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        container.scrollLeft += e.deltaY;
      }
    };

    // 2. SCROLL ARRASTANDO COM O PONTEIRO DO MOUSE (DRAG TO SCROLL)
    let isDown = false;
    let startX: number;
    let scrollLeft: number;

    const handleMouseDown = (e: MouseEvent) => {
      isDown = true;
      container.classList.add('active');
      startX = e.pageX - container.offsetLeft;
      scrollLeft = container.scrollLeft;
    };

    const handleMouseLeave = () => {
      isDown = false;
      container.classList.remove('active');
    };

    const handleMouseUp = () => {
      isDown = false;
      container.classList.remove('active');
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - container.offsetLeft;
      const walk = (x - startX) * 1.5; // Ajuste de velocidade do arraste
      container.scrollLeft = scrollLeft - walk;
    };

    // Adiciona os Eventos de Escuta no Container
    container.addEventListener('wheel', handleWheel, { passive: false });
    container.addEventListener('mousedown', handleMouseDown);
    container.addEventListener('mouseleave', handleMouseLeave);
    container.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('mousemove', handleMouseMove);

    return () => {
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('mousedown', handleMouseDown);
      container.removeEventListener('mouseleave', handleMouseLeave);
      container.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Gera as iniciais do clube dinamicamente caso não possua imagem
  const getTeamLogo = (teamName: string) => {
    const sigla = teamName
      ?.split(' ')
      .map((p) => p[0])
      .slice(0, 3)
      .join('')
      .toUpperCase() || 'TM';

    return (
      <div className="w-16 h-16 rounded-2xl bg-[var(--muted)] border border-[var(--border)] flex items-center justify-center shrink-0 select-none">
        <span className="text-lg font-bold text-[var(--foreground)]">{sigla}</span>
      </div>
    );
  };

  if (!matches || matches.length === 0) {
    return (
      <div className="p-8 text-center bg-[var(--surface-glass)] border border-[var(--border)] rounded-2xl text-[var(--muted-foreground)] text-sm mx-auto max-w-[90%]">
        Nenhuma partida em andamento no momento.
      </div>
    );
  }

  return (
    /* O CONTAINER DE EVASÃO LATERAL:
       - 'w-[100vw]' e 'left-1/2 -translate-x-1/2' rompem a barreira da div de 90%.
       - 'px-[5vw]' faz com que o primeiro cartão se alinhe com o título 'Partidas ao Vivo'.
       - 'cursor-grab active:cursor-grabbing' indica visualmente que o bloco pode ser arrastado.
    */
    <div
      ref={scrollContainerRef}
      className="w-[100vw] relative left-1/2 -translate-x-1/2 flex flex-nowrap gap-6 overflow-x-auto pb-4 scrollbar-hide px-[5vw] cursor-grab active:cursor-grabbing select-none"
    >
      {matches.map((match) => {
        // Consumindo diretamente o novo mapeamento limpo do DTO do Back-end
        const homeName = match.mandante?.nome || 'Mandante';
        const awayName = match.visitante?.nome || 'Visitante';
        const championshipName = match.campeonato?.nome || 'Zenith League';
        const categoryName = match.campeonato?.categoria || 'Profissional';
        
        const formattedDate = match.data
          ? new Date(match.data).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', timeZone: 'UTC' })
          : 'A definir';

        return (
          /* 'pointer-events-auto' garante que cliques nos botões internos continuem funcionando de forma independente */
          <div
            key={match.id_partida}
            className="flex-shrink-0 w-[580px] bg-[var(--surface-glass)] backdrop-blur-xl rounded-2xl border border-[var(--border)] overflow-hidden shadow-xl hover:border-[var(--muted)] hover:bg-[var(--surface-glass-hover)] transition-all pointer-events-auto first:ml-0"
          >
            {/* Header do Card */}
            <div className="px-5 py-3 bg-[var(--muted)] border-b border-[var(--border)]">
              <p className="text-xs font-semibold text-[var(--foreground)] uppercase tracking-wider">
                {championshipName} - {categoryName}
              </p>
            </div>

            {/* Conteúdo Central (Placar Minimalista) */}
            <div className="p-6">
              <div className="grid grid-cols-5 gap-4 items-center mb-4">
                
                {/* Mandante */}
                <div className="col-span-2 flex flex-col items-center text-center gap-2">
                  {getTeamLogo(homeName)}
                  <p className="font-semibold text-[var(--foreground)] text-sm leading-tight h-10 flex items-center justify-center line-clamp-2">
                    {homeName}
                  </p>
                </div>

                {/* Placar Central (Sem a caixa cinza) */}
                <div className="col-span-1 flex flex-col items-center justify-center shrink-0">
                  <p className="text-3xl text-[var(--foreground)] text-center font-bold tracking-tight whitespace-nowrap select-none">
                    {match.gols_mandante}
                    <span className="text-[var(--muted-foreground)] mx-3 font-light">×</span>
                    {match.gols_visitante}
                  </p>
                </div>

                {/* Visitante */}
                <div className="col-span-2 flex flex-col items-center text-center gap-2">
                  {getTeamLogo(awayName)}
                  <p className="font-semibold text-[var(--foreground)] text-sm leading-tight h-10 flex items-center justify-center line-clamp-2">
                    {awayName}
                  </p>
                </div>

              </div>

              {/* Rodapé do Card */}
              <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
                <div className="text-left">
                  <p className="text-xs text-[var(--muted-foreground)] mb-1 font-medium">
                    {formattedDate} às {match.hora.slice(0, 5)}h
                  </p>
                  <p className="text-xs text-[var(--muted-foreground)] truncate max-w-[200px]">
                    📍 {match.local || 'Local não informado'}
                  </p>
                </div>

                {match.status === 'em_andamento' ? (
                  <button className="px-4 py-2 bg-[var(--success)] hover:opacity-90 text-white rounded-lg font-medium text-xs transition-all flex items-center gap-2 active:scale-95">
                    <Zap className="w-4 h-4 animate-pulse" />
                    Em Direto
                  </button>
                ) : (
                  <button className="px-4 py-2 bg-[var(--surface-glass-hover)] hover:bg-[var(--muted)] border border-[var(--border)] text-[var(--foreground)] rounded-lg font-medium text-xs transition-all flex items-center gap-2 active:scale-95">
                    <Eye className="w-4 h-4" />
                    Ver Detalhes
                  </button>
                )}
              </div>

            </div>
          </div>
        );
      })}
    </div>
  );
}