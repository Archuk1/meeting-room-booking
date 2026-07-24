import type { Room } from "@/api/room";
import { RoomCard } from "./RoomCard";
import { EmptyState } from "@/components/shared/EmptyState";

export function RoomList({ rooms }: { rooms: Room[] }) {
  if (rooms.length === 0) {
    return <EmptyState title="Кімнат ще немає" description="Створіть першу переговорну кімнату" />;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {rooms.map((room) => (
        <RoomCard key={room.id} room={room} />
      ))}
    </div>
  );
}
