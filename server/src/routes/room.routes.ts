import { Router } from "express";
import { RoomRole } from "@prisma/client";
import * as roomController from "../controllers/room.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { requireRoomRole } from "../middleware/role.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { addMemberSchema, createRoomSchema, updateRoomSchema } from "../validations/room.validation.js";

const router = Router();

router.use(authMiddleware);

router.get("/", roomController.getRooms);
router.get("/:id", roomController.getRoom);
router.post("/", validate(createRoomSchema), roomController.createRoom);
router.put("/:id", requireRoomRole(RoomRole.ADMIN), validate(updateRoomSchema), roomController.updateRoom);
router.delete("/:id", requireRoomRole(RoomRole.ADMIN), roomController.deleteRoom);
router.post("/:id/members", requireRoomRole(RoomRole.ADMIN), validate(addMemberSchema), roomController.addMember);

export default router;
