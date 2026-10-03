import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError";

export function errorMiddleware(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (error instanceof AppError) {
    const response = {
      code: error.statusCode,
      message: error.message,
    };

    res.status(error.statusCode).json(response);
    return;
  }

  console.error(error);

  const response = {
    code: 500,
    message: "Internal server error",
  };

  res.status(500).json(response);
}
