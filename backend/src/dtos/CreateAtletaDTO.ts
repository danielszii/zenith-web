import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl, IsUUID, Min } from 'class-validator';

export class CreateAtletaDTO {
  @IsString()
  @IsNotEmpty({ message: 'O nome do atleta é obrigatório.' })
  nome!: string;

  @IsString()
  @IsNotEmpty({ message: 'O CPF é obrigatório.' })
  cpf!: string;

  @IsOptional()
  @IsString()
  rg?: string;

  @IsDateString({}, { message: 'A data de nascimento deve estar no formato AAAA-MM-DD.' })
  data_nasc!: string;

  @IsString()
  @IsNotEmpty({ message: 'O tipo sanguíneo é obrigatório.' })
  tipo_sanguineo!: string;

  @IsUUID('4', { message: 'O clube deve ter um UUID válido.' })
  id_clube!: string;

  @IsOptional()
  @IsUrl({}, { message: 'A foto de perfil deve ser uma URL válida.' })
  foto_perfil?: string;

  @IsOptional()
  @IsNumber({}, { message: 'O peso deve ser um número.' })
  @Min(0)
  peso?: number;

  @IsOptional()
  @IsNumber({}, { message: 'A altura deve ser um número.' })
  @Min(0)
  altura?: number;

  @IsString()
  @IsNotEmpty({ message: 'O status do atleta é obrigatório.' })
  status!: string;
}
