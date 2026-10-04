import { BadRequestError } from '../errors/BadRequestError.js';
import { MobileOperation, MobileRepository } from '../repositories/MobileRepository.js';

export class MobileService {
  constructor(private readonly repository: MobileRepository) {}
  officials() { return this.repository.listOfficials(); }
  list(userId: string, role: string) { return this.repository.listMatches(userId, role); }
  package(matchId: string, userId: string, role: string) { return this.repository.getPackage(matchId, userId, role); }
  assign(matchId: string, userId?: string) { if (!userId) throw new BadRequestError('usuarioId é obrigatório.'); return this.repository.assign(matchId, userId); }
  async sync(userId: string, role: string, body: unknown) {
    const operations = (body as { operations?: MobileOperation[] })?.operations;
    if (!Array.isArray(operations) || !operations.length) throw new BadRequestError('Envie ao menos uma operação.');
    if (operations.length > 1000) throw new BadRequestError('O lote excede o limite de 1000 operações.');
    for (const op of operations) if (!op?.operationId || !op.matchId || !op.entity || !op.action || !Number.isFinite(op.timestamp) || typeof op.data !== 'object') throw new BadRequestError('Operação mobile inválida.');
    return { acceptedOperationIds: await this.repository.sync(userId, role, operations) };
  }
}
