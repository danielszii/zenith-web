import { CampeonatoRepository } from "../repositories/CampeonatoRepository.js";
import { CreateCampeonatoDTO } from "../dtos/CreateCampeonatoDTO.js";
import { Campeonato } from "../models/Campeonato.js";
import { BusinessRuleError } from "../errors/BusinessRuleError.js";
import { NotFoundError } from "../errors/NotFoundError.js";

export class CampeonatoService {
  public constructor(
    private readonly campeonatoRepository: CampeonatoRepository,
  ) {}

  async criarCampeonato(dados: CreateCampeonatoDTO) {
    const campeonato = Campeonato.construir(
      dados.nome,
      new Date(dados.data_inicio),
      new Date(dados.data_fim),
      dados.modalidade,
      dados.status,
      dados.formato,
      dados.criterios_desempate,
      dados.categoria,
    ); // Validação básica usando o construtor da entidade
    return await this.campeonatoRepository.create(campeonato);
  }

  async listarCampeonatos() {
    return await this.campeonatoRepository.findAll();
  }

  async atualizarCampeonato(id: string, dados: Partial<CreateCampeonatoDTO>) {
    return await this.campeonatoRepository.update(id, dados);
  }

  async deletarCampeonato(id: string) {
    return await this.campeonatoRepository.delete(id);
  }

  async buscarPorId(id: string) {
    const campeonato = await this.campeonatoRepository.findById(id);
    if (!campeonato) {
      throw new NotFoundError("Campeonato não encontrado.");
    }
    return campeonato;
  }

  async inscreverClube(id_campeonato: string, id_clube: string) {
    if (!id_campeonato || !id_clube) {
      throw new BusinessRuleError(
        "Os identificadores do campeonato e do clube são obrigatórios.",
      );
    }

    const inscricaoExistente = await this.campeonatoRepository.findInscricao(
      id_campeonato,
      id_clube,
    );

    if (inscricaoExistente) {
      throw new BusinessRuleError(
        "Este clube já está inscrito neste campeonato.",
      );
    }

    return await this.campeonatoRepository.inscreverClube(
      id_campeonato,
      id_clube,
    );
  }

  async gerarTabela(id_campeonato: string) {
    // Valida se o campeonato existe (aproveita a lógica que você já tem)
    await this.buscarPorId(id_campeonato);
    return await this.campeonatoRepository.obterTabelaClassificacao(
      id_campeonato,
    );
  }
}
