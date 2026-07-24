import { Router } from "express";
import { RoomRole } from "@prisma/client";
import {getRooms, getRoom, createRoom, updateRoom, deleteRoom, addMember, joinRoom} from "../controllers/room.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { requireRoomRole } from "../middleware/role.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { addMemberSchema, createRoomSchema, updateRoomSchema } from "../validations/room.validation.js";

const router = Router();

router.use(authMiddleware);

router.get("/", getRooms);
router.get("/:id", getRoom);
router.post("/", validate(createRoomSchema), createRoom);
router.put("/:id", requireRoomRole(RoomRole.ADMIN), validate(updateRoomSchema), updateRoom);
router.delete("/:id", requireRoomRole(RoomRole.ADMIN), deleteRoom);
router.post("/:id/members", requireRoomRole(RoomRole.ADMIN), validate(addMemberSchema), addMember);
router.post("/:id/join", joinRoom);

export default router;
