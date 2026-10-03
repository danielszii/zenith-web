import {IsDateString, IsString, IsNotEmpty, IsOptional, IsIn} from "class-validator";

export class CreateCampeonatoDTO {
  @IsString()
  @IsNotEmpty({ message: "O nome do campeonato é obrigatório." })
  nome: string;

  @IsOptional()
  @IsString()
  formato?: string;

  @IsDateString(
    {},
    { message: "A data de início deve ser uma data válida (AAAA-MM-DD)." },
  )
  @IsNotEmpty({ message: "A data de início é obrigatória." })
  data_inicio: string;

  @IsDateString(
    {},
    { message: "A data de término deve ser uma data válida (AAAA-MM-DD)." },
  )
  @IsNotEmpty({ message: "A data de término é obrigatória." })
  data_fim: string;

  @IsString()
  @IsIn(["planejado", "em andamento", "finalizado"], {
    message:
      "Status inválido. Os valores permitidos são: planejado, em andamento, finalizado.",
  })
  status: string;

  @IsOptional()
  @IsString()
  criterios_desempate?: string;

  @IsString()
  @IsIn(["futebol", "futsal"], {
    message: "A modalidade deve ser futebol ou futsal.",
  })
  modalidade: "futebol" | "futsal";

  @IsString()
  @IsIn(["sub-17", "sub-19", "sub-21", "profissional"], {
    message: "Categoria inválida.",
  })
  categoria: "sub-17" | "sub-19" | "sub-21" | "profissional";
}
