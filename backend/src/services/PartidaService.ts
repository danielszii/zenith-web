import { PartidaRepository } from "../repositories/PartidaRepository.js";
import { EventoRepository } from "../repositories/EventoRepository.js";
import { CreatePartidaDTO } from "../dtos/CreatePartidaDTO.js";
import { Partida } from "../models/Partida.js";
import { NotFoundError } from "../errors/NotFoundError.js";
import { BusinessRuleError } from "../errors/BusinessRuleError.js";

export class PartidaService {
  public constructor(
    private readonly PartidaRepository: PartidaRepository,
    private readonly EventoRepository: EventoRepository,
  ) {}

  async agendarPartida(dados: CreatePartidaDTO) {
    if (String(dados.id_mandante) === String(dados.id_visitante)) {
      throw new BusinessRuleError(
        "O clube mandante não pode ser igual ao clube visitante.",
      );
    }

    const novaPartida = Partida.construir(
      String(dados.id_campeonato),
      String(dados.id_mandante),
      String(dados.id_visitante),
      dados.local,
      new Date(dados.data),
      dados.hora,
      dados.status,
    );
    return await this.PartidaRepository.create(novaPartida);
  }

  async listarPartidas() {
    return await this.PartidaRepository.findAll();
  }

  async deletarPartida(id: string) {
    return await this.PartidaRepository.delete(id);
  }

  async buscarPorId(id: string) {
    const partida = await this.PartidaRepository.findById(id);
    if (!partida) {
      throw new NotFoundError("Partida não encontrada.");
    }
    return partida;
  }

  async obterSumulaCompleta(id_partida: string) {
    const partida = await this.PartidaRepository.findSumulaDados(id_partida);
    if (!partida) throw new NotFoundError("Partida não encontrada.");

    const eventos = await this.EventoRepository.findByPartida(id_partida);

    return {
      detalhes_partida: partida,
      sumula_eventos: eventos,
    };
  }

  async alterarStatus(
    id: string,
    novoStatus: "agendado" | "em_andamento" | "encerrado" | "cancelado",
  ) {
    const partida = await this.buscarPorId(id);
    const statusAtual = partida.status;

    if (statusAtual === "encerrado") {
      throw new BusinessRuleError(
        "A partida já foi encerrada. O status não pode ser alterado.",
      );
    }
    if (statusAtual === "cancelado") {
      throw new BusinessRuleError(
        "Esta partida foi cancelada e não pode ser reativada.",
      );
    }
    // Permitir apenas as transições lógicas do futebol
    if (statusAtual === "agendado" && novoStatus === "encerrado") {
      throw new BusinessRuleError(
        "Não é possível encerrar uma partida que não está em andamento.",
      );
    }
    if (statusAtual === "em_andamento" && novoStatus === "agendado") {
      throw new BusinessRuleError(
        "A partida já iniciou. Ela não pode voltar a ser agendada.",
      );
    }
    if (statusAtual === novoStatus) {
      throw new BusinessRuleError(
        `A partida já encontra-se com o status '${novoStatus}'.`,
      );
    }

    return await this.PartidaRepository.updateStatus(id, novoStatus);
  }

  async validarEscalacao(
    id_partida: string,
    id_clube: string,
    ids_atletas: string[],
  ) {
    const partida = await this.PartidaRepository.findSumulaDados(id_partida);

    if (!partida) {
      throw new NotFoundError("Partida não encontrada.");
    }

    if (partida.status !== "agendado") {
      throw new BusinessRuleError(
        "A validação dos jogadores só pode ser feita antes do jogo começar.",
      );
    }

    const jogadoresSuspensos = [];

    for (const id_atleta of ids_atletas) {
      const estaSuspenso =
        await this.EventoRepository.verificarSuspensaoPartidaAnterior(
          id_atleta,
          id_clube,
          partida.id_campeonato,
          partida.data,
        );

      if (estaSuspenso) {
        jogadoresSuspensos.push(id_atleta);
      }
    }

    if (jogadoresSuspensos.length > 0) {
      throw new BusinessRuleError(
        `Validação falhou. Os seguintes atletas estão suspensos pelo cartão vermelho no jogo anterior: ${jogadoresSuspensos.join(", ")}`,
      );
    }

    return {
      valido: true,
      mensagem: "Todos os jogadores estão liberados para a partida.",
    };
  }
}
