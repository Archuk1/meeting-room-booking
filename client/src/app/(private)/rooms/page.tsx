"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getRooms } from "@/api/room";
import { PageTitle } from "@/components/layout/PageTitle";
import { RoomList } from "@/components/room/RoomList";
import { Loading } from "@/components/shared/Loading";
import { ErrorMessage } from "@/components/shared/ErrorMessage";
import { Button } from "@/components/ui/Button";

export default function RoomsPage() {
  const {
    data: rooms,
    isPending,
    isError,
    error,
  } = useQuery({ queryKey: ["rooms"], queryFn: getRooms });

  return (
    <>
      <PageTitle
        title="Переговорні кімнати"
        action={
          <Link href="/rooms/create">
            <Button>Створити кімнату</Button>
          </Link>
        }
      />
      {isPending && <Loading />}
      {isError && <ErrorMessage message={error.message} />}
      {rooms && <RoomList rooms={rooms} />}
    </>
  );
}
