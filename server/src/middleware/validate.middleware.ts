import type { NextFunction, Request, Response } from "express";
import type { ZodType } from "zod";
import { ValidationError } from "../utils/errors.js";

type ValidationSource = "body" | "params" | "query";

export function validate(schema: ZodType, source: ValidationSource = "body") {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      const message = result.error.issues.map((issue) => issue.message).join(", ");
      next(new ValidationError(message));
      return;
    }

    if (source === "body") {
      req.body = result.data;
    }

    next();
  };
}

export function getParam(req: Request, name: string): string {
  const value = req.params[name];
  if (typeof value !== "string" || !value) {
    throw new ValidationError(`Параметр ${name} обов'язковий`);
  }
  return value;
}
