import { Request, Response, NextFunction } from "express";
import { AtletaService } from "../services/AtletaService.js";

export class AtletaController {
  public constructor(private readonly AtletaService: AtletaService) {}
  async store(req: Request, res: Response, next: NextFunction) {
    try {
      const novoAtleta = await this.AtletaService.registrarAtleta(req.body);

      return res.status(201).json(novoAtleta);
    } catch (error) {
      next(error);
    }
  }

  async index(req: Request, res: Response, next: NextFunction) {
    try {
      const atletas = await this.AtletaService.listarAtletas();
      return res.json(atletas);
    } catch (error) {
      next(error);
    }
  }

  async publicIndex(req: Request, res: Response, next: NextFunction) {
    try {
      const atletas = await this.AtletaService.listarAtletas();
      return res.json(atletas.map(toPublicAthlete));
    } catch (error) {
      next(error);
    }
  }

  async show(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const atleta = await this.AtletaService.buscarPorId(String(id));
      return res.json(atleta);
    } catch (error) {
      next(error);
    }
  }

  async publicShow(req: Request, res: Response, next: NextFunction) {
    try {
      const atleta = await this.AtletaService.buscarPorId(String(req.params.id));
      return res.json(toPublicAthlete(atleta));
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const atualizado = await this.AtletaService.atualizarAtleta(
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
      await this.AtletaService.deletarAtleta(String(id));
      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async obterEstatisticas(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const estatisticas = await this.AtletaService.obterEstatisticasCompleta(
        String(id),
      );

      return res.status(200).json(estatisticas);
    } catch (error) {
      next(error);
    }
  }
}

function toPublicAthlete(atleta: Awaited<ReturnType<AtletaService['buscarPorId']>>) {
  return {
    id_atleta: atleta.id_atleta,
    nome: atleta.nome,
    foto_perfil: atleta.foto_perfil ?? null,
    data_nasc: atleta.data_nasc,
    status: atleta.status,
    peso: atleta.peso ?? null,
    altura: atleta.altura ?? null,
    id_clube: atleta.id_clube,
  };
}
