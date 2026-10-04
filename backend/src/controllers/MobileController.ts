import { NextFunction, Request, Response } from 'express';
import { MobileService } from '../services/MobileService.js';

export class MobileController {
  constructor(private readonly service: MobileService) {}
  officials = async (_req: Request, res: Response, next: NextFunction) => { try { res.json(await this.service.officials()); } catch (e) { next(e); } };
  list = async (req: Request, res: Response, next: NextFunction) => { try { res.json(await this.service.list(req.usuarioLogado!.id, req.usuarioLogado!.role)); } catch (e) { next(e); } };
  package = async (req: Request, res: Response, next: NextFunction) => { try { res.json(await this.service.package(String(req.params.id), req.usuarioLogado!.id, req.usuarioLogado!.role)); } catch (e) { next(e); } };
  sync = async (req: Request, res: Response, next: NextFunction) => { try { res.json(await this.service.sync(req.usuarioLogado!.id, req.usuarioLogado!.role, req.body)); } catch (e) { next(e); } };
  assign = async (req: Request, res: Response, next: NextFunction) => { try { res.status(201).json(await this.service.assign(String(req.params.id), req.body.usuarioId)); } catch (e) { next(e); } };
}
