"use client";

import { useGames } from "@/api/booking";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useBookingStore } from "@/store/bookingStore";
import { IndianRupee, Loader2, Map, MapPinned, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const AllGames = () => {
  const [hasMounted, setHasMounted] = useState(false);
  const { games, setGames } = useBookingStore();
  const { data, isLoading } = useGames();
  const router = useRouter();

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (data?.games) {
      setGames(data.games);
    }
  }, [data, setGames]);

  if (!hasMounted) return null;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-48">
        <Loader2 className="animate-spin text-gray-500 mx-2" size={32} />
        Loading Venues...
      </div>
    );
  }

  const handleGameClick = (game: { id: string; name: string }) => {
    localStorage.setItem("gameId", game.id);
    router.push(
      `/schedule/${game.id}?id=${game.id}&name=${encodeURIComponent(game.name)}`
    );
  };

  if (!games?.length) {
    return (
      <div className="pt-10 text-xl text-center text-muted-foreground">
        No Venues found.
      </div>
    );
  }

  return (
    <div className="p-7">
      <h2 className="font-bold text-2xl pb-5">Venues Details</h2>

      <div className="flex gap-6 flex-wrap">
        {games.map((game) => (
          <Card
            key={game.id}
            className="w-[370px] gap-3 shadow-xl cursor-pointer"
            onClick={() => handleGameClick(game)}
          >
            <CardHeader className="gap-0">
              <CardTitle className="text-lg">{game.name}</CardTitle>
              <CardDescription className="text-lg">
                {game.category}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="flex items-center gap-2">
                <MapPinned size={18} />
                Address: {game.address}
              </p>
              <p className="flex items-center gap-2">
                <Users size={18} />
                Capacity: {game.capacity}
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
    </div>
  );
};

export default AllGames;
