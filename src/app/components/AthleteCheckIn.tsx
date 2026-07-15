import { User, CheckCircle, XCircle, AlertTriangle, Shield } from 'lucide-react';

interface AthleteCheckInProps {
  athlete: {
    id: string;
    name: string;
    photo?: string;
    club: string;
    number: number;
    position: string;
    status: 'APTO' | 'SUSPENSO' | 'PENDENTE';
    suspensionReason?: string;
  };
  onConfirm?: () => void;
  onReject?: () => void;
}

export function AthleteCheckIn({ athlete, onConfirm, onReject }: AthleteCheckInProps) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'APTO':
        return {
          bg: 'bg-[#4169E1]',
          border: 'border-[#4169E1]',
          text: 'text-[#4169E1]',
          icon: CheckCircle,
          pulse: false,
        };
      case 'SUSPENSO':
        return {
          bg: 'bg-[#DC143C]',
          border: 'border-[#DC143C]',
          text: 'text-[#DC143C]',
          icon: XCircle,
          pulse: true,
        };
      default:
        return {
          bg: 'bg-[#FFB800]',
          border: 'border-[#FFB800]',
          text: 'text-[#FFB800]',
          icon: AlertTriangle,
          pulse: false,
        };
    }
  };

  const config = getStatusConfig(athlete.status);
  const StatusIcon = config.icon;

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6">
      <div className={`w-full max-w-md bg-[#121212] rounded-2xl border-4 ${config.border} ${config.pulse ? 'animate-pulse' : ''} overflow-hidden shadow-2xl shadow-${config.bg}/30`}>
        <div className="p-6 bg-black/60 border-b-4 border-[#2A2A2A]">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-6 h-6 text-[#4169E1]" />
            <h2 className="font-display text-xl text-white tracking-wider">VALIDAÇÃO DE ATLETA</h2>
          </div>
        </div>

        <div className="p-8">
          <div className="relative mb-8">
            <div className="w-48 h-48 mx-auto bg-gradient-to-br from-[#2A2A2A] to-[#1E1E1E] rounded-2xl flex items-center justify-center border-4 border-[#2A2A2A] overflow-hidden">
              {athlete.photo ? (
                <img src={athlete.photo} alt={athlete.name} className="w-full h-full object-cover" />
              ) : (
                <User className="w-24 h-24 text-gray-700" />
              )}
            </div>

            {athlete.status === 'APTO' && (
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-[#4169E1] rounded-full flex items-center justify-center border-4 border-black shadow-xl shadow-[#4169E1]/50 animate-bounce">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
            )}

            {athlete.status === 'SUSPENSO' && (
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-[#DC143C] rounded-full flex items-center justify-center border-4 border-black shadow-xl shadow-[#DC143C]/50 animate-pulse">
                <XCircle className="w-10 h-10 text-white" />
              </div>
            )}
          </div>

          <div className="text-center mb-6">
            <h3 className="font-display text-3xl text-white mb-2 tracking-wide">{athlete.name}</h3>
            <p className="text-gray-400 uppercase tracking-wider text-sm mb-4">{athlete.club}</p>

            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="text-center">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Posição</p>
                <p className="text-white font-semibold uppercase text-sm">{athlete.position}</p>
              </div>
              <div className="w-px h-8 bg-[#2A2A2A]"></div>
              <div className="text-center">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Número</p>
                <p className="font-display text-2xl text-[#4169E1]">{athlete.number}</p>
              </div>
            </div>

            <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-xl ${config.bg}/20 border-2 ${config.border}`}>
              <StatusIcon className={`w-6 h-6 ${config.text}`} />
              <span className={`font-display text-2xl ${config.text} tracking-wider`}>
                {athlete.status}
              </span>
            </div>

            {athlete.status === 'SUSPENSO' && athlete.suspensionReason && (
              <div className="mt-4 p-4 bg-[#DC143C]/10 border border-[#DC143C] rounded-lg">
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Motivo</p>
                <p className="text-white font-semibold text-sm">{athlete.suspensionReason}</p>
              </div>
            )}
          </div>

          {athlete.status === 'APTO' && (
            <div className="space-y-3">
              <button
                onClick={onConfirm}
                className="w-full bg-[#4169E1] hover:bg-[#5B7FE8] text-white py-4 rounded-xl font-display text-lg tracking-wider shadow-lg shadow-[#4169E1]/30 transition-all active:scale-95"
              >
                CONFIRMAR ESCALAÇÃO
              </button>
            </div>
          )}

          {athlete.status === 'SUSPENSO' && (
            <div className="p-6 bg-[#DC143C]/10 border-2 border-[#DC143C] rounded-xl text-center">
              <AlertTriangle className="w-12 h-12 text-[#DC143C] mx-auto mb-3" />
              <p className="text-white font-bold uppercase tracking-wide mb-2">ATLETA IMPEDIDO</p>
              <p className="text-gray-400 text-sm">Este atleta não pode ser escalado devido à suspensão ativa.</p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 flex items-center gap-2 text-gray-600 text-xs uppercase tracking-wide">
        <div className="w-2 h-2 bg-[#4169E1] rounded-full animate-pulse"></div>
        Sistema Zenith OS • Verificação Biométrica
      </div>
    </div>
  );
}
