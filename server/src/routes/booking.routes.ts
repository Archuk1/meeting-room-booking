import { Router } from "express";
import * as bookingController from "../controllers/booking.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { createBookingSchema, updateBookingSchema } from "../validations/booking.validation.js";

const router = Router();

router.use(authMiddleware);

router.get("/", bookingController.getBookings);
router.post("/", validate(createBookingSchema), bookingController.createBooking);
router.put("/:id", validate(updateBookingSchema), bookingController.updateBooking);
router.delete("/:id", bookingController.deleteBooking);

export default router;
