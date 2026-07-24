import { RoomRole } from "@prisma/client";
import prisma from "../db/prisma.js";
import { ConflictError, NotFoundError } from "../utils/errors.js";
import type { AddMemberInput, CreateRoomInput, UpdateRoomInput } from "../validations/room.validation.js";

export async function getMemberRole(roomId: string, userId: string): Promise<RoomRole | null> {
  const member = await prisma.roomMember.findUnique({
    where: { roomId_userId: { roomId, userId } },
  });
  return member?.role ?? null;
}

export async function getRooms() {
  return prisma.meetingRoom.findMany({
    include: {
      createdBy: { select: { id: true, name: true, email: true } },
      _count: { select: { members: true, bookings: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getRoomById(roomId: string) {
  const room = await prisma.meetingRoom.findUnique({
    where: { id: roomId },
    include: {
      createdBy: { select: { id: true, name: true, email: true } },
      members: { include: { user: { select: { id: true, name: true, email: true } } } },
      bookings: {
        include: {
          user: { select: { id: true, name: true, email: true } },
          room: { select: { id: true, name: true } },
        },
        orderBy: { startTime: "asc" },
      },
    },
  });
  if (!room) {
    throw new NotFoundError("Кімнату не знайдено");
  }
  return room;
}

export async function createRoom(userId: string, input: CreateRoomInput) {
  return prisma.$transaction(async (tx) => {
    const room = await tx.meetingRoom.create({
      data: {
        name: input.name,
        description: input.description ?? null,
        createdById: userId,
      },
    });
    await tx.roomMember.create({
      data: { roomId: room.id, userId, role: RoomRole.ADMIN },
    });
    return room;
  });
}

export async function updateRoom(roomId: string, input: UpdateRoomInput) {
  await ensureRoomExists(roomId);
  return prisma.meetingRoom.update({
    where: { id: roomId },
    data: {
      ...(input.name !== undefined ? { name: input.name } : {}),
      ...(input.description !== undefined ? { description: input.description } : {}),
    },
  });
}

export async function deleteRoom(roomId: string) {
  await ensureRoomExists(roomId);
  await prisma.meetingRoom.delete({ where: { id: roomId } });
}

export async function addMember(roomId: string, input: AddMemberInput) {
  await ensureRoomExists(roomId);

  const user = await prisma.user.findUnique({ where: { email: input.email } });
  if (!user) {
    throw new NotFoundError("Користувача з таким email не знайдено");
  }

  const existingMember = await prisma.roomMember.findUnique({
    where: { roomId_userId: { roomId, userId: user.id } },
  });
  if (existingMember) {
    throw new ConflictError("Користувач вже є учасником кімнати");
  }

  return prisma.roomMember.create({
    data: { roomId, userId: user.id, role: input.role ?? RoomRole.USER },
    include: { user: { select: { id: true, name: true, email: true } } },
  });
}

export async function joinRoom(roomId: string, userId: string) {
  await ensureRoomExists(roomId);

  const existingMember = await prisma.roomMember.findUnique({
    where: { roomId_userId: { roomId, userId } },
  });
  if (existingMember) {
    throw new ConflictError("Ви вже є учасником кімнати");
  }

  return prisma.roomMember.create({
    data: { roomId, userId, role: RoomRole.USER },
    include: { user: { select: { id: true, name: true, email: true } } },
  });
}

async function ensureRoomExists(roomId: string): Promise<void> {
  const room = await prisma.meetingRoom.findUnique({ where: { id: roomId } });
  if (!room) {
    throw new NotFoundError("Кімнату не знайдено");
  }
}
