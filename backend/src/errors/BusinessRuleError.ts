import { AppError } from "./AppError.js";

export class BusinessRuleError extends AppError {
  constructor(message: string) {
    super(message, 422);
  }
}
