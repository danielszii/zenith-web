import { IsDateString, IsIn, IsNotEmpty, IsOptional, IsString, IsUUID, Matches } from 'class-validator';

export class CreatePartidaDTO {
  @IsUUID('4', { message: 'O campeonato deve ter um UUID válido.' })
  id_campeonato!: string;

  @IsUUID('4', { message: 'O clube mandante deve ter um UUID válido.' })
  id_mandante!: string;

  @IsUUID('4', { message: 'O clube visitante deve ter um UUID válido.' })
  id_visitante!: string;

  @IsDateString({}, { message: 'A data deve estar no formato AAAA-MM-DD.' })
  data!: string;

  @IsString()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, { message: 'A hora deve estar no formato HH:MM.' })
  hora!: string;

  @IsString()
  @IsNotEmpty({ message: 'O local é obrigatório.' })
  local!: string;

  @IsOptional()
  @IsIn(['agendado', 'em_andamento', 'encerrado', 'cancelado'], { message: 'Status de partida inválido.' })
  status?: 'agendado' | 'em_andamento' | 'encerrado' | 'cancelado';
}
