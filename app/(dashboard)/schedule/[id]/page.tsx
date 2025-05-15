"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getAllGames } from "@/imports/Bookings/api/api";
import ScheduleCalendar from "@/imports/Bookings/ui/components/ScheduleCalendar";
import { CirclePlus, Loader2 } from "lucide-react";
import BookingForm from "@/imports/Bookings/ui/components/BookingForm";
import { Label } from "@/components/ui/label";
import { Game } from "@/types/auth";
import "../../../../styles/Calender.css";
import BookingPage from "@/imports/booking/pages/BookingPage";

const SchedulePage = () => {
  const { id } = useParams();
  const [game, setGame] = useState<Game | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchGame = async () => {
      const result = await getAllGames();

      const foundGame = result.games.find((g) => g.id === id);
      setGame(foundGame ?? null);
    };

    if (id) fetchGame();
  }, [id]);

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
      <p className="font-bold text-3xl pb-2">Boookings</p>
      <p className="text-sm ">Booking for : {game?.name}</p>
      <BookingPage game={game} />
    </div>
  );
};

export default SchedulePage;
