import { IsNotEmpty, IsString, IsEmail, IsIn, MinLength } from "class-validator";

export class CreateUsuarioDTO {
  @IsString({ message: "O nome deve ser uma string." })
  @IsNotEmpty({ message: "O nome é obrigatório." })
  nome!: string;

  @IsEmail(
    {},
    { message: "O e-mail fornecido deve ser um endereço de e-mail válido." },
  )
  @IsNotEmpty({ message: "O e-mail é obrigatório." })
  email!: string;

  @IsString({ message: "A senha deve ser uma string." })
  @IsNotEmpty({ message: "A senha é obrigatória." })
  senha!: string;

  @IsString({ message: "A role deve ser uma string." })
  @IsNotEmpty({ message: "A role é obrigatória." })
  @IsIn(["admin", "mesario", "gestor"], {
    message:
      "A role fornecida é inválida. Os valores aceitos são: admin, mesario ou gestor.",
  })
  role!: "admin" | "mesario" | "gestor";
}
