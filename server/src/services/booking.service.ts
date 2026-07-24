import { Prisma, RoomRole } from "@prisma/client";
import prisma from "../db/prisma.js";
import { ConflictError, ForbiddenError, NotFoundError } from "../utils/errors.js";
import { getMemberRole } from "./room.service.js";
import type { CreateBookingInput, UpdateBookingInput } from "../validations/booking.validation.js";

const SERIALIZATION_FAILURE_CODE = "P2034";
const MAX_TRANSACTION_ATTEMPTS = 3;

async function runSerializableTransaction<T>(
  fn: (tx: Prisma.TransactionClient) => Promise<T>,
): Promise<T> {
  for (let attempt = 1; attempt <= MAX_TRANSACTION_ATTEMPTS; attempt++) {
    try {
      return await prisma.$transaction(fn, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
    } catch (error) {
      const isSerializationFailure =
        error instanceof Prisma.PrismaClientKnownRequestError && error.code === SERIALIZATION_FAILURE_CODE;
      if (!isSerializationFailure || attempt === MAX_TRANSACTION_ATTEMPTS) {
        throw error;
      }
    }
  }
  throw new Error("unreachable");
}

export async function getBookings(roomId?: string) {
  return prisma.booking.findMany({
    ...(roomId ? { where: { roomId } } : {}),
    include: {
      room: { select: { id: true, name: true } },
      user: { select: { id: true, name: true, email: true } },
    },
    orderBy: { startTime: "asc" },
  });
}

export async function getBookingById(bookingId: string) {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      room: { select: { id: true, name: true } },
      user: { select: { id: true, name: true, email: true } },
    },
  });
  if (!booking) {
    throw new NotFoundError("Бронювання не знайдено");
  }
  return booking;
}

export async function createBooking(userId: string, input: CreateBookingInput) {
  const role = await getMemberRole(input.roomId, userId);
  if (!role) {
    throw new ForbiddenError("Ви не є учасником цієї кімнати");
  }

  return runSerializableTransaction(async (tx) => {
    const conflict = await tx.booking.findFirst({
      where: {
        roomId: input.roomId,
        startTime: { lt: input.endTime },
        endTime: { gt: input.startTime },
      },
    });
    if (conflict) {
      throw new ConflictError("Кімната вже заброньована на цей час");
    }

    return tx.booking.create({
      data: {
        title: input.title,
        description: input.description ?? null,
        startTime: input.startTime,
        endTime: input.endTime,
        roomId: input.roomId,
        userId,
      },
    });
  });
}

export async function updateBooking(bookingId: string, userId: string, input: UpdateBookingInput) {
  const booking = await getBookingById(bookingId);
  await ensureCanManageBooking(booking.roomId, booking.userId, userId);

  const startTime = input.startTime ?? booking.startTime;
  const endTime = input.endTime ?? booking.endTime;

  return runSerializableTransaction(async (tx) => {
    const conflict = await tx.booking.findFirst({
      where: {
        id: { not: bookingId },
        roomId: booking.roomId,
        startTime: { lt: endTime },
        endTime: { gt: startTime },
      },
    });
    if (conflict) {
      throw new ConflictError("Кімната вже заброньована на цей час");
    }

    return tx.booking.update({
      where: { id: bookingId },
      data: {
        ...(input.title !== undefined ? { title: input.title } : {}),
        ...(input.description !== undefined ? { description: input.description } : {}),
        ...(input.startTime !== undefined ? { startTime: input.startTime } : {}),
        ...(input.endTime !== undefined ? { endTime: input.endTime } : {}),
      },
    });
  });
}

export async function deleteBooking(bookingId: string, userId: string): Promise<void> {
  const booking = await getBookingById(bookingId);
  await ensureCanManageBooking(booking.roomId, booking.userId, userId);
  await prisma.booking.delete({ where: { id: bookingId } });
}

async function ensureCanManageBooking(roomId: string, ownerId: string, requesterId: string): Promise<void> {
  if (ownerId === requesterId) {
    return;
  }
  const role = await getMemberRole(roomId, requesterId);
  if (role !== RoomRole.ADMIN) {
    throw new ForbiddenError("Недостатньо прав для керування цим бронюванням");
  }
}
