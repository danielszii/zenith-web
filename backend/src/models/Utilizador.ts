import { randomUUID } from "crypto";
import { BadRequestError } from "../errors/BadRequestError.js";

export type propsUtilizador = {
  id_utilizador: string;
  nome: string;
  email: string;
  senha?: string;
  perfil: string;
};

export class Utilizador {
  private constructor(private readonly props: propsUtilizador) {}

  public static construir(
    nome: string,
    email: string,
    senha: string,
    perfil: string,
  ) {
    if (!nome || !email || !senha || !perfil) {
      throw new BadRequestError("Todos os atributos são obrigatórios");
    }

    const props: propsUtilizador = {
      id_utilizador: randomUUID(),
      nome,
      email,
      senha,
      perfil,
    };
    return new Utilizador(props);
  }

  public get id_utilizador() {
    return this.props.id_utilizador;
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
  public get perfil() {
    return this.props.perfil;
  }
}
