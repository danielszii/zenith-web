import { useState, useEffect } from 'react';
import {
  Save,
  Send,
  Wifi,
  WifiOff,
  Calendar,
  MapPin,
  Users,
  Plus,
  X,
  AlertCircle,
  CheckCircle,
  Clock,
  User,
  Shield,
  Printer,
  FileText,
  Trash2,
  Search,
  Check,
  Timer,
  UserX,
  Heart,
  MessageSquare,
  AlertTriangle,
} from 'lucide-react';

interface Club {
  id: string;
  name: string;
  colors: string;
  goalkeeperColors: string;
}

interface Player {
  id: string;
  number: string;
  name: string;
  document: string;
  clubId: string;
  isRegularized: boolean;
  isSuspended: boolean;
  suspensionReason?: string;
}

interface SelectedPlayer extends Player {
  isStarter: boolean;
  isCaptain: boolean;
  signed: boolean;
  isRelated: boolean;
}

interface Goal {
  id: string;
  team: 'home' | 'away';
  playerNumber: string;
  playerName: string;
  minute: string;
  period: '1T' | '2T' | 'PROR' | 'PEN';
  type: 'normal' | 'contra' | 'penal';
}

interface Card {
  id: string;
  team: 'home' | 'away';
  playerNumber: string;
  playerName: string;
  minute: string;
  period: '1T' | '2T' | 'PROR';
  type: 'yellow' | 'blue' | 'red';
  reason: string;
}

interface Substitution {
  id: string;
  team: 'home' | 'away';
  playerOutNumber: string;
  playerOutName: string;
  playerInNumber: string;
  playerInName: string;
  minute: string;
  period: '1T' | '2T' | 'PROR';
}

interface Timeout {
  id: string;
  team: 'home' | 'away';
  minute: string;
  period: '1T' | '2T' | 'PROR';
}

interface StaffCard {
  id: string;
  team: 'home' | 'away';
  staffName: string;
  role: string;
  minute: string;
  period: '1T' | '2T' | 'PROR';
  type: 'yellow' | 'red';
  reason: string;
}

interface Injury {
  id: string;
  team: 'home' | 'away';
  playerNumber: string;
  playerName: string;
  minute: string;
  period: '1T' | '2T' | 'PROR';
  description: string;
}

interface Protest {
  id: string;
  team: 'home' | 'away';
  minute: string;
  period: '1T' | '2T' | 'PROR';
  description: string;
}

interface Warning {
  id: string;
  team: 'home' | 'away';
  playerNumber: string;
  playerName: string;
  minute: string;
  period: '1T' | '2T' | 'PROR';
  reason: string;
}

// Mock data - clubes disponíveis
const mockClubs: Club[] = [
  { id: '1', name: 'Cruzeiro FC', colors: 'Azul e Branco', goalkeeperColors: 'Verde' },
  { id: '2', name: 'Flamengo Futsal', colors: 'Vermelho e Preto', goalkeeperColors: 'Amarelo' },
  { id: '3', name: 'Palmeiras Futsal', colors: 'Verde e Branco', goalkeeperColors: 'Laranja' },
  { id: '4', name: 'São Paulo FC', colors: 'Branco, Vermelho e Preto', goalkeeperColors: 'Cinza' },
  { id: '5', name: 'Corinthians Futsal', colors: 'Branco e Preto', goalkeeperColors: 'Verde Limão' },
];

// Mock data - jogadores por clube
const mockPlayers: Record<string, Player[]> = {
  '1': [ // Cruzeiro FC
    { id: 'p1', number: '1', name: 'Gabriel Silva Santos', document: '123.456.789-00', clubId: '1', isRegularized: true, isSuspended: false },
    { id: 'p2', number: '2', name: 'Lucas Martins Oliveira', document: '234.567.890-11', clubId: '1', isRegularized: true, isSuspended: false },
    { id: 'p3', number: '3', name: 'Pedro Costa Souza', document: '345.678.901-22', clubId: '1', isRegularized: true, isSuspended: false },
    { id: 'p4', number: '4', name: 'Rafael Santos Lima', document: '456.789.012-33', clubId: '1', isRegularized: true, isSuspended: false },
    { id: 'p5', number: '5', name: 'Felipe Rocha Mendes', document: '567.890.123-44', clubId: '1', isRegularized: true, isSuspended: true, suspensionReason: '3º Cartão Amarelo' },
    { id: 'p6', number: '6', name: 'João Mendes Alves', document: '678.901.234-55', clubId: '1', isRegularized: true, isSuspended: false },
    { id: 'p7', number: '7', name: 'Matheus Lima Ferreira', document: '789.012.345-66', clubId: '1', isRegularized: true, isSuspended: false },
    { id: 'p8', number: '8', name: 'Daniel Oliveira Costa', document: '890.123.456-77', clubId: '1', isRegularized: false, isSuspended: false },
    { id: 'p9', number: '9', name: 'André Ferreira Silva', document: '901.234.567-88', clubId: '1', isRegularized: true, isSuspended: false },
    { id: 'p10', number: '10', name: 'Bruno Alves Dias', document: '012.345.678-99', clubId: '1', isRegularized: true, isSuspended: false },
    { id: 'p11', number: '11', name: 'Gustavo Dias Rocha', document: '123.456.780-00', clubId: '1', isRegularized: true, isSuspended: false },
    { id: 'p12', number: '12', name: 'Carlos Eduardo Silva', document: '234.567.891-11', clubId: '1', isRegularized: true, isSuspended: false },
  ],
  '2': [ // Flamengo Futsal
    { id: 'p13', number: '1', name: 'Thiago Souza Santos', document: '345.678.902-22', clubId: '2', isRegularized: true, isSuspended: false },
    { id: 'p14', number: '2', name: 'Igor Lima Costa', document: '456.789.013-33', clubId: '2', isRegularized: true, isSuspended: false },
    { id: 'p15', number: '3', name: 'Vinicius Rocha Alves', document: '567.890.124-44', clubId: '2', isRegularized: true, isSuspended: false },
    { id: 'p16', number: '4', name: 'Marcelo Silva Dias', document: '678.901.235-55', clubId: '2', isRegularized: true, isSuspended: false },
    { id: 'p17', number: '5', name: 'Pablo Oliveira Mendes', document: '789.012.346-66', clubId: '2', isRegularized: true, isSuspended: false },
    { id: 'p18', number: '6', name: 'Diego Santos Ferreira', document: '890.123.457-77', clubId: '2', isRegularized: true, isSuspended: false },
    { id: 'p19', number: '7', name: 'Fernando Costa Lima', document: '901.234.568-88', clubId: '2', isRegularized: true, isSuspended: false },
    { id: 'p20', number: '8', name: 'Ricardo Alves Silva', document: '012.345.679-99', clubId: '2', isRegularized: true, isSuspended: false },
    { id: 'p21', number: '9', name: 'Rodrigo Dias Santos', document: '123.456.781-00', clubId: '2', isRegularized: true, isSuspended: false },
    { id: 'p22', number: '10', name: 'Alexandre Rocha Costa', document: '234.567.892-11', clubId: '2', isRegularized: true, isSuspended: false },
  ],
  '3': [], // Palmeiras Futsal
  '4': [], // São Paulo FC
  '5': [], // Corinthians Futsal
};

