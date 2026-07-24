import type { Request, Response } from "express";
import { getParam } from "../middleware/validate.middleware.js";
import * as roomService from "../services/room.service.js";

export async function getRooms(_req: Request, res: Response): Promise<void> {
  const rooms = await roomService.getRooms();
  res.status(200).json({ rooms });
}

export async function getRoom(req: Request, res: Response): Promise<void> {
  const room = await roomService.getRoomById(getParam(req, "id"));
  res.status(200).json({ room });
}

export async function createRoom(req: Request, res: Response): Promise<void> {
  const room = await roomService.createRoom(req.user!.id, req.body);
  res.status(201).json({ room });
}

export async function updateRoom(req: Request, res: Response): Promise<void> {
  const room = await roomService.updateRoom(getParam(req, "id"), req.body);
  res.status(200).json({ room });
}

export async function deleteRoom(req: Request, res: Response): Promise<void> {
  await roomService.deleteRoom(getParam(req, "id"));
  res.status(204).send();
}

export async function addMember(req: Request, res: Response): Promise<void> {
  const member = await roomService.addMember(getParam(req, "id"), req.body);
  res.status(201).json({ member });
}

export async function joinRoom(req: Request, res: Response): Promise<void> {
  const member = await roomService.joinRoom(getParam(req, "id"), req.user!.id);
  res.status(201).json({ member });
}
