import type { Request, Response } from "express";
import * as userService from "../services/user.service.js";

export async function searchByEmail(req: Request, res: Response): Promise<void> {
  const email = typeof req.query.email === "string" ? req.query.email : "";
  const users = await userService.searchByEmail(email);
  res.status(200).json({ users });
}
