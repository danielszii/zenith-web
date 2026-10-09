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
  if (databaseError.code === '23505') {
    res.status(409).json({ code: 409, message: 'Já existe um registro com esses dados.' });
    return;
  }
  if (databaseError.code === '23503') {
    res.status(409).json({ code: 409, message: 'A operação viola o vínculo com outro registro.' });
    return;
  }
  if (databaseError.code === '22P02') {
    res.status(400).json({ code: 400, message: 'Um dos identificadores informados é inválido.' });
    return;
  }

  console.error(error);

  const response = {
    code: 500,
    message: "Internal server error",
  };

  res.status(500).json(response);
}
