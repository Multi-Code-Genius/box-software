"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Game } from "@/types/auth";
import BookingPage from "@/imports/booking/pages/BookingPage";
import { useGames } from "@/api/booking";

const SchedulePage = () => {
  const params = useParams();
  const id = params?.id;
  const { data: games, isLoading, isError } = useGames();

  const [game, setGame] = useState<Game | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!id || games?.games.length === 0) return;
    const foundGame = games?.games.find((g) => g.id === id);
    setGame(foundGame ?? null);
  }, [id, games]);

  if (!mounted) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-48">
        <Loader2 className="animate-spin text-gray-500 mx-2" size={32} />
        Loading...
      </div>
    );
  }

  if (!game || isError) {
    return (
      <div className="flex items-center justify-center w-full h-48">
        <span className="text-gray-600 text-lg">
          {isError ? "Failed to load bookings." : "Bookings not found."}
        </span>
      </div>
    );
  }

  return (
    <div className="p-10">
      <p className="font-bold text-3xl pb-2">Bookings</p>
      <p className="text-sm">Booking for: {game.name}</p>
      <BookingPage game={game} />
    </div>
  );
};

export default SchedulePage;
