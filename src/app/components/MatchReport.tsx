import { useState } from 'react';
import {
  Save,
  Send,
  Wifi,
  WifiOff,
  Calendar,
  MapPin,
  Users,
  Plus,
  Minus,
  AlertCircle,
  CheckCircle,
  Clock,
  User,
  Shield,
  X
} from 'lucide-react';

interface Player {
  id: string;
  number: string;
  name: string;
  position: string;
  isStarter: boolean;
}

interface Goal {
  id: string;
  playerId: string;
  playerName: string;
  minute: string;
  team: 'home' | 'away';
}

interface Card {
  id: string;
  playerId: string;
  playerName: string;
  minute: string;
  type: 'yellow' | 'red';
  team: 'home' | 'away';
}

interface Substitution {
  id: string;
  playerOutId: string;
  playerOutName: string;
  playerInId: string;
  playerInName: string;
  minute: string;
  team: 'home' | 'away';
}

export function MatchReport() {
  const [isOnline, setIsOnline] = useState(true);
  const [currentTab, setCurrentTab] = useState<'info' | 'lineup' | 'events' | 'summary'>('info');
  const [isSaved, setIsSaved] = useState(false);

  // Match Info
  const [matchData, setMatchData] = useState({
    championship: '',
    round: '',
    date: '',
    time: '',
    location: '',
    homeTeam: '',
    awayTeam: '',
    referee: '',
    assistant1: '',
    assistant2: '',
  });

  // Lineups
  const [homePlayers, setHomePlayers] = useState<Player[]>([]);
  const [awayPlayers, setAwayPlayers] = useState<Player[]>([]);

  // Events
  const [goals, setGoals] = useState<Goal[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [substitutions, setSubstitutions] = useState<Substitution[]>([]);

  const [notes, setNotes] = useState('');

  const handleSave = () => {
    // Salvar no localStorage/IndexedDB
    const reportData = {
      matchData,
      homePlayers,
      awayPlayers,
      goals,
      cards,
      substitutions,
      notes,
      savedAt: new Date().toISOString(),
      synced: false,
    };
    localStorage.setItem('current-match-report', JSON.stringify(reportData));
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleSubmit = () => {
    if (isOnline) {
      // Enviar para o servidor
      console.log('Enviando súmula para o servidor...');
      // Implementar lógica de envio
    } else {
      // Adicionar à fila de sincronização
      console.log('Salvando na fila de sincronização...');
      handleSave();
    }
  };

  const tabs = [
    { id: 'info' as const, label: 'Informações', icon: AlertCircle },
    { id: 'lineup' as const, label: 'Escalação', icon: Users },
    { id: 'events' as const, label: 'Eventos', icon: Clock },
    { id: 'summary' as const, label: 'Resumo', icon: CheckCircle },
  ];

  return (
    <div className="min-h-screen bg-[var(--background)] p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-[var(--surface-glass)] backdrop-blur-xl rounded-2xl border border-[var(--border)] p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[var(--primary)] rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-[var(--primary-foreground)]" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-[var(--foreground)]">Súmula Digital</h1>
                <p className="text-sm text-[var(--muted-foreground)]">Preenchimento em campo</p>
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
                {isOnline ? (
                  <>
                    <Wifi className="w-5 h-5" />
                    <span className="text-sm font-medium">Online</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="w-5 h-5" />
                    <span className="text-sm font-medium">Offline</span>
                  </>
                )}
              </div>

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
            <div className="flex items-center gap-2 px-4 py-2 bg-[var(--success)]/10 border border-[var(--success)]/30 rounded-lg">
              <CheckCircle className="w-4 h-4 text-[var(--success)]" />
              <span className="text-sm text-[var(--success)]">Súmula salva localmente</span>
            </div>
          )}

          {/* Tabs */}
          <div className="flex items-center gap-2 mt-4">
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
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-[var(--foreground)] mb-6">
                Informações da Partida
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Campeonato */}
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                    Campeonato
                  </label>
                  <input
                    type="text"
                    value={matchData.championship}
                    onChange={(e) => setMatchData({ ...matchData, championship: e.target.value })}
                    placeholder="Ex: Campeonato Brasileiro"
                    className="w-full px-4 py-3 bg-[var(--input-background)] border border-[var(--border)] rounded-xl text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  />
                </div>

                {/* Rodada */}
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                    Rodada
                  </label>
                  <input
                    type="text"
                    value={matchData.round}
                    onChange={(e) => setMatchData({ ...matchData, round: e.target.value })}
                    placeholder="Ex: 15ª Rodada"
                    className="w-full px-4 py-3 bg-[var(--input-background)] border border-[var(--border)] rounded-xl text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  />
                </div>

                {/* Data */}
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                    Data
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--muted-foreground)]" />
                    <input
                      type="date"
                      value={matchData.date}
                      onChange={(e) => setMatchData({ ...matchData, date: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 bg-[var(--input-background)] border border-[var(--border)] rounded-xl text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                    />
                  </div>
                </div>

                {/* Horário */}
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                    Horário
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--muted-foreground)]" />
                    <input
                      type="time"
                      value={matchData.time}
                      onChange={(e) => setMatchData({ ...matchData, time: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 bg-[var(--input-background)] border border-[var(--border)] rounded-xl text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                    />
                  </div>
                </div>

                {/* Local */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                    Local
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--muted-foreground)]" />
                    <input
                      type="text"
                      value={matchData.location}
                      onChange={(e) => setMatchData({ ...matchData, location: e.target.value })}
                      placeholder="Ex: Estádio do Maracanã - Rio de Janeiro, RJ"
                      className="w-full pl-12 pr-4 py-3 bg-[var(--input-background)] border border-[var(--border)] rounded-xl text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                    />
                  </div>
                </div>

                {/* Times */}
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                    Time Mandante
                  </label>
                  <input
                    type="text"
                    value={matchData.homeTeam}
                    onChange={(e) => setMatchData({ ...matchData, homeTeam: e.target.value })}
                    placeholder="Nome do time da casa"
                    className="w-full px-4 py-3 bg-[var(--input-background)] border border-[var(--border)] rounded-xl text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                    Time Visitante
                  </label>
                  <input
                    type="text"
                    value={matchData.awayTeam}
                    onChange={(e) => setMatchData({ ...matchData, awayTeam: e.target.value })}
                    placeholder="Nome do time visitante"
                    className="w-full px-4 py-3 bg-[var(--input-background)] border border-[var(--border)] rounded-xl text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  />
                </div>

                {/* Arbitragem */}
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                    Árbitro Principal
                  </label>
                  <input
                    type="text"
                    value={matchData.referee}
                    onChange={(e) => setMatchData({ ...matchData, referee: e.target.value })}
                    placeholder="Nome do árbitro"
                    className="w-full px-4 py-3 bg-[var(--input-background)] border border-[var(--border)] rounded-xl text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                    Assistente 1
                  </label>
                  <input
                    type="text"
                    value={matchData.assistant1}
                    onChange={(e) => setMatchData({ ...matchData, assistant1: e.target.value })}
                    placeholder="Nome do assistente 1"
                    className="w-full px-4 py-3 bg-[var(--input-background)] border border-[var(--border)] rounded-xl text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                    Assistente 2
                  </label>
                  <input
                    type="text"
                    value={matchData.assistant2}
                    onChange={(e) => setMatchData({ ...matchData, assistant2: e.target.value })}
                    placeholder="Nome do assistente 2"
                    className="w-full px-4 py-3 bg-[var(--input-background)] border border-[var(--border)] rounded-xl text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Tab: Lineup */}
          {currentTab === 'lineup' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-[var(--foreground)] mb-6">
                Escalação dos Times
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Home Team */}
                <div className="bg-[var(--muted)]/20 rounded-xl p-6 border border-[var(--border)]">
                  <h3 className="font-semibold text-[var(--foreground)] mb-4">
                    {matchData.homeTeam || 'Time Mandante'}
                  </h3>
                  <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[var(--primary)] hover:opacity-90 rounded-xl text-[var(--primary-foreground)] transition-all mb-4">
                    <Plus className="w-5 h-5" />
                    <span className="font-medium">Adicionar Jogador</span>
                  </button>
                  <div className="text-center text-[var(--muted-foreground)] text-sm">
                    Nenhum jogador adicionado
                  </div>
                </div>

                {/* Away Team */}
                <div className="bg-[var(--muted)]/20 rounded-xl p-6 border border-[var(--border)]">
                  <h3 className="font-semibold text-[var(--foreground)] mb-4">
                    {matchData.awayTeam || 'Time Visitante'}
                  </h3>
                  <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[var(--primary)] hover:opacity-90 rounded-xl text-[var(--primary-foreground)] transition-all mb-4">
                    <Plus className="w-5 h-5" />
                    <span className="font-medium">Adicionar Jogador</span>
                  </button>
                  <div className="text-center text-[var(--muted-foreground)] text-sm">
                    Nenhum jogador adicionado
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab: Events */}
          {currentTab === 'events' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-[var(--foreground)] mb-6">
                Eventos da Partida
              </h2>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button className="flex items-center justify-center gap-3 px-6 py-4 bg-[var(--success)]/10 hover:bg-[var(--success)]/20 border border-[var(--success)]/30 rounded-xl transition-all group">
                  <div className="w-10 h-10 bg-[var(--success)] rounded-lg flex items-center justify-center">
                    <span className="text-white text-xl">⚽</span>
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-[var(--foreground)]">Registrar Gol</p>
                    <p className="text-xs text-[var(--muted-foreground)]">{goals.length} gols</p>
                  </div>
                </button>

                <button className="flex items-center justify-center gap-3 px-6 py-4 bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/30 rounded-xl transition-all group">
                  <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-xl">🟨</span>
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-[var(--foreground)]">Cartão Amarelo</p>
                    <p className="text-xs text-[var(--muted-foreground)]">
                      {cards.filter((c) => c.type === 'yellow').length} cartões
                    </p>
                  </div>
                </button>

                <button className="flex items-center justify-center gap-3 px-6 py-4 bg-[var(--destructive)]/10 hover:bg-[var(--destructive)]/20 border border-[var(--destructive)]/30 rounded-xl transition-all group">
                  <div className="w-10 h-10 bg-[var(--destructive)] rounded-lg flex items-center justify-center">
                    <span className="text-white text-xl">🟥</span>
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-[var(--foreground)]">Cartão Vermelho</p>
                    <p className="text-xs text-[var(--muted-foreground)]">
                      {cards.filter((c) => c.type === 'red').length} cartões
                    </p>
                  </div>
                </button>
              </div>

              {/* Events Timeline */}
              <div className="bg-[var(--muted)]/20 rounded-xl p-6 border border-[var(--border)]">
                <h3 className="font-semibold text-[var(--foreground)] mb-4">Linha do Tempo</h3>
                <div className="text-center text-[var(--muted-foreground)] text-sm py-8">
                  Nenhum evento registrado
                </div>
              </div>
            </div>
          )}

          {/* Tab: Summary */}
          {currentTab === 'summary' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-[var(--foreground)] mb-6">
                Resumo da Súmula
              </h2>

              {/* Match Score */}
              <div className="bg-gradient-to-r from-[var(--primary)]/10 to-[var(--accent)]/10 rounded-2xl p-8 border border-[var(--border)]">
                <div className="flex items-center justify-center gap-8">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-[var(--foreground)] mb-2">
                      {matchData.homeTeam || 'Mandante'}
                    </h3>
                    <div className="text-6xl font-bold text-[var(--foreground)]">
                      {goals.filter((g) => g.team === 'home').length}
                    </div>
                  </div>

                  <div className="text-4xl font-bold text-[var(--muted-foreground)]">×</div>

                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-[var(--foreground)] mb-2">
                      {matchData.awayTeam || 'Visitante'}
                    </h3>
                    <div className="text-6xl font-bold text-[var(--foreground)]">
                      {goals.filter((g) => g.team === 'away').length}
                    </div>
                  </div>
                </div>
              </div>

              {/* Observações */}
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                  Observações Gerais
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={6}
                  placeholder="Registre aqui observações importantes sobre a partida..."
                  className="w-full px-4 py-3 bg-[var(--input-background)] border border-[var(--border)] rounded-xl text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] resize-none"
                />
              </div>

              {/* Stats Summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-[var(--muted)]/20 rounded-xl p-4 border border-[var(--border)] text-center">
                  <p className="text-3xl font-bold text-[var(--foreground)] mb-1">{goals.length}</p>
                  <p className="text-sm text-[var(--muted-foreground)]">Gols</p>
                </div>
                <div className="bg-[var(--muted)]/20 rounded-xl p-4 border border-[var(--border)] text-center">
                  <p className="text-3xl font-bold text-[var(--foreground)] mb-1">
                    {cards.filter((c) => c.type === 'yellow').length}
                  </p>
                  <p className="text-sm text-[var(--muted-foreground)]">Cartões Amarelos</p>
                </div>
                <div className="bg-[var(--muted)]/20 rounded-xl p-4 border border-[var(--border)] text-center">
                  <p className="text-3xl font-bold text-[var(--foreground)] mb-1">
                    {cards.filter((c) => c.type === 'red').length}
                  </p>
                  <p className="text-sm text-[var(--muted-foreground)]">Cartões Vermelhos</p>
                </div>
                <div className="bg-[var(--muted)]/20 rounded-xl p-4 border border-[var(--border)] text-center">
                  <p className="text-3xl font-bold text-[var(--foreground)] mb-1">
                    {substitutions.length}
                  </p>
                  <p className="text-sm text-[var(--muted-foreground)]">Substituições</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
