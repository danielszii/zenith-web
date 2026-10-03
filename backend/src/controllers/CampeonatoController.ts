import { Request, Response, NextFunction } from "express";
import { CampeonatoService } from "../services/CampeonatoService.js";

export class CampeonatoController {
  public constructor(private readonly CampeonatoService: CampeonatoService) {}

  async store(req: Request, res: Response, next: NextFunction) {
    try {
      const novoCampeonato = await this.CampeonatoService.criarCampeonato(
        req.body,
      );
      return res.status(201).json(novoCampeonato);
    } catch (error) {
      next(error);
    }
  }

  async index(req: Request, res: Response, next: NextFunction) {
    try {
      const campeonatos = await this.CampeonatoService.listarCampeonatos();
      return res.json(campeonatos);
    } catch (error) {
      next(error);
    }
  }

  async show(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const campeonato = await this.CampeonatoService.buscarPorId(String(id));
      return res.json(campeonato);
    } catch (error) {
      next(error);
    }
  }
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const atualizado = await this.CampeonatoService.atualizarCampeonato(
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
      await this.CampeonatoService.deletarCampeonato(String(id));
      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async inscreverClube(req: Request, res: Response, next: NextFunction) {
    try {
      const { id_campeonato, id_clube } = req.body;

      const novaInscricao = await this.CampeonatoService.inscreverClube(
        String(id_campeonato),
        String(id_clube),
      );
      return res.status(201).json(novaInscricao);
    } catch (error) {
      next(error);
    }
  }

  async showTabela(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const tabela = await this.CampeonatoService.gerarTabela(String(id));
      return res.json(tabela);
    } catch (error) {
      next(error);
    }
  }
}
