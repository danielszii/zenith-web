import { randomUUID } from "crypto";
import { BadRequestError } from "../errors/BadRequestError.js";

export type propsClube = {
  id_clube: string;
  nome: string;
  brasao?: string;
  cores_oficiais?: string;
  responsavel?: string;
  cnpj?: string;
};

export class Clube {
  private constructor(private readonly props: propsClube) {}

  public static construir(
    nome: string,
    brasao?: string,
    cores_oficiais?: string,
    responsavel?: string,
    cnpj?: string,
  ) {
    if (!nome || !responsavel || !cnpj) {
      throw new BadRequestError(
        "Os atributos nome, responsável e CNPJ não podem ser vazios",
      );
    }

    const props: propsClube = {
      id_clube: randomUUID(),
      nome,
      brasao,
      cores_oficiais,
      responsavel,
      cnpj,
    };

    return new Clube(props);
  }

  public get id_clube() {
    return this.props.id_clube;
  }
  public get nome() {
    return this.props.nome;
  }
  public get brasao() {
    return this.props.brasao;
  }
  public get cores_oficiais() {
    return this.props.cores_oficiais;
  }
  public get responsavel() {
    return this.props.responsavel;
  }
  public get cnpj() {
    return this.props.cnpj;
  }
}
