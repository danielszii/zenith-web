import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { UnauthorizedError } from '../errors/UnauthorizedError.js';

interface TokenPayload {
  id: string;
  role: 'admin' | 'mesario' | 'gestor';
}

declare global {
  namespace Express {
    interface Request {
      usuarioLogado?: TokenPayload;
    }
  }
}

export const authMiddleware = (req: Request, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    throw new UnauthorizedError('Token de autenticação não fornecido ou malformado.');
  }

  const token = authHeader.slice('Bearer '.length).trim();
  if (!token) throw new UnauthorizedError('Token de autenticação não fornecido.');

  try {
    const decoded = jwt.verify(token, env.jwtSecret) as TokenPayload;
    if (!decoded.id || !decoded.role) throw new Error('Payload inválido');
    req.usuarioLogado = { id: decoded.id, role: decoded.role };
    next();
  } catch {
    throw new UnauthorizedError('Token de autenticação inválido ou expirado.');
  }
};
