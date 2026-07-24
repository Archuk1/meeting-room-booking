import { Router } from "express";
import {searchByEmail} from "../controllers/user.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

router.use(authMiddleware);

router.get("/search", searchByEmail);

export default router;
