import { Request, Response, NextFunction } from "express";
import { plainToInstance } from "class-transformer";
import { validate, ValidationError } from "class-validator";
import { BadRequestError } from "../errors/BadRequestError.js";

export function validationMiddleware(type: any) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const dtoInstance = plainToInstance(type, req.body);

    const errors: ValidationError[] = await validate(dtoInstance);

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
