import { ClubeRepository } from "../repositories/ClubeRepository.js";
import { CreateClubeDTO } from "../dtos/CreateClubeDTO.js";
import { Clube } from "../models/Clube.js";
import { NotFoundError } from "../errors/NotFoundError.js";

export class ClubeService {
  public constructor(private readonly clubeRepository: ClubeRepository) {}

  async criarClube(dados: CreateClubeDTO) {
    const clube = Clube.construir(
      dados.nome,
      dados.brasao,
      dados.cores_oficiais,
      dados.responsavel,
      dados.cnpj,
    );
    return await this.clubeRepository.create(clube);
  }

  async listarClubes() {
    return await this.clubeRepository.findAll();
  }

  async atualizarClube(id: string, dados: CreateClubeDTO) {
    return await this.clubeRepository.update(id, dados);
  }

  async deletarClube(id: string) {
    return await this.clubeRepository.delete(id);
  }

  async buscarPorId(id: string) {
    const clube = await this.clubeRepository.findById(id);
    if (!clube) {
      throw new NotFoundError("Clube não encontrado.");
    }
    return clube;
  }
}
