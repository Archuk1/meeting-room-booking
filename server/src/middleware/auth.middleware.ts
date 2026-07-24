import type { NextFunction, Request, Response } from "express";
import { AUTH_COOKIE_NAME } from "../config/jwt.config.js";
import { UnauthorizedError } from "../utils/errors.js";
import { verifyToken } from "../utils/jwt.js";

export function authMiddleware(req: Request, _res: Response, next: NextFunction): void {
  const token: unknown = req.cookies?.[AUTH_COOKIE_NAME];

  if (typeof token !== "string" || !token) {
    next(new UnauthorizedError("Не авторизовано"));
    return;
  }

  try {
    const payload = verifyToken(token);
    req.user = { id: payload.userId, email: payload.email };
    next();
  } catch {
    next(new UnauthorizedError("Недійсний токен"));
  }
}
