import { IsEmail, IsIn, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUsuarioDTO {
  @IsString({ message: 'O nome deve ser uma string.' })
  @IsNotEmpty({ message: 'O nome é obrigatório.' })
  nome!: string;

  @IsEmail({}, { message: 'O e-mail fornecido deve ser válido.' })
  @IsNotEmpty({ message: 'O e-mail é obrigatório.' })
  email!: string;

  @IsString({ message: 'A senha deve ser uma string.' })
  @IsNotEmpty({ message: 'A senha é obrigatória.' })
  @MinLength(8, { message: 'A senha deve ter pelo menos 8 caracteres.' })
  senha!: string;

  @IsString({ message: 'A função deve ser uma string.' })
  @IsIn(['admin', 'mesario', 'gestor'], { message: 'A função deve ser admin, mesario ou gestor.' })
  role!: 'admin' | 'mesario' | 'gestor';
}
