import { randomUUID } from "crypto";
import { BadRequestError } from "../errors/BadRequestError.js";

export type propsUsuario = {
  id_usuario: string;
  nome: string;
  email: string;
  senha: string;
  role: "admin" | "mesario" | "gestor";
};

export class Usuario {
  private constructor(private readonly props: propsUsuario) {}

  public static construir(
    nome: string,
    email: string,
    senha: string,
    role: "admin" | "mesario" | "gestor",
  ) {
    // Validação do Dominio email
    if (!nome || nome.trim() === "") {
      throw new BadRequestError("O nome do usuário é obrigatório.");
    }
    if (!email || !email.includes("@")) {
      throw new BadRequestError("E-mail inválido.");
    }

    const props: propsUsuario = {
      id_usuario: randomUUID(),
      nome,
      email,
      senha,
      role,
    };
    return new Usuario(props);
  }

  public get id_usuario() {
    return this.props.id_usuario;
  }
  public get nome() {
    return this.props.nome;
  }
  public get email() {
    return this.props.email;
  }
  public get senha() {
    return this.props.senha;
  }
  public get role() {
    return this.props.role;
  }
}
