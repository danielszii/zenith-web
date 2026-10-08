import { randomUUID } from "crypto";
import { BadRequestError } from "../errors/BadRequestError.js";
import { ValidarCPF } from "../util/validarCPF.js";

export type propsAtleta = {
  id_atleta: string;
  nome: string;
  cpf: string;
  rg?: string;
  foto_perfil?: string;
  data_nasc: string | Date;
  tipo_sanguineo: string;
  id_clube: string;
  peso?: number;
  altura?: number;
  status?: string;
};

export class Atleta {
  private constructor(private readonly props: propsAtleta) {}
  public static construir(
    nome: string,
    cpf: string,
    data_nasc: string | Date,
    tipo_sanguineo: string,
    id_clube: string,
    rg?: string,
    foto_perfil?: string,
    peso?: number,
    altura?: number,
    status?: string,
  ) {
    if (!nome || !cpf || !data_nasc || !tipo_sanguineo || !id_clube) {
      throw new BadRequestError(
        "Os atributos nome, cpf, data de nascimento, tipo sanguíneo e id do clube não podem ser vazios",
      );
    }

    if (!ValidarCPF.validarCPF(cpf)) {
      throw new BadRequestError("CPF inválido");
    }

    const dataConvertida =
      typeof data_nasc === "string" ? new Date(data_nasc) : data_nasc;
    const props: propsAtleta = {
      id_atleta: randomUUID(),
      nome,
      cpf,
      rg,
      foto_perfil,
      data_nasc: dataConvertida,
      tipo_sanguineo,
      id_clube,
      peso,
      altura,
      status: status || "ativo",
    };
    return new Atleta(props);
  }

  public get id_atleta() {
    return this.props.id_atleta;
  }
  public get id_clube() {
    return this.props.id_clube;
  }
  public get nome() {
    return this.props.nome;
  }
  public get cpf() {
    return this.props.cpf;
  }
  public get rg() {
    return this.props.rg;
  }
  public get foto_perfil() {
    return this.props.foto_perfil;
  }
  public get data_nasc() {
    return this.props.data_nasc;
  }
  public get tipo_sanguineo() {
    return this.props.tipo_sanguineo;
  }
  public get peso() {
    return this.props.peso;
  }
  public get altura() {
    return this.props.altura;
  }
  public get status() {
    return this.props.status;
  }
}
