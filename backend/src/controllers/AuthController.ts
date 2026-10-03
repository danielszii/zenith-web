import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/AuthService.js";

export class AuthController {
  public constructor(private readonly authService: AuthService) {}

  async registrar(req: Request, res: Response, next: NextFunction) {
    try {
      const novoUsuario = await this.authService.cadastrarUsuario(req.body);
      return res.status(201).json(novoUsuario);
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, senha } = req.body;
      const dadosAutenticados = await this.authService.login(email, senha);
      return res.json(dadosAutenticados);
    } catch (error) {
      next(error);
    }
  }
}
