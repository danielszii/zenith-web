import { Request, Response, NextFunction } from "express";
import { EventoService } from "../services/EventoService.js";

export class EventoController {
  public constructor(private readonly EventoService: EventoService) {}

  async store(req: Request, res: Response, next: NextFunction) {
    try {
      const novoEvento = await this.EventoService.lancarEvento(req.body);
      return res.status(201).json(novoEvento);
    } catch (error) {
      next(error);
    }
  }
}
