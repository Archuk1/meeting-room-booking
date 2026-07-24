import type { Response } from "express";
import { env } from "../config/env.js";
import { AUTH_COOKIE_MAX_AGE, AUTH_COOKIE_NAME } from "../config/jwt.config.js";

export function setAuthCookie(res: Response, token: string): void {
  res.cookie(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: AUTH_COOKIE_MAX_AGE,
  });
}

export function clearAuthCookie(res: Response): void {
  res.clearCookie(AUTH_COOKIE_NAME);
}
