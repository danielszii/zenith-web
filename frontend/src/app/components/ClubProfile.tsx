import { Trophy, Users, Calendar, MapPin, Star, TrendingUp, Award, Shield } from 'lucide-react';

export function ClubProfile() {
  const clubStats = [
    { label: 'Fundação', value: '1912', icon: Calendar },
    { label: 'Estádio', value: 'Arena Principal', icon: MapPin },
    { label: 'Capacidade', value: '45.000', icon: Users },
    { label: 'Títulos', value: '24', icon: Trophy },
  ];

  const squad = [
    { id: '1', name: 'Gabriel Silva', position: 'Goleiro', number: '1', age: 28, nationality: '🇧🇷' },
    { id: '2', name: 'Lucas Martins', position: 'Zagueiro', number: '3', age: 26, nationality: '🇧🇷' },
    { id: '3', name: 'Pedro Costa', position: 'Zagueiro', number: '4', age: 24, nationality: '🇧🇷' },
    { id: '4', name: 'Rafael Santos', position: 'Lateral', number: '2', age: 27, nationality: '🇧🇷' },
    { id: '5', name: 'Felipe Rocha', position: 'Lateral', number: '6', age: 25, nationality: '🇧🇷' },
    { id: '6', name: 'João Mendes', position: 'Volante', number: '5', age: 29, nationality: '🇧🇷' },
    { id: '7', name: 'Matheus Lima', position: 'Meia', number: '8', age: 23, nationality: '🇧🇷' },
    { id: '8', name: 'Daniel Oliveira', position: 'Atacante', number: '7', age: 26, nationality: '🇧🇷' },
    { id: '9', name: 'André Ferreira', position: 'Atacante', number: '9', age: 28, nationality: '🇧🇷' },
    { id: '10', name: 'Bruno Alves', position: 'Atacante', number: '11', age: 24, nationality: '🇧🇷' },
  ];

  const upcomingMatches = [
    { id: '1', opponent: 'Palmeiras', date: '15 Mai', time: '16:00', location: 'Casa', championship: 'Brasileirão' },
    { id: '2', opponent: 'Flamengo', date: '18 Mai', time: '20:00', location: 'Fora', championship: 'Brasileirão' },
    { id: '3', opponent: 'São Paulo', date: '22 Mai', time: '18:30', location: 'Casa', championship: 'Copa do Brasil' },
  ];

  const recentMatches = [
    { id: '1', opponent: 'Corinthians', score: '2-1', result: 'V', date: '05 Mai', championship: 'Brasileirão' },
    { id: '2', opponent: 'Santos', score: '1-1', result: 'E', date: '01 Mai', championship: 'Brasileirão' },
    { id: '3', opponent: 'Atlético-MG', score: '0-2', result: 'D', date: '28 Abr', championship: 'Copa do Brasil' },
    { id: '4', opponent: 'Grêmio', score: '3-0', result: 'V', date: '24 Abr', championship: 'Brasileirão' },
  ];

  const titles = [
    { year: '2025', competition: 'Campeonato Brasileiro', icon: '🏆' },
    { year: '2024', competition: 'Copa do Brasil', icon: '🏆' },
    { year: '2023', competition: 'Campeonato Estadual', icon: '🏆' },
    { year: '2022', competition: 'Supercopa', icon: '🏆' },
  ];

  const teamStats = [
    { label: 'Partidas', value: '38', subtext: 'Temporada 2026' },
    { label: 'Vitórias', value: '24', subtext: '63% aproveitamento' },
    { label: 'Gols Marcados', value: '72', subtext: '1.89 por partida' },
    { label: 'Gols Sofridos', value: '28', subtext: '0.74 por partida' },
  ];

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-[var(--muted)]/20 to-transparent border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="flex items-start gap-8">
            {/* Club Logo */}
            <div className="w-32 h-32 bg-[var(--surface-glass)] backdrop-blur-xl rounded-2xl border border-[var(--border)] flex items-center justify-center flex-shrink-0">
              <Shield className="w-16 h-16 text-[var(--primary)]" />
            </div>

            {/* Club Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <h1 className="text-4xl font-semibold text-[var(--foreground)]">Cruzeiro FC</h1>
                <div className="flex items-center gap-1 px-3 py-1.5 bg-[var(--primary)]/10 border border-[var(--primary)]/30 rounded-lg">
                  <Star className="w-4 h-4 text-[var(--primary)]" />
                  <span className="text-sm font-semibold text-[var(--primary)]">1º Colocado</span>
                </div>
              </div>

              <div className="flex items-center gap-6 text-[var(--muted-foreground)] mb-6">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">São Paulo, Brasil</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">Fundado em 1912</span>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-4 gap-4">
                {clubStats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div
                      key={index}
                      className="bg-[var(--surface-glass)] backdrop-blur-xl rounded-xl border border-[var(--border)] p-4"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Icon className="w-4 h-4 text-[var(--muted-foreground)]" />
                        <span className="text-xs text-[var(--muted-foreground)] uppercase">
                          {stat.label}
                        </span>
                      </div>
                      <p className="text-2xl font-semibold text-[var(--foreground)]">{stat.value}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Team Statistics */}
            <div className="bg-[var(--surface-glass)] backdrop-blur-xl rounded-2xl border border-[var(--border)] p-6">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="w-5 h-5 text-[var(--primary)]" />
                <h2 className="text-xl font-semibold text-[var(--foreground)]">Estatísticas do Time</h2>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {teamStats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <p className="text-3xl font-bold text-[var(--foreground)] mb-1">{stat.value}</p>
                    <p className="text-sm font-medium text-[var(--foreground)] mb-1">{stat.label}</p>
                    <p className="text-xs text-[var(--muted-foreground)]">{stat.subtext}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Squad List */}
            <div className="bg-[var(--surface-glass)] backdrop-blur-xl rounded-2xl border border-[var(--border)] p-6">
              <div className="flex items-center gap-2 mb-6">
                <Users className="w-5 h-5 text-[var(--primary)]" />
                <h2 className="text-xl font-semibold text-[var(--foreground)]">Elenco Atual</h2>
              </div>

              <div className="space-y-2">
                {squad.map((player) => (
                  <div
                    key={player.id}
                    className="flex items-center justify-between p-4 bg-[var(--muted)]/20 hover:bg-[var(--muted)]/30 rounded-xl border border-transparent hover:border-[var(--border)] transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-[var(--primary)]/10 border border-[var(--primary)]/30 rounded-lg flex items-center justify-center">
                        <span className="text-sm font-bold text-[var(--primary)]">
                          {player.number}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-[var(--foreground)]">{player.name}</p>
                        <p className="text-xs text-[var(--muted-foreground)]">{player.position}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{player.nationality}</span>
                      <span className="text-sm text-[var(--muted-foreground)]">{player.age} anos</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Titles */}
            <div className="bg-[var(--surface-glass)] backdrop-blur-xl rounded-2xl border border-[var(--border)] p-6">
              <div className="flex items-center gap-2 mb-6">
                <Award className="w-5 h-5 text-[var(--primary)]" />
                <h2 className="text-xl font-semibold text-[var(--foreground)]">Títulos Recentes</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {titles.map((title, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-4 bg-[var(--muted)]/20 rounded-xl border border-[var(--border)]"
                  >
                    <span className="text-3xl">{title.icon}</span>
                    <div>
                      <p className="font-semibold text-[var(--foreground)]">{title.competition}</p>
                      <p className="text-xs text-[var(--muted-foreground)]">{title.year}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-8">
            {/* Upcoming Matches */}
            <div className="bg-[var(--surface-glass)] backdrop-blur-xl rounded-2xl border border-[var(--border)] p-6">
              <div className="flex items-center gap-2 mb-6">
                <Calendar className="w-5 h-5 text-[var(--primary)]" />
                <h3 className="text-lg font-semibold text-[var(--foreground)]">Próximas Partidas</h3>
              </div>

              <div className="space-y-3">
                {upcomingMatches.map((match) => (
                  <div
                    key={match.id}
                    className="p-4 bg-[var(--muted)]/20 rounded-xl border border-[var(--border)] hover:bg-[var(--muted)]/30 transition-all cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-[var(--muted-foreground)] uppercase">
                        {match.championship}
                      </span>
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          match.location === 'Casa'
                            ? 'bg-[var(--success)]/10 text-[var(--success)]'
                            : 'bg-[var(--muted)] text-[var(--muted-foreground)]'
                        }`}
                      >
                        {match.location}
                      </span>
                    </div>
                    <p className="font-semibold text-[var(--foreground)] mb-2">vs {match.opponent}</p>
                    <div className="flex items-center gap-2 text-xs text-[var(--muted-foreground)]">
                      <Calendar className="w-3 h-3" />
                      <span>
                        {match.date} • {match.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Results */}
            <div className="bg-[var(--surface-glass)] backdrop-blur-xl rounded-2xl border border-[var(--border)] p-6">
              <div className="flex items-center gap-2 mb-6">
                <Trophy className="w-5 h-5 text-[var(--primary)]" />
                <h3 className="text-lg font-semibold text-[var(--foreground)]">Resultados Recentes</h3>
              </div>

              <div className="space-y-3">
                {recentMatches.map((match) => (
                  <div
                    key={match.id}
                    className="p-4 bg-[var(--muted)]/20 rounded-xl border border-[var(--border)]"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-[var(--muted-foreground)]">{match.date}</span>
                      <div
                        className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold ${
                          match.result === 'V'
                            ? 'bg-[var(--success)]/10 text-[var(--success)]'
                            : match.result === 'E'
                            ? 'bg-[var(--muted)] text-[var(--muted-foreground)]'
                            : 'bg-[var(--destructive)]/10 text-[var(--destructive)]'
                        }`}
                      >
                        {match.result}
                      </div>
                    </div>
                    <p className="font-semibold text-[var(--foreground)] mb-1">vs {match.opponent}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-[var(--foreground)]">{match.score}</span>
                      <span className="text-xs text-[var(--muted-foreground)]">{match.championship}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
