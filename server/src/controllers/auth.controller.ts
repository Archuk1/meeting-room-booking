import type { Request, Response } from "express";
import * as authService from "../services/auth.service.js";
import { clearAuthCookie, setAuthCookie } from "../utils/cookies.js";

export async function register(req: Request, res: Response): Promise<void> {
  const { user, token } = await authService.register(req.body);
  setAuthCookie(res, token);
  res.status(201).json({ user });
}

export async function login(req: Request, res: Response): Promise<void> {
  const { user, token } = await authService.login(req.body);
  setAuthCookie(res, token);
  res.status(200).json({ user });
}

export function logout(_req: Request, res: Response): void {
  clearAuthCookie(res);
  res.status(200).json({ message: "Вихід виконано" });
}

export async function me(req: Request, res: Response): Promise<void> {
  const user = await authService.me(req.user!.id);
  res.status(200).json({ user });
}
