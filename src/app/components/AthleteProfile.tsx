import { User, Shield, Calendar, AlertCircle, CheckCircle, FileText, Trophy, XCircle } from 'lucide-react';

interface AthleteProfileProps {
  athlete?: {
    id: string;
    name: string;
    photo?: string;
    club: string;
    position: string;
    number: number;
    birthDate: string;
    cpf: string;
    status: 'APTO' | 'SUSPENSO' | 'PENDENTE';
    suspensionReason?: string;
    suspensionGames?: number;
    documents: {
      rg: 'validated' | 'pending' | 'missing';
      contract: 'validated' | 'pending' | 'missing';
    };
    stats: {
      matches: number;
      goals: number;
      yellowCards: number;
      redCards: number;
    };
    careerTimeline: {
      season: string;
      club: string;
      goals: number;
    }[];
  };
}

export function AthleteProfile({ athlete }: AthleteProfileProps) {
  if (!athlete) {
    return (
      <div className="bg-[#121212] rounded-lg border border-[#2A2A2A] p-12 text-center">
        <User className="w-16 h-16 text-gray-700 mx-auto mb-4" />
        <p className="text-gray-500 uppercase tracking-wide text-sm">Nenhum atleta selecionado</p>
      </div>
    );
  }

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'APTO':
        return {
          bg: 'bg-[#4169E1]/20',
          border: 'border-[#4169E1]',
          text: 'text-[#4169E1]',
          icon: CheckCircle,
        };
      case 'SUSPENSO':
        return {
          bg: 'bg-[#DC143C]/20',
          border: 'border-[#DC143C]',
          text: 'text-[#DC143C]',
          icon: XCircle,
        };
      default:
        return {
          bg: 'bg-[#FFD700]/20',
          border: 'border-[#FFD700]',
          text: 'text-[#FFD700]',
          icon: AlertCircle,
        };
    }
  };

  const getDocumentStatus = (docStatus: string) => {
    switch (docStatus) {
      case 'validated':
        return { color: 'text-[#4169E1]', label: 'VALIDADO', icon: CheckCircle };
      case 'pending':
        return { color: 'text-[#FFD700]', label: 'PENDENTE', icon: AlertCircle };
      default:
        return { color: 'text-[#DC143C]', label: 'AUSENTE', icon: XCircle };
    }
  };

  const statusConfig = getStatusConfig(athlete.status);
  const StatusIcon = statusConfig.icon;
  const rgStatus = getDocumentStatus(athlete.documents.rg);
  const contractStatus = getDocumentStatus(athlete.documents.contract);
  const RgIcon = rgStatus.icon;
  const ContractIcon = contractStatus.icon;

  return (
    <div className="bg-[#121212] rounded-lg border border-[#2A2A2A] overflow-hidden">
      <div className="p-6 bg-black/60 border-b border-[#2A2A2A]">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-5 h-5 text-[#4169E1]" />
          <h3 className="font-display text-lg text-white tracking-wider">PERFIL DO ATLETA</h3>
        </div>

        <div className="flex gap-6">
          <div className="w-32 h-32 bg-gradient-to-br from-[#2A2A2A] to-[#1E1E1E] rounded-lg flex items-center justify-center border-2 border-[#2A2A2A]">
            {athlete.photo ? (
              <img src={athlete.photo} alt={athlete.name} className="w-full h-full object-cover rounded-lg" />
            ) : (
              <User className="w-16 h-16 text-gray-700" />
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h2 className="font-display text-2xl text-white tracking-wide mb-1">{athlete.name}</h2>
                <p className="text-sm text-gray-400 uppercase tracking-wide">{athlete.club}</p>
              </div>
              <div className={`px-4 py-2 rounded ${statusConfig.bg} border-2 ${statusConfig.border} flex items-center gap-2 animate-pulse`}>
                <StatusIcon className={`w-5 h-5 ${statusConfig.text}`} />
                <span className={`font-bold text-sm uppercase tracking-wider ${statusConfig.text}`}>
                  {athlete.status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Posição</p>
                <p className="text-white font-semibold uppercase tracking-wide text-sm">{athlete.position}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Número</p>
                <p className="font-display text-xl text-[#4169E1]">{athlete.number}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Nascimento</p>
                <p className="text-white text-sm">{athlete.birthDate}</p>
              </div>
            </div>
          </div>
        </div>

        {athlete.status === 'SUSPENSO' && athlete.suspensionReason && (
          <div className="mt-4 p-4 bg-[#DC143C]/10 border border-[#DC143C] rounded flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-[#DC143C]" />
            <div className="flex-1">
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Motivo da Suspensão</p>
              <p className="text-white font-semibold text-sm">{athlete.suspensionReason}</p>
            </div>
            <div className="text-right">
              <p className="font-display text-2xl text-[#DC143C]">{athlete.suspensionGames}</p>
              <p className="text-xs text-gray-400 uppercase tracking-wide">
                {athlete.suspensionGames === 1 ? 'JOGO' : 'JOGOS'}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 border-b border-[#2A2A2A]">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-4 h-4 text-[#4169E1]" />
          <h4 className="font-semibold text-white uppercase tracking-wide text-sm">Documentação</h4>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#1E1E1E] rounded-lg p-4 border border-[#2A2A2A]">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-gray-400 uppercase tracking-wide">RG / Identidade</p>
              <RgIcon className={`w-4 h-4 ${rgStatus.color}`} />
            </div>
            <p className={`text-sm font-bold uppercase tracking-wide ${rgStatus.color}`}>{rgStatus.label}</p>
          </div>

          <div className="bg-[#1E1E1E] rounded-lg p-4 border border-[#2A2A2A]">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-gray-400 uppercase tracking-wide">Contrato</p>
              <ContractIcon className={`w-4 h-4 ${contractStatus.color}`} />
            </div>
            <p className={`text-sm font-bold uppercase tracking-wide ${contractStatus.color}`}>
              {contractStatus.label}
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 border-b border-[#2A2A2A]">
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="w-4 h-4 text-[#4169E1]" />
          <h4 className="font-semibold text-white uppercase tracking-wide text-sm">Estatísticas</h4>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <div className="bg-[#1E1E1E] rounded-lg p-4 text-center border border-[#2A2A2A]">
            <p className="font-display text-2xl text-white mb-1">{athlete.stats.matches}</p>
            <p className="text-xs text-gray-400 uppercase tracking-wide">Partidas</p>
          </div>
          <div className="bg-[#1E1E1E] rounded-lg p-4 text-center border border-[#2A2A2A]">
            <p className="font-display text-2xl text-[#4169E1] mb-1">{athlete.stats.goals}</p>
            <p className="text-xs text-gray-400 uppercase tracking-wide">Gols</p>
          </div>
          <div className="bg-[#1E1E1E] rounded-lg p-4 text-center border border-[#2A2A2A]">
            <p className="font-display text-2xl text-[#FFD700] mb-1">{athlete.stats.yellowCards}</p>
            <p className="text-xs text-gray-400 uppercase tracking-wide">Amarelos</p>
          </div>
          <div className="bg-[#1E1E1E] rounded-lg p-4 text-center border border-[#2A2A2A]">
            <p className="font-display text-2xl text-[#DC143C] mb-1">{athlete.stats.redCards}</p>
            <p className="text-xs text-gray-400 uppercase tracking-wide">Vermelhos</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-4 h-4 text-[#4169E1]" />
          <h4 className="font-semibold text-white uppercase tracking-wide text-sm">Timeline de Carreira</h4>
        </div>

        <div className="space-y-3">
          {athlete.careerTimeline.map((entry, idx) => (
            <div key={idx} className="flex items-center gap-4 bg-[#1E1E1E] rounded-lg p-3 border border-[#2A2A2A]">
              <div className="w-2 h-2 bg-[#4169E1] rounded-full"></div>
              <div className="flex-1">
                <p className="text-white font-semibold text-sm uppercase tracking-wide">{entry.club}</p>
                <p className="text-xs text-gray-400 uppercase tracking-wide">{entry.season}</p>
              </div>
              <div className="text-right">
                <p className="font-display text-lg text-[#4169E1]">{entry.goals}</p>
                <p className="text-xs text-gray-400 uppercase tracking-wide">Gols</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
