import Link from "next/link";
import type { RoomDetail } from "@/api/room";
import { Button } from "@/components/ui/Button";

interface RoomDetailsProps {
  room: RoomDetail;
  isAdmin: boolean;
  onDeleteClick: () => void;
}

export function RoomDetails({ room, isAdmin, onDeleteClick }: RoomDetailsProps) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        Створив: {room.createdBy.name} ({room.createdBy.email})
      </p>
      {room.description && <p className="text-zinc-700 dark:text-zinc-300">{room.description}</p>}
      {isAdmin && (
        <div className="flex gap-3">
          <Link href={`/rooms/${room.id}/edit`}>
            <Button variant="secondary">Редагувати</Button>
          </Link>
          <Button variant="danger" onClick={onDeleteClick}>
            Видалити
          </Button>
        </div>
      )}
    </div>
  );
}
