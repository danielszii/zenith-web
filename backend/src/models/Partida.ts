import { randomUUID } from "crypto";
import { BadRequestError } from "../errors/BadRequestError.js";

export type propsPartida = {
  id_partida: string;
  id_campeonato: string;
  id_mandante: string;
  id_visitante: string;
  local: string;
  data: Date;
  hora: string;
  status?: "agendado" | "em_andamento" | "encerrado" | "cancelado";
};

export class Partida {
  private constructor(private readonly props: propsPartida) {}

  public static construir(
    id_campeonato: string,
    id_mandante: string,
    id_visitante: string,
    local: string,
    data: Date,
    hora: string,
    status?: "agendado" | "em_andamento" | "encerrado" | "cancelado",
  ) {
    if (
      !id_campeonato ||
      !id_mandante ||
      !id_visitante ||
      !local ||
      !data ||
      !hora
    ) {
      throw new BadRequestError("Todos os atributos são obrigatórios");
    }

    const props: propsPartida = {
      id_partida: randomUUID(),
      id_campeonato,
      id_mandante,
      id_visitante,
      local,
      data,
      hora,
      status,
    };
    return new Partida(props);
  }

  public get id_partida() {
    return this.props.id_partida;
  }
  public get id_campeonato() {
    return this.props.id_campeonato;
  }
  public get id_mandante() {
    return this.props.id_mandante;
  }
  public get id_visitante() {
    return this.props.id_visitante;
  }
  public get local() {
    return this.props.local;
  }
  public get data() {
    return this.props.data;
  }
  public get hora() {
    return this.props.hora;
  }
  public get status() {
    return this.props.status;
  }
}
