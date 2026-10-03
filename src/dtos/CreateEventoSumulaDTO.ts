import {IsInt, IsNotEmpty, IsIn, IsOptional, Min, Max, IsString } from "class-validator";

export class CreateEventoSumulaDTO {
  @IsString({ message: "O id do atleta deve ser uma string." })
  @IsNotEmpty({ message: "O id do atleta é obrigatório." })
  id_atleta: string;

  @IsString({ message: "O id da partida deve ser uma string." })
  @IsNotEmpty({ message: "O id da partida é obrigatório." })
  id_partida: string;

  @IsString({ message: "O id do clube deve ser uma string." })
  @IsNotEmpty({ message: "O id do clube é obrigatório." })
  id_clube: string;

  @IsNotEmpty({ message: "O tipo de evento é obrigatório." })
  @IsIn(["GOL", "CARTAO_AMARELO", "CARTAO_VERMELHO"], {
    message:
      "Tipo de evento inválido. Use GOL, CARTAO_AMARELO, CARTAO_VERMELHO ou GOL_CONTRA.",
  })
  tipo_evento: "GOL" | "CARTAO_AMARELO" | "CARTAO_VERMELHO";

  @IsOptional()
  @IsString({ message: "O id do atleta assistência deve ser uma string." })
  id_atleta_assistencia?: string | null;

  @IsOptional()
  @IsInt({ message: "O minuto do jogo deve ser um número inteiro." })
  @Min(0, { message: "O minuto do jogo não pode ser negativo." })
  @Max(150, {
    message:
      "Minuto inválido (acima do limite máximo de acréscimos/prorrogação).",
  })
  minuto_evento?: number;
}
