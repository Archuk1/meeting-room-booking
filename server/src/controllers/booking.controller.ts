import type { Request, Response } from "express";
import { getParam } from "../middleware/validate.middleware.js";
import * as bookingService from "../services/booking.service.js";

export async function getBookings(req: Request, res: Response): Promise<void> {
  const roomId = typeof req.query.roomId === "string" ? req.query.roomId : undefined;
  const bookings = await bookingService.getBookings(roomId);
  res.status(200).json({ bookings });
}

export async function getBooking(req: Request, res: Response): Promise<void> {
  const booking = await bookingService.getBookingById(getParam(req, "id"));
  res.status(200).json({ booking });
}

export async function createBooking(req: Request, res: Response): Promise<void> {
  const booking = await bookingService.createBooking(req.user!.id, req.body);
  res.status(201).json({ booking });
}

export async function updateBooking(req: Request, res: Response): Promise<void> {
  const booking = await bookingService.updateBooking(getParam(req, "id"), req.user!.id, req.body);
  res.status(200).json({ booking });
}

export async function deleteBooking(req: Request, res: Response): Promise<void> {
  await bookingService.deleteBooking(getParam(req, "id"), req.user!.id);
  res.status(204).send();
}
