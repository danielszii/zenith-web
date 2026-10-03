import { z } from 'zod';

// Definimos um Enum estrito para os três estados visíveis na sua imagem
export const MatchStatusSchema = z.enum(['A INICIAR', 'EM ANDAMENTO', 'FINALIZADO']);

export const MatchTeamSchema = z.object({
  id: z.string().uuid(),
  nome: z.string(),
  sigla: z.string().max(4),
  escudoUrl: z.string().url().optional(),
});

export const LiveMatchResponseSchema = z.object({
  id: z.string().uuid(),
  campeonatoConfig: z.string(), // Ex: "ZENITH LEAGUE - PROFISSIONAL"
  
  // Dados do confronto e placar
  timeMandante: MatchTeamSchema,
  timeVisitante: MatchTeamSchema,
  golsMandante: z.number().int().min(0).default(0),
  golsVisitante: z.number().int().min(0).default(0),
  
  // Informações de agendamento e local
  dataHoraFormatada: z.string(), // Ex: "19/06 às 19:00 h"
  local: z.string(), // Ex: "Ginásio Poliesportivo de Tabu..."
  
  // Controle de estado para o frontend renderizar os badges corretos
  status: MatchStatusSchema,
});

// Tipo inferido para o seu Service/Controller do Backend
export type LiveMatchResponseDTO = z.infer<typeof LiveMatchResponseSchema>;