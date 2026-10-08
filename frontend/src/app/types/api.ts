export type UserRole = "admin" | "mesario" | "gestor";
export type MatchStatus =
  "agendado" | "em_andamento" | "encerrado" | "cancelado";

export interface SessionUser {
  id: string;
  nome: string;
  email: string;
  role: UserRole;
}

export interface AuthSession {
  token: string;
  usuario: SessionUser;
}
export interface MatchOfficial { id_usuario: string; nome: string; email: string }

export interface Club {
  id_clube: string;
  nome: string;
  brasao?: string | null;
  cores_oficiais?: string | null;
  responsavel?: string | null;
  cnpj?: string | null;
}

export interface Athlete {
  id_atleta: string;
  nome: string;
  cpf: string;
  rg?: string | null;
  foto_perfil?: string | null;
  data_nasc: string;
  status: string;
  peso?: number | null;
  altura?: number | null;
  tipo_sanguineo: string;
  id_clube: string;
}

export interface Championship {
  id_campeonato: string;
  nome: string;
  formato?: string | null;
  data_inicio: string;
  data_fim: string;
  criterios_desempate?: string | null;
  status: "planejado" | "em andamento" | "finalizado";
  modalidade: "futebol" | "futsal";
  categoria: "sub-17" | "sub-19" | "sub-21" | "profissional";
}

export interface Match {
  id_partida: string;
  id_campeonato: string;
  id_mandante: string;
  id_visitante: string;
  data: string;
  hora: string;
  local: string;
  status: MatchStatus;
  gols_mandante: number;
  gols_visitante: number;
  mandante?: { nome: string; brasao?: string | null };
  visitante?: { nome: string; brasao?: string | null };
  campeonato?: { nome: string; categoria?: string };
}

export interface Standing {
  id_clube: string;
  clube: string;
  jogos: number;
  pontos: number;
  vitorias: number;
  empates: number;
  derrotas: number;
  gols_pro: number;
  gols_contra: number;
  saldo_gols: number;
}

export interface AthleteStats {
  jogador: { id: string; nome: string; time_atual: string | null };
  estatisticas: {
    partidas_jogadas: number;
    gols: number;
    assistencias: number;
    cartoes_amarelos: number;
    cartoes_vermelhos: number;
  };
}
