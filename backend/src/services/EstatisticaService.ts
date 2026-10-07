import { EstatisticaRepository } from '../repositories/EstatisticaRepository.js';

export class EstatisticaService {
  constructor(private readonly repository: EstatisticaRepository) {}

  obterCentral(idCampeonato?: string) {
    return this.repository.obterCentral(idCampeonato);
  }
}
