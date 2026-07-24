import { Router } from "express";
import {getBookings, createBooking, updateBooking, deleteBooking} from "../controllers/booking.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { createBookingSchema, updateBookingSchema } from "../validations/booking.validation.js";

const router = Router();

router.use(authMiddleware);

router.get("/", getBookings);
router.post("/", validate(createBookingSchema), createBooking);
router.put("/:id", validate(updateBookingSchema), updateBooking);
router.delete("/:id", deleteBooking);

export default router;
