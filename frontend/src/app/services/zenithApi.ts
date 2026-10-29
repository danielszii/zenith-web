import { api } from "./api";
import type {
  Athlete,
  AthleteStats,
  AuthSession,
  Championship,
  Club,
  Match,
  Standing,
  UserRole,
  MatchOfficial,
} from "../types/api";

export type ClubInput = Omit<Club, "id_clube">;
export type AthleteInput = Omit<Athlete, "id_atleta">;
export type ChampionshipInput = Omit<Championship, "id_campeonato">;
export type MatchInput = Pick<
  Match,
  "id_campeonato" | "id_mandante" | "id_visitante" | "data" | "hora" | "local"
>;

export const getApiError = (error: unknown) => {
  if (typeof error === "object" && error && "response" in error) {
    const response = (error as { response?: { data?: { message?: string } } })
      .response;
    return response?.data?.message || "A API recusou a operação.";
  }
  return error instanceof Error
    ? error.message
    : "Não foi possível concluir a operação.";
};

export const hasApiStatus = (error: unknown, status: number) =>
  typeof error === "object" &&
  error !== null &&
  "response" in error &&
  (error as { response?: { status?: number } }).response?.status === status;

export const zenithApi = {
  health: async () => (await api.get<{ status: string }>("/health")).data,
  login: async (email: string, senha: string) =>
    (await api.post<AuthSession>("/auth/login", { email, senha })).data,
  register: async (input: {
    nome: string;
    email: string;
    senha: string;
    role: UserRole;
  }) => (await api.post("/auth/registrar", input)).data,
  media: {
    upload: async (file: File, kind: "atleta" | "clube") => {
      if (file.size > 4 * 1024 * 1024) throw new Error("A imagem deve ter no máximo 4 MB.");
      const data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => reject(new Error("Não foi possível ler a imagem."));
        reader.readAsDataURL(file);
      });
      return (await api.post<{ url: string; path: string }>("/midias/upload", {
        data,
        mimeType: file.type,
        kind,
      })).data;
    },
  },

  clubs: {
    list: async () => (await api.get<Club[]>("/clubes")).data,
    get: async (id: string) => (await api.get<Club>(`/clubes/${id}`)).data,
    create: async (input: ClubInput) =>
      (await api.post<Club>("/clubes", input)).data,
    update: async (id: string, input: ClubInput) =>
      (await api.put<Club>(`/clubes/${id}`, input)).data,
    remove: async (id: string) => api.delete(`/clubes/${id}`),
  },
  athletes: {
    list: async () => (await api.get<Athlete[]>("/atletas")).data,
    get: async (id: string) => (await api.get<Athlete>(`/atletas/${id}`)).data,
    create: async (input: AthleteInput) =>
      (await api.post<Athlete>("/atletas", input)).data,
    update: async (id: string, input: AthleteInput) =>
      (await api.put<Athlete>(`/atletas/${id}`, input)).data,
    remove: async (id: string) => api.delete(`/atletas/${id}`),
    stats: async (id: string) =>
      (await api.get<AthleteStats>(`/atletas/${id}/estatisticas`)).data,
  },
  championships: {
    list: async () => (await api.get<Championship[]>("/campeonatos")).data,
    get: async (id: string) =>
      (await api.get<Championship>(`/campeonatos/${id}`)).data,
    create: async (input: ChampionshipInput) =>
      (await api.post<Championship>("/campeonatos", input)).data,
    update: async (id: string, input: ChampionshipInput) =>
      (await api.put<Championship>(`/campeonatos/${id}`, input)).data,
    remove: async (id: string) => api.delete(`/campeonatos/${id}`),
    enroll: async (id_campeonato: string, id_clube: string) =>
      (await api.post("/campeonatos/inscricoes", { id_campeonato, id_clube }))
        .data,
    standings: async (id: string) =>
      (await api.get<Standing[]>(`/campeonatos/${id}/tabela`)).data,
  },
  matches: {
    list: async () => (await api.get<Match[]>("/partidas")).data,
    get: async (id: string) => (await api.get<Match>(`/partidas/${id}`)).data,
    create: async (input: MatchInput) =>
      (await api.post<Match>("/partidas", input)).data,
    remove: async (id: string) => api.delete(`/partidas/${id}`),
    officials: async () => (await api.get<MatchOfficial[]>("/mobile/mesarios")).data,
    assign: async (matchId: string, usuarioId: string) =>
      (await api.post(`/mobile/partidas/${matchId}/atribuir`, { usuarioId })).data,
  },
};
