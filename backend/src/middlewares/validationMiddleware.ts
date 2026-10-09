import { Request, Response, NextFunction } from "express";
import { plainToInstance, type ClassConstructor } from "class-transformer";
import { validate, ValidationError } from "class-validator";
import { BadRequestError } from "../errors/BadRequestError.js";

export function validationMiddleware<T extends object>(type: ClassConstructor<T>, options: { partial?: boolean } = {}) {
  return async (req: Request, _res: Response, next: NextFunction) => {
    const dtoInstance = plainToInstance(type, req.body);

    const errors: ValidationError[] = await validate(dtoInstance, {
      forbidNonWhitelisted: true,
      skipMissingProperties: options.partial ?? false,
      whitelist: true,
    });

    if (errors.length > 0) {
      const messages = errors
        .map((error: ValidationError) => Object.values(error.constraints || {}))
        .flat()
        .join(", ");

      return next(new BadRequestError(messages));
    }

    req.body = dtoInstance;
    next();
  };
}
