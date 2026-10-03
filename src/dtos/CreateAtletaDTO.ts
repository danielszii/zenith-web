import {IsString, IsNotEmpty, IsInt, IsOptional, IsDateString, IsNumber, Min,} from "class-validator";

export class CreateAtletaDTO {
  @IsString()
  @IsNotEmpty({ message: "O nome do atleta é obrigatório." })
  nome: string;

  @IsString()
  @IsNotEmpty({ message: "O CPF é obrigatório." })
  cpf: string;

  @IsString()
  rg?: string;

  @IsDateString(
    {},
    { message: "A data de nascimento deve ser uma data válida (AAAA-MM-DD)." },
  )
  @IsNotEmpty()
  data_nasc!: string;

  @IsString()
  @IsNotEmpty({ message: "O tipo sanguíneo é obrigatório." })
  tipo_sanguineo: string;

  @IsString({ message: "O id_clube deve ser uma string." })
  @IsNotEmpty({
    message: "O id_clube inicial é obrigatório para gerar o contrato.",
  })
  id_clube!: string;

  @IsOptional()
  @IsString()
  foto_perfil?: string;

  @IsOptional()
  @IsNumber({}, { message: "O peso deve ser um número." })
  @Min(0)
  peso?: number;

  @IsOptional()
  @IsNumber({}, { message: "A altura deve ser um número." })
  @Min(0)
  altura?: number;

  @IsString()
  @IsNotEmpty({ message: "O status do atleta é obrigatório." })
  status: string;
}
