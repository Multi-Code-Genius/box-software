"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Game } from "@/types/auth";
import { useBookingStore } from "@/store/bookingStore";
import BookingPage from "@/imports/booking/pages/BookingPage";

const SchedulePage = () => {
  const { id } = useParams();
  const { games } = useBookingStore();

  const [game, setGame] = useState<Game | null>(null);

  useEffect(() => {
    if (!id || games.length === 0) return;

    const foundGame = games.find((g) => g.id === id);
    setGame(foundGame ?? null);
  }, [id, games]);

  if (!game)
    return (
      <div>
        {" "}
        <div className="flex items-center justify-center w-full h-48">
          <Loader2 className="animate-spin text-gray-500" size={32} />
          <span className="ml-3 text-gray-600 text-lg">Loading...</span>
        </div>
      </div>
    );

  return (
    <div className="p-10 ">
      <p className="font-bold text-3xl pb-2">Bookings</p>
      <p className="text-sm ">Booking for : {game?.name}</p>
      <BookingPage game={game} />
    </div>
  );
};

export default SchedulePage;
