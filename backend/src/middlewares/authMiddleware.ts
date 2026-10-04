import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { BusinessRuleError } from "../errors/BusinessRuleError.js";
import { env } from "../config/env.js";

const JWT_SECRET = env.jwtSecret;

interface TokenPayload {
  id: string;
  role: "admin" | "mesario" | "gestor";
}

declare global {
  namespace Express {
    interface Request {
      usuarioLogado?: TokenPayload;
    }
  }
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  // 2. Extrai o token de forma direta dividindo a string pelo espaço
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new BusinessRuleError("Token de autenticação não fornecido ou malformado.");
  }

  const [, token] = authHeader.split(" ");

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    req.usuarioLogado = { id: decoded.id, role: decoded.role };
    
    return next();
  } catch {
    throw new BusinessRuleError("Token de autenticação inválido ou expirado.");
  }
};
