import type { NextFunction, Request, Response } from 'express';
import { MediaService } from '../services/MediaService.js';

export class MediaController {
  constructor(private readonly service: MediaService) {}

  upload = async (req: Request, res: Response, next: NextFunction) => {
    try {
      return res.status(201).json(await this.service.upload(req.body));
    } catch (error) {
      next(error);
    }
  };
}
