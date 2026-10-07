import type { NextFunction, Request, Response } from 'express';
import { EstatisticaService } from '../services/EstatisticaService.js';

export class EstatisticaController {
  constructor(private readonly service: EstatisticaService) {}

  async index(req: Request, res: Response, next: NextFunction) {
    try {
      const campeonato = typeof req.query.campeonato === 'string' ? req.query.campeonato : undefined;
      return res.json(await this.service.obterCentral(campeonato));
    } catch (error) {
      next(error);
    }
  }
}
