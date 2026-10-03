import { IsString, IsNotEmpty, IsOptional, Length } from "class-validator";

export class CreateClubeDTO {
  @IsString()
  @IsNotEmpty({ message: "O nome do clube é obrigatório." })
  nome: string;

  @IsOptional()
  @IsString()
  brasao?: string;

  @IsOptional()
  @IsString()
  cores_oficiais?: string;

  @IsOptional()
  @IsString()
  responsavel?: string;

  @IsOptional()
  @IsString()
  @Length(14, 18, { message: "O CNPJ deve ter um formato válido." })
  cnpj?: string;
}
