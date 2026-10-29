import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError.js";

export function errorMiddleware(
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (error instanceof AppError) {
    const response = {
      code: error.statusCode,
      message: error.message,
    };

    res.status(error.statusCode).json(response);
    return;
  }

  const databaseError = error as Error & { code?: string; constraint?: string };
  const hasDatabaseCode = (code: string) =>
    databaseError.code === code ||
    (databaseError.code === 'P2010' && databaseError.message.includes(`Code: \`${code}\``));
  if (hasDatabaseCode('23505')) {
    res.status(409).json({ code: 409, message: 'Já existe um registro com esses dados.' });
    return;
  }
  if (hasDatabaseCode('23503')) {
    res.status(409).json({ code: 409, message: 'A operação viola o vínculo com outro registro.' });
    return;
  }
  if (hasDatabaseCode('22P02')) {
    res.status(400).json({ code: 400, message: 'Um dos identificadores informados é inválido.' });
    return;
  }
  if (hasDatabaseCode('22001')) {
    res.status(400).json({ code: 400, message: 'Um dos campos ultrapassou o tamanho permitido.' });
    return;
  }
  if (hasDatabaseCode('23502')) {
    res.status(400).json({ code: 400, message: 'Um campo obrigatório não foi informado.' });
    return;
  }

  console.error(error);

  const response = {
    code: 500,
    message: "Internal server error",
  };

  res.status(500).json(response);
}
