"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IndianRupee, Map, MapPinned, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { useBookingStore } from "@/store/bookingStore";
import { getAllGames } from "@/api/booking";

const AllGames = () => {
  const { games, setGames } = useBookingStore();
  const [loading, setLoading] = useState<boolean>(true);

  const router = useRouter();

  useEffect(() => {
    const getGames = async () => {
      try {
        const result = await getAllGames();
        setGames(result.games);
      } catch (error) {
        console.error("Error fetching games:", error);
      } finally {
        setLoading(false);
      }
    };

    getGames();
  }, []);

  return (
    <div className="p-10">
      <h2 className="font-bold text-2xl pb-8">Venues Details</h2>

      {loading ? (
        <div className="flex items-center justify-center w-full h-48">
          <Loader2 className="animate-spin text-gray-500" size={32} />
          <span className="ml-3 text-gray-600 text-lg">Loading...</span>
        </div>
      ) : games.length === 0 ? (
        <div className="flex items-center justify-center w-full h-48 text-gray-500 text-lg">
          No venues found.
        </div>
      ) : (
        <div className="flex gap-6 flex-wrap">
          {games.map((game) => (
            <Card
              key={game.id}
              className="w-[370px] gap-3 shadow-xl cursor-pointer"
              onClick={() => {
                localStorage.setItem("gameId", game.id);
                router.push(
                  `/schedule/${game.id}?id=${game.id}&name=${encodeURIComponent(
                    game.name
                  )}`
                );
              }}
            >
              <CardHeader className="gap-0">
                <CardTitle className="text-lg">{game?.name}</CardTitle>
                <CardDescription className="text-lg">
                  {game?.category}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="flex items-center gap-2">
                  <MapPinned size={18} />
                  Address: {game?.address}
                </p>
                <p className="flex items-center gap-2">
                  <Users size={18} />
                  Capacity: {game?.capacity}
                </p>
                <p className="flex items-center gap-2">
                  <IndianRupee size={18} />
                  Price: {game.hourlyPrice}
                </p>
                <p className="flex items-center gap-2">
                  <Map size={18} />
                  {game.location.area}, {game.location.city}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllGames;
