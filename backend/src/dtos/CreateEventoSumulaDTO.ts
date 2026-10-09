import { IsIn, IsInt, IsOptional, IsUUID, Max, Min } from 'class-validator';

export class CreateEventoSumulaDTO {
  @IsUUID('4', { message: 'O atleta deve ter um UUID válido.' })
  id_atleta!: string;

  @IsUUID('4', { message: 'A partida deve ter um UUID válido.' })
  id_partida!: string;

  @IsUUID('4', { message: 'O clube deve ter um UUID válido.' })
  id_clube!: string;

  @IsIn(['GOL', 'CARTAO_AMARELO', 'CARTAO_VERMELHO'], { message: 'Tipo de evento inválido.' })
  tipo_evento!: 'GOL' | 'CARTAO_AMARELO' | 'CARTAO_VERMELHO';

  @IsOptional()
  @IsUUID('4', { message: 'O atleta de assistência deve ter um UUID válido.' })
  id_atleta_assistencia?: string | null;

  @IsOptional()
  @IsInt({ message: 'O minuto deve ser um número inteiro.' })
  @Min(0, { message: 'O minuto não pode ser negativo.' })
  @Max(150, { message: 'O minuto não pode ser maior que 150.' })
  minuto_evento?: number;
}
