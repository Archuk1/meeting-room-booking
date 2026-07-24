import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import type { Room } from "@/api/room";

export function RoomCard({ room }: { room: Room }) {
  return (
    <Link href={`/rooms/${room.id}`}>
      <Card className="h-full transition-colors hover:border-zinc-400 dark:hover:border-zinc-600">
        <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">{room.name}</h3>
        {room.description && (
          <p className="mt-1 line-clamp-2 text-sm text-zinc-500 dark:text-zinc-400">{room.description}</p>
        )}
        <div className="mt-4 flex gap-2">
          <Badge>{room._count.members} учасник(ів)</Badge>
          <Badge variant="success">{room._count.bookings} бронювань</Badge>
        </div>
      </Card>
    </Link>
  );
}
