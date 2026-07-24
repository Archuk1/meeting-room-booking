import { api } from "@/lib/axios";
import type { CreateRoomFormValues, UpdateRoomFormValues } from "@/validations/room.schema";
import type { AddMemberFormValues } from "@/validations/member.schema";
import type { Booking } from "@/api/booking";

export type RoomMemberRole = "ADMIN" | "USER";

export interface RoomMemberUser {
  id: string;
  name: string;
  email: string;
}

export interface RoomMember {
  id: string;
  roomId: string;
  userId: string;
  role: RoomMemberRole;
  user: RoomMemberUser;
}

export interface Room {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  createdById: string;
  createdBy: RoomMemberUser;
  _count: { members: number; bookings: number };
}

export interface RoomDetail extends Omit<Room, "_count"> {
  members: RoomMember[];
  bookings: Booking[];
}

export async function getRooms(): Promise<Room[]> {
  const { data } = await api.get<{ rooms: Room[] }>("/rooms");
  return data.rooms;
}

export async function getRoom(id: string): Promise<RoomDetail> {
  const { data } = await api.get<{ room: RoomDetail }>(`/rooms/${id}`);
  return data.room;
}

export async function createRoom(values: CreateRoomFormValues): Promise<Room> {
  const { data } = await api.post<{ room: Room }>("/rooms", values);
  return data.room;
}

export async function updateRoom(id: string, values: UpdateRoomFormValues): Promise<Room> {
  const { data } = await api.put<{ room: Room }>(`/rooms/${id}`, values);
  return data.room;
}

export async function deleteRoom(id: string): Promise<void> {
  await api.delete(`/rooms/${id}`);
}

export async function addMember(roomId: string, values: AddMemberFormValues): Promise<RoomMember> {
  const { data } = await api.post<{ member: RoomMember }>(`/rooms/${roomId}/members`, values);
  return data.member;
}

export async function joinRoom(roomId: string): Promise<RoomMember> {
  const { data } = await api.post<{ member: RoomMember }>(`/rooms/${roomId}/join`);
  return data.member;
}
