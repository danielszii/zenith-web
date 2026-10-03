import { Request, Response, NextFunction } from "express";
import { ClubeService } from "../services/ClubeService.js";

export class ClubeController {
  public constructor(private readonly ClubeService: ClubeService) {}

  async store(req: Request, res: Response, next: NextFunction) {
    try {
      const novoClube = await this.ClubeService.criarClube(req.body);

      return res.status(201).json(novoClube);
    } catch (error) {
      next(error);
    }
  }

  async index(req: Request, res: Response, next: NextFunction) {
    try {
      const clubes = await this.ClubeService.listarClubes();
      return res.json(clubes);
    } catch (error) {
      next(error);
    }
  }
  async show(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const clube = await this.ClubeService.buscarPorId(String(id));
      return res.json(clube);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const atualizado = await this.ClubeService.atualizarClube(
        String(id),
        req.body,
      );
      return res.json(atualizado);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await this.ClubeService.deletarClube(String(id));
      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
