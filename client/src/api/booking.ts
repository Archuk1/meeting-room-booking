import { api } from "@/lib/axios";
import type { BookingFormValues } from "@/validations/booking.schema";

export interface BookingUser {
  id: string;
  name: string;
  email: string;
}

export interface Booking {
  id: string;
  title: string;
  description: string | null;
  startTime: string;
  endTime: string;
  roomId: string;
  userId: string;
  room: { id: string; name: string };
  user: BookingUser;
}

export async function getBookings(roomId?: string): Promise<Booking[]> {
  const { data } = await api.get<{ bookings: Booking[] }>("/bookings", {
    params: roomId ? { roomId } : undefined,
  });
  return data.bookings;
}

export async function getBooking(id: string): Promise<Booking> {
  const { data } = await api.get<{ booking: Booking }>(`/bookings/${id}`);
  return data.booking;
}

export async function createBooking(values: BookingFormValues & { roomId: string }): Promise<Booking> {
  const { data } = await api.post<{ booking: Booking }>("/bookings", values);
  return data.booking;
}

export async function updateBooking(id: string, values: BookingFormValues): Promise<Booking> {
  const { data } = await api.put<{ booking: Booking }>(`/bookings/${id}`, values);
  return data.booking;
}

export async function deleteBooking(id: string): Promise<void> {
  await api.delete(`/bookings/${id}`);
}