export function FutsalMatchReport() {
  const [isOnline, setIsOnline] = useState(true);
  const [currentTab, setCurrentTab] = useState<'info' | 'teams' | 'events' | 'summary'>('info');
  const [isSaved, setIsSaved] = useState(false);

  // Match Info
  const [matchInfo, setMatchInfo] = useState({
    reportNumber: '',
    championship: '',
    category: '',
    phase: '',
    round: '',
    date: '',
    time: '',
    venue: '',
    city: '',
    state: '',
  });

  // Selected Clubs
  const [homeClubId, setHomeClubId] = useState('');
  const [awayClubId, setAwayClubId] = useState('');

  // Referees
  const [referees, setReferees] = useState({
    referee1: { name: '', document: '' },
    referee2: { name: '', document: '' },
    timekeeper: { name: '', document: '' },
    scorer: { name: '', document: '' },
    delegate: { name: '', document: '' },
  });

  // Players
  const [homePlayers, setHomePlayers] = useState<SelectedPlayer[]>([]);
  const [awayPlayers, setAwayPlayers] = useState<SelectedPlayer[]>([]);

  // Events
  const [goals, setGoals] = useState<Goal[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [substitutions, setSubstitutions] = useState<Substitution[]>([]);
  const [timeouts, setTimeouts] = useState<Timeout[]>([]);
  const [staffCards, setStaffCards] = useState<StaffCard[]>([]);
  const [injuries, setInjuries] = useState<Injury[]>([]);
  const [protests, setProtests] = useState<Protest[]>([]);
  const [warnings, setWarnings] = useState<Warning[]>([]);

  // Score
  const [score, setScore] = useState({
    home1T: 0,
    away1T: 0,
    home2T: 0,
    away2T: 0,
    homePROR: 0,
    awayPROR: 0,
    homePEN: 0,
    awayPEN: 0,
  });

  // Fouls
  const [fouls, setFouls] = useState({
    home1T: 0,
    away1T: 0,
    home2T: 0,
    away2T: 0,
  });

  const [notes, setNotes] = useState('');
  const [showPlayerSelectionModal, setShowPlayerSelectionModal] = useState<{ team: 'home' | 'away' } | null>(null);
  const [showAddGoalModal, setShowAddGoalModal] = useState(false);
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [showAddSubModal, setShowAddSubModal] = useState(false);
  const [showAddTimeoutModal, setShowAddTimeoutModal] = useState(false);
  const [showAddStaffCardModal, setShowAddStaffCardModal] = useState(false);
  const [showAddInjuryModal, setShowAddInjuryModal] = useState(false);
  const [showAddProtestModal, setShowAddProtestModal] = useState(false);
  const [showAddWarningModal, setShowAddWarningModal] = useState(false);

  // Get selected clubs
  const homeClub = mockClubs.find(c => c.id === homeClubId);
  const awayClub = mockClubs.find(c => c.id === awayClubId);

  // Load players when club is selected
  useEffect(() => {
    if (homeClubId) {
      const clubPlayers = mockPlayers[homeClubId] || [];
      const availablePlayers = clubPlayers.filter(p => p.isRegularized && !p.isSuspended);
      const selectedPlayers: SelectedPlayer[] = availablePlayers.map(p => ({
        ...p,
        isStarter: false,
        isCaptain: false,
        signed: false,
        isRelated: false,
      }));
      setHomePlayers(selectedPlayers);
    }
  }, [homeClubId]);

  useEffect(() => {
    if (awayClubId) {
      const clubPlayers = mockPlayers[awayClubId] || [];
      const availablePlayers = clubPlayers.filter(p => p.isRegularized && !p.isSuspended);
      const selectedPlayers: SelectedPlayer[] = availablePlayers.map(p => ({
        ...p,
        isStarter: false,
        isCaptain: false,
        signed: false,
        isRelated: false,
      }));
      setAwayPlayers(selectedPlayers);
    }
  }, [awayClubId]);

  const handleSave = () => {
    const reportData = {
      matchInfo,
      homeClubId,
      awayClubId,
      referees,
      homePlayers: homePlayers.filter(p => p.isRelated),
      awayPlayers: awayPlayers.filter(p => p.isRelated),
      goals,
      cards,
      substitutions,
      timeouts,
      staffCards,
      injuries,
      protests,
      warnings,
      score,
      fouls,
      notes,
      savedAt: new Date().toISOString(),
      synced: false,
    };
    localStorage.setItem('futsal-match-report', JSON.stringify(reportData));
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleSubmit = () => {
    if (isOnline) {
      console.log('Enviando súmula para o servidor...');
    } else {
      handleSave();
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const togglePlayerRelated = (team: 'home' | 'away', playerId: string) => {
    if (team === 'home') {
      setHomePlayers(homePlayers.map(p =>
        p.id === playerId ? { ...p, isRelated: !p.isRelated } : p
      ));
    } else {
      setAwayPlayers(awayPlayers.map(p =>
        p.id === playerId ? { ...p, isRelated: !p.isRelated } : p
      ));
    }
  };

  const togglePlayerStarter = (team: 'home' | 'away', playerId: string) => {
    if (team === 'home') {
      setHomePlayers(homePlayers.map(p =>
        p.id === playerId ? { ...p, isStarter: !p.isStarter } : p
      ));
    } else {
      setAwayPlayers(awayPlayers.map(p =>
        p.id === playerId ? { ...p, isStarter: !p.isStarter } : p
      ));
    }
  };

  const setCaptain = (team: 'home' | 'away', playerId: string) => {
    if (team === 'home') {
      setHomePlayers(homePlayers.map(p => ({
        ...p,
        isCaptain: p.id === playerId
      })));
    } else {
      setAwayPlayers(awayPlayers.map(p => ({
        ...p,
        isCaptain: p.id === playerId
      })));
    }
  };

  const tabs = [
    { id: 'info' as const, label: 'Informações', icon: AlertCircle },
    { id: 'teams' as const, label: 'Equipes', icon: Users },
    { id: 'events' as const, label: 'Eventos', icon: Clock },
    { id: 'summary' as const, label: 'Resumo', icon: CheckCircle },
  ];

  const finalScoreHome = score.home1T + score.home2T + score.homePROR;
  const finalScoreAway = score.away1T + score.away2T + score.awayPROR;

  const relatedHomePlayers = homePlayers.filter(p => p.isRelated);
  const relatedAwayPlayers = awayPlayers.filter(p => p.isRelated);

  return (
    <div className="min-h-screen bg-[var(--background)] p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-[var(--surface-glass)] backdrop-blur-xl rounded-2xl border border-[var(--border)] p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[var(--primary)] rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-[var(--primary-foreground)]" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-[var(--foreground)]">Súmula de Futsal</h1>
                <p className="text-sm text-[var(--muted-foreground)]">Preenchimento completo oficial</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Online/Offline Status */}
              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${
                  isOnline
                    ? 'bg-[var(--success)]/10 border-[var(--success)]/30 text-[var(--success)]'
                    : 'bg-[var(--destructive)]/10 border-[var(--destructive)]/30 text-[var(--destructive)]'
                }`}
              >
                {isOnline ? <Wifi className="w-5 h-5" /> : <WifiOff className="w-5 h-5" />}
                <span className="text-sm font-medium">{isOnline ? 'Online' : 'Offline'}</span>
              </div>

              {/* Print Button */}
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-5 py-2.5 bg-[var(--surface-glass)] hover:bg-[var(--surface-glass-hover)] border border-[var(--border)] rounded-xl transition-all"
              >
                <Printer className="w-5 h-5 text-[var(--foreground)]" />
                <span className="text-sm font-medium text-[var(--foreground)]">Imprimir</span>
              </button>

              {/* Save Button */}
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-5 py-2.5 bg-[var(--surface-glass)] hover:bg-[var(--surface-glass-hover)] border border-[var(--border)] rounded-xl transition-all"
              >
                <Save className="w-5 h-5 text-[var(--foreground)]" />
                <span className="text-sm font-medium text-[var(--foreground)]">Salvar</span>
              </button>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                className="flex items-center gap-2 px-5 py-2.5 bg-[var(--primary)] hover:opacity-90 rounded-xl transition-all"
              >
                <Send className="w-5 h-5 text-[var(--primary-foreground)]" />
                <span className="text-sm font-medium text-[var(--primary-foreground)]">
                  {isOnline ? 'Enviar' : 'Salvar p/ Envio'}
                </span>
              </button>
            </div>
          </div>

          {/* Saved Notification */}
          {isSaved && (
            <div className="flex items-center gap-2 px-4 py-2 bg-[var(--success)]/10 border border-[var(--success)]/30 rounded-lg mb-4">
              <CheckCircle className="w-4 h-4 text-[var(--success)]" />
              <span className="text-sm text-[var(--success)]">Súmula salva localmente</span>
            </div>
          )}

          {/* Tabs */}
          <div className="flex items-center gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setCurrentTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-all ${
                    currentTab === tab.id
                      ? 'bg-[var(--primary)] text-[var(--primary-foreground)]'
                      : 'bg-[var(--muted)]/20 text-[var(--muted-foreground)] hover:bg-[var(--muted)]/30'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="bg-[var(--surface-glass)] backdrop-blur-xl rounded-2xl border border-[var(--border)] p-6">
          {/* Tab: Info */}
          {currentTab === 'info' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-semibold text-[var(--foreground)] mb-6">
                  Dados da Partida
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                      Nº da Súmula
                    </label>
                    <input
                      type="text"
                      value={matchInfo.reportNumber}
                      onChange={(e) => setMatchInfo({ ...matchInfo, reportNumber: e.target.value })}
                      placeholder="Ex: 2026001"
                      className="w-full px-4 py-3 bg-[var(--input-background)] border border-[var(--border)] rounded-xl text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                      Campeonato
                    </label>
                    <input
                      type="text"
                      value={matchInfo.championship}
                      onChange={(e) => setMatchInfo({ ...matchInfo, championship: e.target.value })}
                      placeholder="Ex: Liga Nacional de Futsal"
                      className="w-full px-4 py-3 bg-[var(--input-background)] border border-[var(--border)] rounded-xl text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                      Categoria
                    </label>
                    <input
                      type="text"
                      value={matchInfo.category}
                      onChange={(e) => setMatchInfo({ ...matchInfo, category: e.target.value })}
                      placeholder="Ex: Adulto Masculino"
                      className="w-full px-4 py-3 bg-[var(--input-background)] border border-[var(--border)] rounded-xl text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                      Fase
                    </label>
                    <input
                      type="text"
                      value={matchInfo.phase}
                      onChange={(e) => setMatchInfo({ ...matchInfo, phase: e.target.value })}
                      placeholder="Ex: Semifinal"
                      className="w-full px-4 py-3 bg-[var(--input-background)] border border-[var(--border)] rounded-xl text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                      Rodada
                    </label>
                    <input
                      type="text"
                      value={matchInfo.round}
                      onChange={(e) => setMatchInfo({ ...matchInfo, round: e.target.value })}
                      placeholder="Ex: 10ª Rodada"
                      className="w-full px-4 py-3 bg-[var(--input-background)] border border-[var(--border)] rounded-xl text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                      Data
                    </label>
                    <input
                      type="date"
                      value={matchInfo.date}
                      onChange={(e) => setMatchInfo({ ...matchInfo, date: e.target.value })}
                      className="w-full px-4 py-3 bg-[var(--input-background)] border border-[var(--border)] rounded-xl text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                      Horário
                    </label>
                    <input
                      type="time"
                      value={matchInfo.time}
                      onChange={(e) => setMatchInfo({ ...matchInfo, time: e.target.value })}
                      className="w-full px-4 py-3 bg-[var(--input-background)] border border-[var(--border)] rounded-xl text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                      Local (Ginásio/Quadra)
                    </label>
                    <input
                      type="text"
                      value={matchInfo.venue}
                      onChange={(e) => setMatchInfo({ ...matchInfo, venue: e.target.value })}
                      placeholder="Ex: Ginásio Poliesportivo Municipal"
                      className="w-full px-4 py-3 bg-[var(--input-background)] border border-[var(--border)] rounded-xl text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                      Cidade
                    </label>
                    <input
                      type="text"
                      value={matchInfo.city}
                      onChange={(e) => setMatchInfo({ ...matchInfo, city: e.target.value })}
                      placeholder="Ex: São Paulo"
                      className="w-full px-4 py-3 bg-[var(--input-background)] border border-[var(--border)] rounded-xl text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                      Estado
                    </label>
                    <input
                      type="text"
                      value={matchInfo.state}
                      onChange={(e) => setMatchInfo({ ...matchInfo, state: e.target.value })}
                      placeholder="Ex: SP"
                      maxLength={2}
                      className="w-full px-4 py-3 bg-[var(--input-background)] border border-[var(--border)] rounded-xl text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                    />
                  </div>
                </div>
              </div>

              {/* Teams Selection */}
              <div>
                <h2 className="text-xl font-semibold text-[var(--foreground)] mb-6">
                  Seleção de Equipes
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Home Team */}
                  <div className="bg-[var(--muted)]/20 rounded-xl p-6 border border-[var(--border)]">
                    <h3 className="font-semibold text-[var(--foreground)] mb-4">Equipe Mandante</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                          Selecione o Clube
                        </label>
                        <select
                          value={homeClubId}
                          onChange={(e) => setHomeClubId(e.target.value)}
                          className="w-full px-4 py-3 bg-[var(--input-background)] border border-[var(--border)] rounded-xl text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                        >
                          <option value="">Selecione...</option>
                          {mockClubs.map(club => (
                            <option key={club.id} value={club.id}>{club.name}</option>
                          ))}
                        </select>
                      </div>
                      {homeClub && (
                        <>
                          <div>
                            <label className="block text-sm text-[var(--muted-foreground)] mb-1">
                              Cor do Uniforme
                            </label>
                            <p className="text-sm font-medium text-[var(--foreground)]">{homeClub.colors}</p>
                          </div>
                          <div>
                            <label className="block text-sm text-[var(--muted-foreground)] mb-1">
                              Cor do Goleiro
                            </label>
                            <p className="text-sm font-medium text-[var(--foreground)]">{homeClub.goalkeeperColors}</p>
                          </div>
                          <div className="pt-2">
                            <p className="text-sm text-[var(--muted-foreground)]">
                              {homePlayers.length} atletas disponíveis
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Away Team */}
                  <div className="bg-[var(--muted)]/20 rounded-xl p-6 border border-[var(--border)]">
                    <h3 className="font-semibold text-[var(--foreground)] mb-4">Equipe Visitante</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                          Selecione o Clube
                        </label>
                        <select
                          value={awayClubId}
                          onChange={(e) => setAwayClubId(e.target.value)}
                          className="w-full px-4 py-3 bg-[var(--input-background)] border border-[var(--border)] rounded-xl text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                        >
                          <option value="">Selecione...</option>
                          {mockClubs.map(club => (
                            <option key={club.id} value={club.id}>{club.name}</option>
                          ))}
                        </select>
                      </div>
                      {awayClub && (
                        <>
                          <div>
                            <label className="block text-sm text-[var(--muted-foreground)] mb-1">
                              Cor do Uniforme
                            </label>
                            <p className="text-sm font-medium text-[var(--foreground)]">{awayClub.colors}</p>
                          </div>
                          <div>
                            <label className="block text-sm text-[var(--muted-foreground)] mb-1">
                              Cor do Goleiro
                            </label>
                            <p className="text-sm font-medium text-[var(--foreground)]">{awayClub.goalkeeperColors}</p>
                          </div>
                          <div className="pt-2">
                            <p className="text-sm text-[var(--muted-foreground)]">
                              {awayPlayers.length} atletas disponíveis
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Referees - código mantido igual */}
              <div>
                <h2 className="text-xl font-semibold text-[var(--foreground)] mb-6">
                  Arbitragem e Oficiais
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                      Árbitro 1
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        value={referees.referee1.name}
                        onChange={(e) => setReferees({
                          ...referees,
                          referee1: { ...referees.referee1, name: e.target.value }
                        })}
                        placeholder="Nome completo"
                        className="w-full px-4 py-3 bg-[var(--input-background)] border border-[var(--border)] rounded-xl text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                      />
                      <input
                        type="text"
                        value={referees.referee1.document}
                        onChange={(e) => setReferees({
                          ...referees,
                          referee1: { ...referees.referee1, document: e.target.value }
                        })}
                        placeholder="CPF/RG"
                        className="w-full px-4 py-3 bg-[var(--input-background)] border border-[var(--border)] rounded-xl text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                      Árbitro 2
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        value={referees.referee2.name}
                        onChange={(e) => setReferees({
                          ...referees,
                          referee2: { ...referees.referee2, name: e.target.value }
                        })}
                        placeholder="Nome completo"
                        className="w-full px-4 py-3 bg-[var(--input-background)] border border-[var(--border)] rounded-xl text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                      />
                      <input
                        type="text"
                        value={referees.referee2.document}
                        onChange={(e) => setReferees({
                          ...referees,
                          referee2: { ...referees.referee2, document: e.target.value }
                        })}
                        placeholder="CPF/RG"
                        className="w-full px-4 py-3 bg-[var(--input-background)] border border-[var(--border)] rounded-xl text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                      Cronometrista
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        value={referees.timekeeper.name}
                        onChange={(e) => setReferees({
                          ...referees,
                          timekeeper: { ...referees.timekeeper, name: e.target.value }
                        })}
                        placeholder="Nome completo"
                        className="w-full px-4 py-3 bg-[var(--input-background)] border border-[var(--border)] rounded-xl text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                      />
                      <input
                        type="text"
                        value={referees.timekeeper.document}
                        onChange={(e) => setReferees({
                          ...referees,
                          timekeeper: { ...referees.timekeeper, document: e.target.value }
                        })}
                        placeholder="CPF/RG"
                        className="w-full px-4 py-3 bg-[var(--input-background)] border border-[var(--border)] rounded-xl text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                      Anotador
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        value={referees.scorer.name}
                        onChange={(e) => setReferees({
                          ...referees,
                          scorer: { ...referees.scorer, name: e.target.value }
                        })}
                        placeholder="Nome completo"
                        className="w-full px-4 py-3 bg-[var(--input-background)] border border-[var(--border)] rounded-xl text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                      />
                      <input
                        type="text"
                        value={referees.scorer.document}
                        onChange={(e) => setReferees({
                          ...referees,
                          scorer: { ...referees.scorer, document: e.target.value }
                        })}
                        placeholder="CPF/RG"
                        className="w-full px-4 py-3 bg-[var(--input-background)] border border-[var(--border)] rounded-xl text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                      Delegado/Fiscal
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        value={referees.delegate.name}
                        onChange={(e) => setReferees({
                          ...referees,
                          delegate: { ...referees.delegate, name: e.target.value }
                        })}
                        placeholder="Nome completo"
                        className="w-full px-4 py-3 bg-[var(--input-background)] border border-[var(--border)] rounded-xl text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                      />
                      <input
                        type="text"
                        value={referees.delegate.document}
                        onChange={(e) => setReferees({
                          ...referees,
                          delegate: { ...referees.delegate, document: e.target.value }
                        })}
                        placeholder="CPF/RG"
                        className="w-full px-4 py-3 bg-[var(--input-background)] border border-[var(--border)] rounded-xl text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab: Teams - Relacionar Atletas */}
          {currentTab === 'teams' && (
            <div className="space-y-8">
              <h2 className="text-xl font-semibold text-[var(--foreground)]">
                Relacionar Atletas para a Partida
              </h2>

              {!homeClubId && !awayClubId && (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-[var(--muted-foreground)] mx-auto mb-4 opacity-50" />
                  <p className="text-[var(--muted-foreground)]">
                    Selecione as equipes na aba "Informações" para relacionar os atletas
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Home Team Players */}
                {homeClubId && (
                  <div className="bg-[var(--muted)]/20 rounded-xl p-6 border border-[var(--border)]">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-[var(--foreground)]">
                        {homeClub?.name} - Atletas
                      </h3>
                      <button
                        onClick={() => setShowPlayerSelectionModal({ team: 'home' })}
                        className="flex items-center gap-2 px-4 py-2 bg-[var(--primary)] hover:opacity-90 rounded-lg text-[var(--primary-foreground)] text-sm font-medium transition-all"
                      >
                        <Users className="w-4 h-4" />
                        Relacionar ({relatedHomePlayers.length})
                      </button>
                    </div>

                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {relatedHomePlayers.length === 0 ? (
                        <p className="text-center text-[var(--muted-foreground)] py-8 text-sm">
                          Nenhum atleta relacionado
                        </p>
                      ) : (
                        relatedHomePlayers.map((player) => (
                          <div
                            key={player.id}
                            className="flex items-center justify-between p-3 bg-[var(--surface-glass)] rounded-lg border border-[var(--border)]"
                          >
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <div className="w-8 h-8 bg-[var(--primary)]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                <span className="text-sm font-bold text-[var(--primary)]">
                                  {player.number}
                                </span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-[var(--foreground)] truncate">
                                  {player.name}
                                  {player.isCaptain && (
                                    <span className="ml-2 text-xs px-2 py-0.5 bg-[var(--primary)]/10 text-[var(--primary)] rounded">
                                      CAPITÃO
                                    </span>
                                  )}
                                </p>
                                <p className="text-xs text-[var(--muted-foreground)]">
                                  {player.isStarter ? 'Titular' : 'Reserva'}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {/* Away Team Players */}
                {awayClubId && (
                  <div className="bg-[var(--muted)]/20 rounded-xl p-6 border border-[var(--border)]">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-[var(--foreground)]">
                        {awayClub?.name} - Atletas
                      </h3>
                      <button
                        onClick={() => setShowPlayerSelectionModal({ team: 'away' })}
                        className="flex items-center gap-2 px-4 py-2 bg-[var(--primary)] hover:opacity-90 rounded-lg text-[var(--primary-foreground)] text-sm font-medium transition-all"
                      >
                        <Users className="w-4 h-4" />
                        Relacionar ({relatedAwayPlayers.length})
                      </button>
                    </div>

                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {relatedAwayPlayers.length === 0 ? (
                        <p className="text-center text-[var(--muted-foreground)] py-8 text-sm">
                          Nenhum atleta relacionado
                        </p>
                      ) : (
                        relatedAwayPlayers.map((player) => (
                          <div
                            key={player.id}
                            className="flex items-center justify-between p-3 bg-[var(--surface-glass)] rounded-lg border border-[var(--border)]"
                          >
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <div className="w-8 h-8 bg-[var(--primary)]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                <span className="text-sm font-bold text-[var(--primary)]">
                                  {player.number}
                                </span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-[var(--foreground)] truncate">
                                  {player.name}
                                  {player.isCaptain && (
                                    <span className="ml-2 text-xs px-2 py-0.5 bg-[var(--primary)]/10 text-[var(--primary)] rounded">
                                      CAPITÃO
                                    </span>
                                  )}
                                </p>
                                <p className="text-xs text-[var(--muted-foreground)]">
                                  {player.isStarter ? 'Titular' : 'Reserva'}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Player Selection Modal */}
              {showPlayerSelectionModal && (
                <PlayerSelectionModal
                  team={showPlayerSelectionModal.team}
                  players={showPlayerSelectionModal.team === 'home' ? homePlayers : awayPlayers}
                  onClose={() => setShowPlayerSelectionModal(null)}
                  onToggleRelated={(playerId) => togglePlayerRelated(showPlayerSelectionModal.team, playerId)}
                  onToggleStarter={(playerId) => togglePlayerStarter(showPlayerSelectionModal.team, playerId)}
                  onSetCaptain={(playerId) => setCaptain(showPlayerSelectionModal.team, playerId)}
                />
              )}

              {/* Add Goal Modal */}
              {showAddGoalModal && (
                <AddGoalModal
                  onClose={() => setShowAddGoalModal(false)}
                  onAdd={(goal) => setGoals([...goals, goal])}
                  homePlayers={relatedHomePlayers}
                  awayPlayers={relatedAwayPlayers}
                  homeTeamName={homeClub?.name || 'Mandante'}
                  awayTeamName={awayClub?.name || 'Visitante'}
                />
              )}

              {/* Add Card Modal */}
              {showAddCardModal && (
                <AddCardModal
                  onClose={() => setShowAddCardModal(false)}
                  onAdd={(card) => setCards([...cards, card])}
                  homePlayers={relatedHomePlayers}
                  awayPlayers={relatedAwayPlayers}
                  homeTeamName={homeClub?.name || 'Mandante'}
                  awayTeamName={awayClub?.name || 'Visitante'}
                />
              )}

              {/* Add Substitution Modal */}
              {showAddSubModal && (
                <AddSubstitutionModal
                  onClose={() => setShowAddSubModal(false)}
                  onAdd={(sub) => setSubstitutions([...substitutions, sub])}
                  homePlayers={relatedHomePlayers}
                  awayPlayers={relatedAwayPlayers}
                  homeTeamName={homeClub?.name || 'Mandante'}
                  awayTeamName={awayClub?.name || 'Visitante'}
                />
              )}

              {/* Add Timeout Modal */}
              {showAddTimeoutModal && (
                <AddTimeoutModal
                  onClose={() => setShowAddTimeoutModal(false)}
                  onAdd={(timeout) => setTimeouts([...timeouts, timeout])}
                  homeTeamName={homeClub?.name || 'Mandante'}
                  awayTeamName={awayClub?.name || 'Visitante'}
                />
              )}

              {/* Add Staff Card Modal */}
              {showAddStaffCardModal && (
                <AddStaffCardModal
                  onClose={() => setShowAddStaffCardModal(false)}
                  onAdd={(card) => setStaffCards([...staffCards, card])}
                  homeTeamName={homeClub?.name || 'Mandante'}
                  awayTeamName={awayClub?.name || 'Visitante'}
                />
              )}

              {/* Add Injury Modal */}
              {showAddInjuryModal && (
                <AddInjuryModal
                  onClose={() => setShowAddInjuryModal(false)}
                  onAdd={(injury) => setInjuries([...injuries, injury])}
                  homePlayers={relatedHomePlayers}
                  awayPlayers={relatedAwayPlayers}
                  homeTeamName={homeClub?.name || 'Mandante'}
                  awayTeamName={awayClub?.name || 'Visitante'}
                />
              )}

              {/* Add Warning Modal */}
              {showAddWarningModal && (
                <AddWarningModal
                  onClose={() => setShowAddWarningModal(false)}
                  onAdd={(warning) => setWarnings([...warnings, warning])}
                  homePlayers={relatedHomePlayers}
                  awayPlayers={relatedAwayPlayers}
                  homeTeamName={homeClub?.name || 'Mandante'}
                  awayTeamName={awayClub?.name || 'Visitante'}
                />
              )}

              {/* Add Protest Modal */}
              {showAddProtestModal && (
                <AddProtestModal
                  onClose={() => setShowAddProtestModal(false)}
                  onAdd={(protest) => setProtests([...protests, protest])}
                  homeTeamName={homeClub?.name || 'Mandante'}
                  awayTeamName={awayClub?.name || 'Visitante'}
                />
              )}
            </div>
          )}

          {/* Tab: Events */}
          {currentTab === 'events' && (
            <div className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-[var(--foreground)]">
                  Eventos da Partida
                </h2>

                {/* Primary Actions */}
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => setShowAddGoalModal(true)}
                    disabled={relatedHomePlayers.length === 0 && relatedAwayPlayers.length === 0}
                    className="flex items-center gap-2 px-4 py-2 bg-[var(--success)] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-white text-sm font-medium transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    Gol
                  </button>
                  <button
                    onClick={() => setShowAddCardModal(true)}
                    disabled={relatedHomePlayers.length === 0 && relatedAwayPlayers.length === 0}
                    className="flex items-center gap-2 px-4 py-2 bg-[var(--destructive)] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-white text-sm font-medium transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    Cartão
                  </button>
                  <button
                    onClick={() => setShowAddSubModal(true)}
                    disabled={relatedHomePlayers.length === 0 && relatedAwayPlayers.length === 0}
                    className="flex items-center gap-2 px-4 py-2 bg-[var(--primary)] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-[var(--primary-foreground)] text-sm font-medium transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    Substituição
                  </button>

                  <div className="w-px h-8 bg-[var(--border)]"></div>

                  <button
                    onClick={() => setShowAddTimeoutModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-[var(--muted)]/30 hover:bg-[var(--muted)]/40 rounded-xl text-[var(--foreground)] text-sm font-medium transition-all"
                  >
                    <Timer className="w-4 h-4" />
                    Tempo
                  </button>
                  <button
                    onClick={() => setShowAddStaffCardModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-[var(--muted)]/30 hover:bg-[var(--muted)]/40 rounded-xl text-[var(--foreground)] text-sm font-medium transition-all"
                  >
                    <UserX className="w-4 h-4" />
                    Cartão Comissão
                  </button>
                  <button
                    onClick={() => setShowAddInjuryModal(true)}
                    disabled={relatedHomePlayers.length === 0 && relatedAwayPlayers.length === 0}
                    className="flex items-center gap-2 px-4 py-2 bg-[var(--muted)]/30 hover:bg-[var(--muted)]/40 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-[var(--foreground)] text-sm font-medium transition-all"
                  >
                    <Heart className="w-4 h-4" />
                    Lesão
                  </button>
                  <button
                    onClick={() => setShowAddWarningModal(true)}
                    disabled={relatedHomePlayers.length === 0 && relatedAwayPlayers.length === 0}
                    className="flex items-center gap-2 px-4 py-2 bg-[var(--muted)]/30 hover:bg-[var(--muted)]/40 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-[var(--foreground)] text-sm font-medium transition-all"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    Advertência
                  </button>
                  <button
                    onClick={() => setShowAddProtestModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-[var(--muted)]/30 hover:bg-[var(--muted)]/40 rounded-xl text-[var(--foreground)] text-sm font-medium transition-all"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Protesto
                  </button>
                </div>
              </div>

              {relatedHomePlayers.length === 0 && relatedAwayPlayers.length === 0 && (
                <div className="bg-[var(--muted)]/20 rounded-xl p-8 text-center border border-[var(--border)]">
                  <AlertCircle className="w-12 h-12 text-[var(--muted-foreground)] mx-auto mb-3" />
                  <p className="text-[var(--muted-foreground)]">
                    Relacione os atletas na aba "Equipes" antes de registrar eventos
                  </p>
                </div>
              )}

              {/* Goals Section */}
              {goals.length > 0 && (
                <div className="bg-[var(--surface-glass)] rounded-xl border border-[var(--border)] p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-[var(--success)]/10 rounded-lg flex items-center justify-center">
                      <span className="text-lg">⚽</span>
                    </div>
                    <h3 className="font-semibold text-[var(--foreground)]">
                      Gols ({goals.length})
                    </h3>
                  </div>
                  <div className="space-y-2">
                    {goals.map((goal) => (
                      <div
                        key={goal.id}
                        className="flex items-center justify-between p-4 bg-[var(--muted)]/20 rounded-lg border border-[var(--border)]"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`px-3 py-1 rounded-lg font-bold text-sm ${
                            goal.team === 'home' ? 'bg-blue-500/10 text-blue-500' : 'bg-red-500/10 text-red-500'
                          }`}>
                            {goal.team === 'home' ? homeClub?.name : awayClub?.name}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-1 bg-[var(--primary)]/10 text-[var(--primary)] rounded text-xs font-bold">
                              #{goal.playerNumber}
                            </span>
                            <span className="font-medium text-[var(--foreground)]">
                              {goal.playerName}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
                            <Clock className="w-4 h-4" />
                            <span>{goal.minute}' - {goal.period}</span>
                          </div>
                          {goal.type !== 'normal' && (
                            <span className="px-2 py-1 bg-[var(--accent)]/10 text-[var(--accent)] rounded text-xs font-medium">
                              {goal.type === 'contra' ? 'Gol Contra' : 'Pênalti'}
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => setGoals(goals.filter(g => g.id !== goal.id))}
                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[var(--destructive)]/10 text-[var(--muted-foreground)] hover:text-[var(--destructive)] transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Cards Section */}
              {cards.length > 0 && (
                <div className="bg-[var(--surface-glass)] rounded-xl border border-[var(--border)] p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-[var(--destructive)]/10 rounded-lg flex items-center justify-center">
                      <span className="text-lg">📋</span>
                    </div>
                    <h3 className="font-semibold text-[var(--foreground)]">
                      Cartões ({cards.length})
                    </h3>
                  </div>
                  <div className="space-y-2">
                    {cards.map((card) => (
                      <div
                        key={card.id}
                        className="flex items-center justify-between p-4 bg-[var(--muted)]/20 rounded-lg border border-[var(--border)]"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-6 h-8 rounded ${
                            card.type === 'yellow' ? 'bg-yellow-500' :
                            card.type === 'blue' ? 'bg-blue-500' :
                            'bg-red-500'
                          }`}></div>
                          <div className={`px-3 py-1 rounded-lg font-bold text-sm ${
                            card.team === 'home' ? 'bg-blue-500/10 text-blue-500' : 'bg-red-500/10 text-red-500'
                          }`}>
                            {card.team === 'home' ? homeClub?.name : awayClub?.name}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-1 bg-[var(--primary)]/10 text-[var(--primary)] rounded text-xs font-bold">
                              #{card.playerNumber}
                            </span>
                            <span className="font-medium text-[var(--foreground)]">
                              {card.playerName}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
                            <Clock className="w-4 h-4" />
                            <span>{card.minute}' - {card.period}</span>
                          </div>
                          <span className="text-sm text-[var(--muted-foreground)] italic">
                            {card.reason}
                          </span>
                        </div>
                        <button
                          onClick={() => setCards(cards.filter(c => c.id !== card.id))}
                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[var(--destructive)]/10 text-[var(--muted-foreground)] hover:text-[var(--destructive)] transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Substitutions Section */}
              {substitutions.length > 0 && (
                <div className="bg-[var(--surface-glass)] rounded-xl border border-[var(--border)] p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-[var(--primary)]/10 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-[var(--primary)]" />
                    </div>
                    <h3 className="font-semibold text-[var(--foreground)]">
                      Substituições ({substitutions.length})
                    </h3>
                  </div>
                  <div className="space-y-2">
                    {substitutions.map((sub) => (
                      <div
                        key={sub.id}
                        className="flex items-center justify-between p-4 bg-[var(--muted)]/20 rounded-lg border border-[var(--border)]"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`px-3 py-1 rounded-lg font-bold text-sm ${
                            sub.team === 'home' ? 'bg-blue-500/10 text-blue-500' : 'bg-red-500/10 text-red-500'
                          }`}>
                            {sub.team === 'home' ? homeClub?.name : awayClub?.name}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-1 bg-red-500/10 text-red-500 rounded text-xs font-bold">
                              ↓ #{sub.playerOutNumber}
                            </span>
                            <span className="text-[var(--foreground)]">
                              {sub.playerOutName}
                            </span>
                          </div>
                          <span className="text-[var(--muted-foreground)]">→</span>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-1 bg-green-500/10 text-green-500 rounded text-xs font-bold">
                              ↑ #{sub.playerInNumber}
                            </span>
                            <span className="text-[var(--foreground)]">
                              {sub.playerInName}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
                            <Clock className="w-4 h-4" />
                            <span>{sub.minute}' - {sub.period}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => setSubstitutions(substitutions.filter(s => s.id !== sub.id))}
                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[var(--destructive)]/10 text-[var(--muted-foreground)] hover:text-[var(--destructive)] transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Timeouts Section */}
              {timeouts.length > 0 && (
                <div className="bg-[var(--surface-glass)] rounded-xl border border-[var(--border)] p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center">
                      <Timer className="w-5 h-5 text-blue-500" />
                    </div>
                    <h3 className="font-semibold text-[var(--foreground)]">
                      Pedidos de Tempo ({timeouts.length})
                    </h3>
                  </div>
                  <div className="space-y-2">
                    {timeouts.map((timeout) => (
                      <div
                        key={timeout.id}
                        className="flex items-center justify-between p-4 bg-[var(--muted)]/20 rounded-lg border border-[var(--border)]"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`px-3 py-1 rounded-lg font-bold text-sm ${
                            timeout.team === 'home' ? 'bg-blue-500/10 text-blue-500' : 'bg-red-500/10 text-red-500'
                          }`}>
                            {timeout.team === 'home' ? homeClub?.name : awayClub?.name}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
                            <Clock className="w-4 h-4" />
                            <span>{timeout.minute}' - {timeout.period}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => setTimeouts(timeouts.filter(t => t.id !== timeout.id))}
                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[var(--destructive)]/10 text-[var(--muted-foreground)] hover:text-[var(--destructive)] transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Staff Cards Section */}
              {staffCards.length > 0 && (
                <div className="bg-[var(--surface-glass)] rounded-xl border border-[var(--border)] p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-orange-500/10 rounded-lg flex items-center justify-center">
                      <UserX className="w-5 h-5 text-orange-500" />
                    </div>
                    <h3 className="font-semibold text-[var(--foreground)]">
                      Cartões Comissão Técnica ({staffCards.length})
                    </h3>
                  </div>
                  <div className="space-y-2">
                    {staffCards.map((card) => (
                      <div
                        key={card.id}
                        className="flex items-center justify-between p-4 bg-[var(--muted)]/20 rounded-lg border border-[var(--border)]"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-6 h-8 rounded ${
                            card.type === 'yellow' ? 'bg-yellow-500' : 'bg-red-500'
                          }`}></div>
                          <div className={`px-3 py-1 rounded-lg font-bold text-sm ${
                            card.team === 'home' ? 'bg-blue-500/10 text-blue-500' : 'bg-red-500/10 text-red-500'
                          }`}>
                            {card.team === 'home' ? homeClub?.name : awayClub?.name}
                          </div>
                          <span className="font-medium text-[var(--foreground)]">
                            {card.staffName}
                          </span>
                          <span className="text-sm text-[var(--muted-foreground)]">
                            ({card.role})
                          </span>
                          <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
                            <Clock className="w-4 h-4" />
                            <span>{card.minute}' - {card.period}</span>
                          </div>
                          <span className="text-sm text-[var(--muted-foreground)] italic">
                            {card.reason}
                          </span>
                        </div>
                        <button
                          onClick={() => setStaffCards(staffCards.filter(c => c.id !== card.id))}
                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[var(--destructive)]/10 text-[var(--muted-foreground)] hover:text-[var(--destructive)] transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Injuries Section */}
              {injuries.length > 0 && (
                <div className="bg-[var(--surface-glass)] rounded-xl border border-[var(--border)] p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-pink-500/10 rounded-lg flex items-center justify-center">
                      <Heart className="w-5 h-5 text-pink-500" />
                    </div>
                    <h3 className="font-semibold text-[var(--foreground)]">
                      Lesões/Atendimentos ({injuries.length})
                    </h3>
                  </div>
                  <div className="space-y-2">
                    {injuries.map((injury) => (
                      <div
                        key={injury.id}
                        className="flex items-center justify-between p-4 bg-[var(--muted)]/20 rounded-lg border border-[var(--border)]"
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <div className={`px-3 py-1 rounded-lg font-bold text-sm ${
                            injury.team === 'home' ? 'bg-blue-500/10 text-blue-500' : 'bg-red-500/10 text-red-500'
                          }`}>
                            {injury.team === 'home' ? homeClub?.name : awayClub?.name}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-1 bg-[var(--primary)]/10 text-[var(--primary)] rounded text-xs font-bold">
                              #{injury.playerNumber}
                            </span>
                            <span className="font-medium text-[var(--foreground)]">
                              {injury.playerName}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
                            <Clock className="w-4 h-4" />
                            <span>{injury.minute}' - {injury.period}</span>
                          </div>
                          <span className="text-sm text-[var(--muted-foreground)] italic">
                            {injury.description}
                          </span>
                        </div>
                        <button
                          onClick={() => setInjuries(injuries.filter(i => i.id !== injury.id))}
                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[var(--destructive)]/10 text-[var(--muted-foreground)] hover:text-[var(--destructive)] transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Warnings Section */}
              {warnings.length > 0 && (
                <div className="bg-[var(--surface-glass)] rounded-xl border border-[var(--border)] p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-amber-500/10 rounded-lg flex items-center justify-center">
                      <AlertTriangle className="w-5 h-5 text-amber-500" />
                    </div>
                    <h3 className="font-semibold text-[var(--foreground)]">
                      Advertências Verbais ({warnings.length})
                    </h3>
                  </div>
                  <div className="space-y-2">
                    {warnings.map((warning) => (
                      <div
                        key={warning.id}
                        className="flex items-center justify-between p-4 bg-[var(--muted)]/20 rounded-lg border border-[var(--border)]"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`px-3 py-1 rounded-lg font-bold text-sm ${
                            warning.team === 'home' ? 'bg-blue-500/10 text-blue-500' : 'bg-red-500/10 text-red-500'
                          }`}>
                            {warning.team === 'home' ? homeClub?.name : awayClub?.name}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-1 bg-[var(--primary)]/10 text-[var(--primary)] rounded text-xs font-bold">
                              #{warning.playerNumber}
                            </span>
                            <span className="font-medium text-[var(--foreground)]">
                              {warning.playerName}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
                            <Clock className="w-4 h-4" />
                            <span>{warning.minute}' - {warning.period}</span>
                          </div>
                          <span className="text-sm text-[var(--muted-foreground)] italic">
                            {warning.reason}
                          </span>
                        </div>
                        <button
                          onClick={() => setWarnings(warnings.filter(w => w.id !== warning.id))}
                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[var(--destructive)]/10 text-[var(--muted-foreground)] hover:text-[var(--destructive)] transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Protests Section */}
              {protests.length > 0 && (
                <div className="bg-[var(--surface-glass)] rounded-xl border border-[var(--border)] p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-purple-500/10 rounded-lg flex items-center justify-center">
                      <MessageSquare className="w-5 h-5 text-purple-500" />
                    </div>
                    <h3 className="font-semibold text-[var(--foreground)]">
                      Protestos Oficiais ({protests.length})
                    </h3>
                  </div>
                  <div className="space-y-2">
                    {protests.map((protest) => (
                      <div
                        key={protest.id}
                        className="flex items-center justify-between p-4 bg-[var(--muted)]/20 rounded-lg border border-[var(--border)]"
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <div className={`px-3 py-1 rounded-lg font-bold text-sm ${
                            protest.team === 'home' ? 'bg-blue-500/10 text-blue-500' : 'bg-red-500/10 text-red-500'
                          }`}>
                            {protest.team === 'home' ? homeClub?.name : awayClub?.name}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
                            <Clock className="w-4 h-4" />
                            <span>{protest.minute}' - {protest.period}</span>
                          </div>
                          <span className="text-sm text-[var(--foreground)] flex-1">
                            {protest.description}
                          </span>
                        </div>
                        <button
                          onClick={() => setProtests(protests.filter(p => p.id !== protest.id))}
                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[var(--destructive)]/10 text-[var(--muted-foreground)] hover:text-[var(--destructive)] transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {goals.length === 0 && cards.length === 0 && substitutions.length === 0 && timeouts.length === 0 && staffCards.length === 0 && injuries.length === 0 && protests.length === 0 && warnings.length === 0 && relatedHomePlayers.length > 0 && (
                <div className="bg-[var(--muted)]/20 rounded-xl p-8 text-center border border-[var(--border)]">
                  <FileText className="w-12 h-12 text-[var(--muted-foreground)] mx-auto mb-3" />
                  <p className="text-[var(--muted-foreground)]">
                    Nenhum evento registrado ainda
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Tab: Summary */}
          {currentTab === 'summary' && (
            <div className="space-y-8">
              <h2 className="text-xl font-semibold text-[var(--foreground)]">
                Resumo Final da Súmula
              </h2>

              {/* Final Score */}
              <div className="bg-gradient-to-r from-[var(--primary)]/10 to-[var(--accent)]/10 rounded-2xl p-8 border border-[var(--border)]">
                <div className="flex items-center justify-center gap-8">
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-[var(--foreground)] mb-2">
                      {homeClub?.name || 'Mandante'}
                    </h3>
                    <div className="text-6xl font-bold text-[var(--foreground)]">
                      {finalScoreHome}
                    </div>
                  </div>

                  <div className="text-4xl font-bold text-[var(--muted-foreground)]">×</div>

                  <div className="text-center">
                    <h3 className="text-xl font-bold text-[var(--foreground)] mb-2">
                      {awayClub?.name || 'Visitante'}
                    </h3>
                    <div className="text-6xl font-bold text-[var(--foreground)]">
                      {finalScoreAway}
                    </div>
                  </div>
                </div>
              </div>

              {/* Related Players Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[var(--muted)]/20 rounded-xl p-6 border border-[var(--border)]">
                  <h3 className="font-semibold text-[var(--foreground)] mb-4">
                    {homeClub?.name || 'Mandante'} - Relacionados
                  </h3>
                  <p className="text-2xl font-bold text-[var(--foreground)]">
                    {relatedHomePlayers.length} atletas
                  </p>
                  <p className="text-sm text-[var(--muted-foreground)]">
                    {relatedHomePlayers.filter(p => p.isStarter).length} titulares
                  </p>
                </div>

                <div className="bg-[var(--muted)]/20 rounded-xl p-6 border border-[var(--border)]">
                  <h3 className="font-semibold text-[var(--foreground)] mb-4">
                    {awayClub?.name || 'Visitante'} - Relacionados
                  </h3>
                  <p className="text-2xl font-bold text-[var(--foreground)]">
                    {relatedAwayPlayers.length} atletas
                  </p>
                  <p className="text-sm text-[var(--muted-foreground)]">
                    {relatedAwayPlayers.filter(p => p.isStarter).length} titulares
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Player Selection Modal Component
function PlayerSelectionModal({
  team,
  players,
  onClose,
  onToggleRelated,
  onToggleStarter,
  onSetCaptain,
}: {
  team: 'home' | 'away';
  players: SelectedPlayer[];
  onClose: () => void;
  onToggleRelated: (playerId: string) => void;
  onToggleStarter: (playerId: string) => void;
  onSetCaptain: (playerId: string) => void;
}) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPlayers = players.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.number.includes(searchQuery)
  );

  const relatedPlayers = filteredPlayers.filter(p => p.isRelated);
  const availablePlayers = filteredPlayers.filter(p => !p.isRelated);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-[var(--background)] rounded-2xl border border-[var(--border)] p-6 w-full max-w-2xl max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-[var(--foreground)]">
            Relacionar Atletas - {relatedPlayers.length} selecionados
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[var(--muted)]/20 transition-all"
          >
            <X className="w-5 h-5 text-[var(--muted-foreground)]" />
          </button>
        </div>

        {/* Search */}
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--muted-foreground)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nome ou número..."
              className="w-full pl-10 pr-4 py-2 bg-[var(--input-background)] border border-[var(--border)] rounded-xl text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            />
          </div>
        </div>

        {/* Players List */}
        <div className="flex-1 overflow-y-auto space-y-4">
          {/* Related Players */}
          {relatedPlayers.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-[var(--foreground)] mb-2 px-1">
                Relacionados ({relatedPlayers.length})
              </h4>
              <div className="space-y-2">
                {relatedPlayers.map((player) => (
                  <div
                    key={player.id}
                    className="p-4 bg-[var(--success)]/10 rounded-xl border border-[var(--success)]/30"
                  >
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => onToggleRelated(player.id)}
                        className="w-6 h-6 rounded-lg bg-[var(--success)] flex items-center justify-center flex-shrink-0 mt-1"
                      >
                        <Check className="w-4 h-4 text-white" />
                      </button>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2 py-1 bg-[var(--primary)]/10 text-[var(--primary)] rounded text-xs font-bold">
                            #{player.number}
                          </span>
                          <p className="font-semibold text-[var(--foreground)] truncate">
                            {player.name}
                          </p>
                        </div>
                        <p className="text-xs text-[var(--muted-foreground)] mb-3">
                          {player.document}
                        </p>

                        <div className="flex items-center gap-2">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={player.isStarter}
                              onChange={() => onToggleStarter(player.id)}
                              className="w-4 h-4 rounded border-[var(--border)] bg-[var(--input-background)] text-[var(--primary)]"
                            />
                            <span className="text-sm text-[var(--foreground)]">Titular</span>
                          </label>

                          <button
                            onClick={() => onSetCaptain(player.id)}
                            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                              player.isCaptain
                                ? 'bg-[var(--primary)] text-[var(--primary-foreground)]'
                                : 'bg-[var(--muted)]/20 text-[var(--foreground)] hover:bg-[var(--muted)]/30'
                            }`}
                          >
                            {player.isCaptain ? 'É Capitão' : 'Definir Capitão'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Available Players */}
          {availablePlayers.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-[var(--foreground)] mb-2 px-1">
                Disponíveis ({availablePlayers.length})
              </h4>
              <div className="space-y-2">
                {availablePlayers.map((player) => (
                  <button
                    key={player.id}
                    onClick={() => onToggleRelated(player.id)}
                    className="w-full p-4 bg-[var(--muted)]/20 hover:bg-[var(--muted)]/30 rounded-xl border border-[var(--border)] transition-all text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-lg border-2 border-[var(--border)] flex-shrink-0"></div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2 py-1 bg-[var(--muted)] text-[var(--foreground)] rounded text-xs font-bold">
                            #{player.number}
                          </span>
                          <p className="font-semibold text-[var(--foreground)] truncate">
                            {player.name}
                          </p>
                        </div>
                        <p className="text-xs text-[var(--muted-foreground)]">
                          {player.document}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {filteredPlayers.length === 0 && (
            <p className="text-center text-[var(--muted-foreground)] py-8">
              Nenhum atleta encontrado
            </p>
          )}
        </div>

        <div className="mt-6 pt-6 border-t border-[var(--border)]">
          <button
            onClick={onClose}
            className="w-full px-4 py-3 bg-[var(--primary)] hover:opacity-90 rounded-xl text-[var(--primary-foreground)] font-medium transition-all"
          >
            Concluir
          </button>
        </div>
      </div>
    </div>
  );
}

// Add Goal Modal Component
function AddGoalModal({
  onClose,
  onAdd,
  homePlayers,
  awayPlayers,
  homeTeamName,
  awayTeamName,
}: {
  onClose: () => void;
  onAdd: (goal: Goal) => void;
  homePlayers: SelectedPlayer[];
  awayPlayers: SelectedPlayer[];
  homeTeamName: string;
  awayTeamName: string;
}) {
  const [team, setTeam] = useState<'home' | 'away'>('home');
  const [playerId, setPlayerId] = useState('');
  const [minute, setMinute] = useState('');
  const [period, setPeriod] = useState<'1T' | '2T' | 'PROR' | 'PEN'>('1T');
  const [type, setType] = useState<'normal' | 'contra' | 'penal'>('normal');

  const currentPlayers = team === 'home' ? homePlayers : awayPlayers;
  const selectedPlayer = currentPlayers.find(p => p.id === playerId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlayer || !minute) return;

    const newGoal: Goal = {
      id: Date.now().toString(),
      team,
      playerNumber: selectedPlayer.number,
      playerName: selectedPlayer.name,
      minute,
      period,
      type,
    };

    onAdd(newGoal);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-[var(--background)] rounded-2xl border border-[var(--border)] p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-[var(--foreground)]">Registrar Gol</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[var(--muted)]/20 transition-all"
          >
            <X className="w-5 h-5 text-[var(--muted-foreground)]" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
              Equipe
            </label>
            <select
              value={team}
              onChange={(e) => {
                setTeam(e.target.value as 'home' | 'away');
                setPlayerId('');
              }}
              className="w-full px-4 py-3 bg-[var(--input-background)] border border-[var(--border)] rounded-xl text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            >
              <option value="home">{homeTeamName}</option>
              <option value="away">{awayTeamName}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
              Atleta
            </label>
            <select
              value={playerId}
              onChange={(e) => setPlayerId(e.target.value)}
              className="w-full px-4 py-3 bg-[var(--input-background)] border border-[var(--border)] rounded-xl text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              required
            >
              <option value="">Selecione...</option>
              {currentPlayers.map((player) => (
                <option key={player.id} value={player.id}>
                  #{player.number} - {player.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                Minuto
              </label>
              <input
                type="text"
                value={minute}
                onChange={(e) => setMinute(e.target.value)}
                placeholder="0-50"
                className="w-full px-4 py-3 bg-[var(--input-background)] border border-[var(--border)] rounded-xl text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                Período
              </label>
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value as any)}
                className="w-full px-4 py-3 bg-[var(--input-background)] border border-[var(--border)] rounded-xl text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              >
                <option value="1T">1º Tempo</option>
                <option value="2T">2º Tempo</option>
                <option value="PROR">Prorrogação</option>
                <option value="PEN">Pênaltis</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
              Tipo de Gol
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="w-full px-4 py-3 bg-[var(--input-background)] border border-[var(--border)] rounded-xl text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            >
              <option value="normal">Normal</option>
              <option value="penal">Pênalti</option>
              <option value="contra">Gol Contra</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full px-4 py-3 bg-[var(--success)] hover:opacity-90 rounded-xl text-white font-medium transition-all"
          >
            Adicionar Gol
          </button>
        </form>
      </div>
    </div>
  );
}

// Add Card Modal Component
function AddCardModal({
  onClose,
  onAdd,
  homePlayers,
  awayPlayers,
  homeTeamName,
  awayTeamName,
}: {
  onClose: () => void;
  onAdd: (card: Card) => void;
  homePlayers: SelectedPlayer[];
  awayPlayers: SelectedPlayer[];
  homeTeamName: string;
  awayTeamName: string;
}) {
  const [team, setTeam] = useState<'home' | 'away'>('home');
  const [playerId, setPlayerId] = useState('');
  const [minute, setMinute] = useState('');
  const [period, setPeriod] = useState<'1T' | '2T' | 'PROR'>('1T');
  const [type, setType] = useState<'yellow' | 'blue' | 'red'>('yellow');
  const [reason, setReason] = useState('');

  const currentPlayers = team === 'home' ? homePlayers : awayPlayers;
  const selectedPlayer = currentPlayers.find(p => p.id === playerId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlayer || !minute || !reason) return;

    const newCard: Card = {
      id: Date.now().toString(),
      team,
      playerNumber: selectedPlayer.number,
      playerName: selectedPlayer.name,
      minute,
      period,
      type,
      reason,
    };

    onAdd(newCard);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-[var(--background)] rounded-2xl border border-[var(--border)] p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-[var(--foreground)]">Registrar Cartão</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[var(--muted)]/20 transition-all"
          >
            <X className="w-5 h-5 text-[var(--muted-foreground)]" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
              Equipe
            </label>
            <select
              value={team}
              onChange={(e) => {
                setTeam(e.target.value as 'home' | 'away');
                setPlayerId('');
              }}
              className="w-full px-4 py-3 bg-[var(--input-background)] border border-[var(--border)] rounded-xl text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            >
              <option value="home">{homeTeamName}</option>
              <option value="away">{awayTeamName}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
              Atleta
            </label>
            <select
              value={playerId}
              onChange={(e) => setPlayerId(e.target.value)}
              className="w-full px-4 py-3 bg-[var(--input-background)] border border-[var(--border)] rounded-xl text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              required
            >
              <option value="">Selecione...</option>
              {currentPlayers.map((player) => (
                <option key={player.id} value={player.id}>
                  #{player.number} - {player.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
              Tipo de Cartão
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setType('yellow')}
                className={`px-4 py-3 rounded-xl font-medium transition-all ${
                  type === 'yellow'
                    ? 'bg-yellow-500 text-white'
                    : 'bg-[var(--muted)]/20 text-[var(--foreground)] border border-[var(--border)]'
                }`}
              >
                Amarelo
              </button>
              <button
                type="button"
                onClick={() => setType('blue')}
                className={`px-4 py-3 rounded-xl font-medium transition-all ${
                  type === 'blue'
                    ? 'bg-blue-500 text-white'
                    : 'bg-[var(--muted)]/20 text-[var(--foreground)] border border-[var(--border)]'
                }`}
              >
                Azul
              </button>
              <button
                type="button"
                onClick={() => setType('red')}
                className={`px-4 py-3 rounded-xl font-medium transition-all ${
                  type === 'red'
                    ? 'bg-red-500 text-white'
                    : 'bg-[var(--muted)]/20 text-[var(--foreground)] border border-[var(--border)]'
                }`}
              >
                Vermelho
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                Minuto
              </label>
              <input
                type="text"
                value={minute}
                onChange={(e) => setMinute(e.target.value)}
                placeholder="0-50"
                className="w-full px-4 py-3 bg-[var(--input-background)] border border-[var(--border)] rounded-xl text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                Período
              </label>
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value as any)}
                className="w-full px-4 py-3 bg-[var(--input-background)] border border-[var(--border)] rounded-xl text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              >
                <option value="1T">1º Tempo</option>
                <option value="2T">2º Tempo</option>
                <option value="PROR">Prorrogação</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
              Motivo
            </label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Ex: Falta, Conduta antidesportiva..."
              className="w-full px-4 py-3 bg-[var(--input-background)] border border-[var(--border)] rounded-xl text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full px-4 py-3 bg-[var(--destructive)] hover:opacity-90 rounded-xl text-white font-medium transition-all"
          >
            Adicionar Cartão
          </button>
        </form>
      </div>
    </div>
  );
}

// Add Substitution Modal Component
function AddSubstitutionModal({
  onClose,
  onAdd,
  homePlayers,
  awayPlayers,
  homeTeamName,
  awayTeamName,
}: {
  onClose: () => void;
  onAdd: (sub: Substitution) => void;
  homePlayers: SelectedPlayer[];
  awayPlayers: SelectedPlayer[];
  homeTeamName: string;
  awayTeamName: string;
}) {
  const [team, setTeam] = useState<'home' | 'away'>('home');
  const [playerOutId, setPlayerOutId] = useState('');
  const [playerInId, setPlayerInId] = useState('');
  const [minute, setMinute] = useState('');
  const [period, setPeriod] = useState<'1T' | '2T' | 'PROR'>('1T');

  const currentPlayers = team === 'home' ? homePlayers : awayPlayers;
  const selectedPlayerOut = currentPlayers.find(p => p.id === playerOutId);
  const selectedPlayerIn = currentPlayers.find(p => p.id === playerInId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlayerOut || !selectedPlayerIn || !minute) return;

    const newSub: Substitution = {
      id: Date.now().toString(),
      team,
      playerOutNumber: selectedPlayerOut.number,
      playerOutName: selectedPlayerOut.name,
      playerInNumber: selectedPlayerIn.number,
      playerInName: selectedPlayerIn.name,
      minute,
      period,
    };

    onAdd(newSub);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-[var(--background)] rounded-2xl border border-[var(--border)] p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-[var(--foreground)]">Registrar Substituição</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[var(--muted)]/20 transition-all"
          >
            <X className="w-5 h-5 text-[var(--muted-foreground)]" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
              Equipe
            </label>
            <select
              value={team}
              onChange={(e) => {
                setTeam(e.target.value as 'home' | 'away');
                setPlayerOutId('');
                setPlayerInId('');
              }}
              className="w-full px-4 py-3 bg-[var(--input-background)] border border-[var(--border)] rounded-xl text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            >
              <option value="home">{homeTeamName}</option>
              <option value="away">{awayTeamName}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
              Saiu (↓)
            </label>
            <select
              value={playerOutId}
              onChange={(e) => setPlayerOutId(e.target.value)}
              className="w-full px-4 py-3 bg-[var(--input-background)] border border-[var(--border)] rounded-xl text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              required
            >
              <option value="">Selecione...</option>
              {currentPlayers.map((player) => (
                <option key={player.id} value={player.id}>
                  #{player.number} - {player.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
              Entrou (↑)
            </label>
            <select
              value={playerInId}
              onChange={(e) => setPlayerInId(e.target.value)}
              className="w-full px-4 py-3 bg-[var(--input-background)] border border-[var(--border)] rounded-xl text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              required
            >
              <option value="">Selecione...</option>
              {currentPlayers
                .filter(p => p.id !== playerOutId)
                .map((player) => (
                  <option key={player.id} value={player.id}>
                    #{player.number} - {player.name}
                  </option>
                ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                Minuto
              </label>
              <input
                type="text"
                value={minute}
                onChange={(e) => setMinute(e.target.value)}
                placeholder="0-50"
                className="w-full px-4 py-3 bg-[var(--input-background)] border border-[var(--border)] rounded-xl text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                Período
              </label>
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value as any)}
                className="w-full px-4 py-3 bg-[var(--input-background)] border border-[var(--border)] rounded-xl text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              >
                <option value="1T">1º Tempo</option>
                <option value="2T">2º Tempo</option>
                <option value="PROR">Prorrogação</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full px-4 py-3 bg-[var(--primary)] hover:opacity-90 rounded-xl text-[var(--primary-foreground)] font-medium transition-all"
          >
            Adicionar Substituição
          </button>
        </form>
      </div>
    </div>
  );
}

// Add Timeout Modal Component
function AddTimeoutModal({
  onClose,
  onAdd,
  homeTeamName,
  awayTeamName,
}: {
  onClose: () => void;
  onAdd: (timeout: Timeout) => void;
  homeTeamName: string;
  awayTeamName: string;
}) {
  const [team, setTeam] = useState<'home' | 'away'>('home');
  const [minute, setMinute] = useState('');
  const [period, setPeriod] = useState<'1T' | '2T' | 'PROR'>('1T');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!minute) return;

    const newTimeout: Timeout = {
      id: Date.now().toString(),
      team,
      minute,
      period,
    };

    onAdd(newTimeout);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-[var(--background)] rounded-2xl border border-[var(--border)] p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-[var(--foreground)]">Registrar Pedido de Tempo</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[var(--muted)]/20 transition-all"
          >
            <X className="w-5 h-5 text-[var(--muted-foreground)]" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
              Equipe
            </label>
            <select
              value={team}
              onChange={(e) => setTeam(e.target.value as 'home' | 'away')}
              className="w-full px-4 py-3 bg-[var(--input-background)] border border-[var(--border)] rounded-xl text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            >
              <option value="home">{homeTeamName}</option>
              <option value="away">{awayTeamName}</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                Minuto
              </label>
              <input
                type="text"
                value={minute}
                onChange={(e) => setMinute(e.target.value)}
                placeholder="0-50"
                className="w-full px-4 py-3 bg-[var(--input-background)] border border-[var(--border)] rounded-xl text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                Período
              </label>
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value as any)}
                className="w-full px-4 py-3 bg-[var(--input-background)] border border-[var(--border)] rounded-xl text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              >
                <option value="1T">1º Tempo</option>
                <option value="2T">2º Tempo</option>
                <option value="PROR">Prorrogação</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full px-4 py-3 bg-blue-500 hover:opacity-90 rounded-xl text-white font-medium transition-all"
          >
            Adicionar Pedido de Tempo
          </button>
        </form>
      </div>
    </div>
  );
}

// Add Staff Card Modal Component
function AddStaffCardModal({
  onClose,
  onAdd,
  homeTeamName,
  awayTeamName,
}: {
  onClose: () => void;
  onAdd: (card: StaffCard) => void;
  homeTeamName: string;
  awayTeamName: string;
}) {
  const [team, setTeam] = useState<'home' | 'away'>('home');
  const [staffName, setStaffName] = useState('');
  const [role, setRole] = useState('');
  const [minute, setMinute] = useState('');
  const [period, setPeriod] = useState<'1T' | '2T' | 'PROR'>('1T');
  const [type, setType] = useState<'yellow' | 'red'>('yellow');
  const [reason, setReason] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffName || !role || !minute || !reason) return;

    const newCard: StaffCard = {
      id: Date.now().toString(),
      team,
      staffName,
      role,
      minute,
      period,
      type,
      reason,
    };

    onAdd(newCard);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-[var(--background)] rounded-2xl border border-[var(--border)] p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-[var(--foreground)]">Registrar Cartão Comissão Técnica</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[var(--muted)]/20 transition-all"
          >
            <X className="w-5 h-5 text-[var(--muted-foreground)]" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
              Equipe
            </label>
            <select
              value={team}
              onChange={(e) => setTeam(e.target.value as 'home' | 'away')}
              className="w-full px-4 py-3 bg-[var(--input-background)] border border-[var(--border)] rounded-xl text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            >
              <option value="home">{homeTeamName}</option>
              <option value="away">{awayTeamName}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
              Nome
            </label>
            <input
              type="text"
              value={staffName}
              onChange={(e) => setStaffName(e.target.value)}
              placeholder="Nome do membro da comissão"
              className="w-full px-4 py-3 bg-[var(--input-background)] border border-[var(--border)] rounded-xl text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
              Função
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-3 bg-[var(--input-background)] border border-[var(--border)] rounded-xl text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              required
            >
              <option value="">Selecione...</option>
              <option value="Técnico">Técnico</option>
              <option value="Auxiliar Técnico">Auxiliar Técnico</option>
              <option value="Preparador Físico">Preparador Físico</option>
              <option value="Massagista">Massagista</option>
              <option value="Médico">Médico</option>
              <option value="Outro">Outro</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
              Tipo de Cartão
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setType('yellow')}
                className={`px-4 py-3 rounded-xl font-medium transition-all ${
                  type === 'yellow'
                    ? 'bg-yellow-500 text-white'
                    : 'bg-[var(--muted)]/20 text-[var(--foreground)] border border-[var(--border)]'
                }`}
              >
                Amarelo
              </button>
              <button
                type="button"
                onClick={() => setType('red')}
                className={`px-4 py-3 rounded-xl font-medium transition-all ${
                  type === 'red'
                    ? 'bg-red-500 text-white'
                    : 'bg-[var(--muted)]/20 text-[var(--foreground)] border border-[var(--border)]'
                }`}
              >
                Vermelho
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                Minuto
              </label>
              <input
                type="text"
                value={minute}
                onChange={(e) => setMinute(e.target.value)}
                placeholder="0-50"
                className="w-full px-4 py-3 bg-[var(--input-background)] border border-[var(--border)] rounded-xl text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                Período
              </label>
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value as any)}
                className="w-full px-4 py-3 bg-[var(--input-background)] border border-[var(--border)] rounded-xl text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              >
                <option value="1T">1º Tempo</option>
                <option value="2T">2º Tempo</option>
                <option value="PROR">Prorrogação</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
              Motivo
            </label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Ex: Conduta antidesportiva..."
              className="w-full px-4 py-3 bg-[var(--input-background)] border border-[var(--border)] rounded-xl text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full px-4 py-3 bg-orange-500 hover:opacity-90 rounded-xl text-white font-medium transition-all"
          >
            Adicionar Cartão
          </button>
        </form>
      </div>
    </div>
  );
}

// Add Injury Modal Component
function AddInjuryModal({
  onClose,
  onAdd,
  homePlayers,
  awayPlayers,
  homeTeamName,
  awayTeamName,
}: {
  onClose: () => void;
  onAdd: (injury: Injury) => void;
  homePlayers: SelectedPlayer[];
  awayPlayers: SelectedPlayer[];
  homeTeamName: string;
  awayTeamName: string;
}) {
  const [team, setTeam] = useState<'home' | 'away'>('home');
  const [playerId, setPlayerId] = useState('');
  const [minute, setMinute] = useState('');
  const [period, setPeriod] = useState<'1T' | '2T' | 'PROR'>('1T');
  const [description, setDescription] = useState('');

  const currentPlayers = team === 'home' ? homePlayers : awayPlayers;
  const selectedPlayer = currentPlayers.find(p => p.id === playerId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlayer || !minute || !description) return;

    const newInjury: Injury = {
      id: Date.now().toString(),
      team,
      playerNumber: selectedPlayer.number,
      playerName: selectedPlayer.name,
      minute,
      period,
      description,
    };

    onAdd(newInjury);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-[var(--background)] rounded-2xl border border-[var(--border)] p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-[var(--foreground)]">Registrar Lesão/Atendimento</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[var(--muted)]/20 transition-all"
          >
            <X className="w-5 h-5 text-[var(--muted-foreground)]" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
              Equipe
            </label>
            <select
              value={team}
              onChange={(e) => {
                setTeam(e.target.value as 'home' | 'away');
                setPlayerId('');
              }}
              className="w-full px-4 py-3 bg-[var(--input-background)] border border-[var(--border)] rounded-xl text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            >
              <option value="home">{homeTeamName}</option>
              <option value="away">{awayTeamName}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
              Atleta
            </label>
            <select
              value={playerId}
              onChange={(e) => setPlayerId(e.target.value)}
              className="w-full px-4 py-3 bg-[var(--input-background)] border border-[var(--border)] rounded-xl text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              required
            >
              <option value="">Selecione...</option>
              {currentPlayers.map((player) => (
                <option key={player.id} value={player.id}>
                  #{player.number} - {player.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                Minuto
              </label>
              <input
                type="text"
                value={minute}
                onChange={(e) => setMinute(e.target.value)}
                placeholder="0-50"
                className="w-full px-4 py-3 bg-[var(--input-background)] border border-[var(--border)] rounded-xl text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                Período
              </label>
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value as any)}
                className="w-full px-4 py-3 bg-[var(--input-background)] border border-[var(--border)] rounded-xl text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              >
                <option value="1T">1º Tempo</option>
                <option value="2T">2º Tempo</option>
                <option value="PROR">Prorrogação</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
              Descrição
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva a lesão ou tipo de atendimento..."
              rows={3}
              className="w-full px-4 py-3 bg-[var(--input-background)] border border-[var(--border)] rounded-xl text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] resize-none"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full px-4 py-3 bg-pink-500 hover:opacity-90 rounded-xl text-white font-medium transition-all"
          >
            Adicionar Registro
          </button>
        </form>
      </div>
    </div>
  );
}

// Add Warning Modal Component
function AddWarningModal({
  onClose,
  onAdd,
  homePlayers,
  awayPlayers,
  homeTeamName,
  awayTeamName,
}: {
  onClose: () => void;
  onAdd: (warning: Warning) => void;
  homePlayers: SelectedPlayer[];
  awayPlayers: SelectedPlayer[];
  homeTeamName: string;
  awayTeamName: string;
}) {
  const [team, setTeam] = useState<'home' | 'away'>('home');
  const [playerId, setPlayerId] = useState('');
  const [minute, setMinute] = useState('');
  const [period, setPeriod] = useState<'1T' | '2T' | 'PROR'>('1T');
  const [reason, setReason] = useState('');

  const currentPlayers = team === 'home' ? homePlayers : awayPlayers;
  const selectedPlayer = currentPlayers.find(p => p.id === playerId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlayer || !minute || !reason) return;

    const newWarning: Warning = {
      id: Date.now().toString(),
      team,
      playerNumber: selectedPlayer.number,
      playerName: selectedPlayer.name,
      minute,
      period,
      reason,
    };

    onAdd(newWarning);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-[var(--background)] rounded-2xl border border-[var(--border)] p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-[var(--foreground)]">Registrar Advertência Verbal</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[var(--muted)]/20 transition-all"
          >
            <X className="w-5 h-5 text-[var(--muted-foreground)]" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
              Equipe
            </label>
            <select
              value={team}
              onChange={(e) => {
                setTeam(e.target.value as 'home' | 'away');
                setPlayerId('');
              }}
              className="w-full px-4 py-3 bg-[var(--input-background)] border border-[var(--border)] rounded-xl text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            >
              <option value="home">{homeTeamName}</option>
              <option value="away">{awayTeamName}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
              Atleta
            </label>
            <select
              value={playerId}
              onChange={(e) => setPlayerId(e.target.value)}
              className="w-full px-4 py-3 bg-[var(--input-background)] border border-[var(--border)] rounded-xl text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              required
            >
              <option value="">Selecione...</option>
              {currentPlayers.map((player) => (
                <option key={player.id} value={player.id}>
                  #{player.number} - {player.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                Minuto
              </label>
              <input
                type="text"
                value={minute}
                onChange={(e) => setMinute(e.target.value)}
                placeholder="0-50"
                className="w-full px-4 py-3 bg-[var(--input-background)] border border-[var(--border)] rounded-xl text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                Período
              </label>
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value as any)}
                className="w-full px-4 py-3 bg-[var(--input-background)] border border-[var(--border)] rounded-xl text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              >
                <option value="1T">1º Tempo</option>
                <option value="2T">2º Tempo</option>
                <option value="PROR">Prorrogação</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
              Motivo
            </label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Ex: Reclamação, conduta..."
              className="w-full px-4 py-3 bg-[var(--input-background)] border border-[var(--border)] rounded-xl text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full px-4 py-3 bg-amber-500 hover:opacity-90 rounded-xl text-white font-medium transition-all"
          >
            Adicionar Advertência
          </button>
        </form>
      </div>
    </div>
  );
}

// Add Protest Modal Component
function AddProtestModal({
  onClose,
  onAdd,
  homeTeamName,
  awayTeamName,
}: {
  onClose: () => void;
  onAdd: (protest: Protest) => void;
  homeTeamName: string;
  awayTeamName: string;
}) {
  const [team, setTeam] = useState<'home' | 'away'>('home');
  const [minute, setMinute] = useState('');
  const [period, setPeriod] = useState<'1T' | '2T' | 'PROR'>('1T');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!minute || !description) return;

    const newProtest: Protest = {
      id: Date.now().toString(),
      team,
      minute,
      period,
      description,
    };

    onAdd(newProtest);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-[var(--background)] rounded-2xl border border-[var(--border)] p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-[var(--foreground)]">Registrar Protesto Oficial</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[var(--muted)]/20 transition-all"
          >
            <X className="w-5 h-5 text-[var(--muted-foreground)]" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
              Equipe
            </label>
            <select
              value={team}
              onChange={(e) => setTeam(e.target.value as 'home' | 'away')}
              className="w-full px-4 py-3 bg-[var(--input-background)] border border-[var(--border)] rounded-xl text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            >
              <option value="home">{homeTeamName}</option>
              <option value="away">{awayTeamName}</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                Minuto
              </label>
              <input
                type="text"
                value={minute}
                onChange={(e) => setMinute(e.target.value)}
                placeholder="0-50"
                className="w-full px-4 py-3 bg-[var(--input-background)] border border-[var(--border)] rounded-xl text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                Período
              </label>
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value as any)}
                className="w-full px-4 py-3 bg-[var(--input-background)] border border-[var(--border)] rounded-xl text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              >
                <option value="1T">1º Tempo</option>
                <option value="2T">2º Tempo</option>
                <option value="PROR">Prorrogação</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
              Descrição do Protesto
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva o motivo do protesto oficial..."
              rows={4}
              className="w-full px-4 py-3 bg-[var(--input-background)] border border-[var(--border)] rounded-xl text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] resize-none"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full px-4 py-3 bg-purple-500 hover:opacity-90 rounded-xl text-white font-medium transition-all"
          >
            Adicionar Protesto
          </button>
        </form>
      </div>
    </div>
  );
}
