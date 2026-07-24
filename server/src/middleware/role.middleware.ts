import type { NextFunction, Request, Response } from "express";
import type { RoomRole } from "@prisma/client";
import { getParam } from "./validate.middleware.js";
import { getMemberRole } from "../services/room.service.js";
import { ForbiddenError, UnauthorizedError } from "../utils/errors.js";

export function requireRoomRole(...allowedRoles: RoomRole[]) {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new UnauthorizedError("Не авторизовано");
      }

      const roomId = getParam(req, "id");
      const role = await getMemberRole(roomId, req.user.id);
      if (!role || !allowedRoles.includes(role)) {
        throw new ForbiddenError("Недостатньо прав");
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}
