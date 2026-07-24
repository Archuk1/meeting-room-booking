import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { JWT_EXPIRES_IN } from "../config/jwt.config.js";
import type { JwtPayload } from "../types/auth.types.js";

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, env.JWT_SECRET) as JwtPayload;
}
