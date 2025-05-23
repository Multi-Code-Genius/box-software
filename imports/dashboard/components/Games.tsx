import { useEffect, useState } from "react";
import { useGames } from "@/api/booking";
import { useBookingStore } from "@/store/bookingStore";
import { useDashboardStore } from "@/store/dashboardStore";
import { Loader2 } from "lucide-react";
import { useDashboardData } from "@/api/dashboard";

const Games = () => {
  const { games, setGames } = useBookingStore();
  const { setDashboardData, selectedGameId, setSelectedGameId } =
    useDashboardStore();

  const { data: dashboardData, isLoading: dashboardLoading } =
    useDashboardData(selectedGameId);

  const { data, isLoading: gamesLoading } = useGames();

  useEffect(() => {
    if (data?.games?.length) {
      setGames(data.games);

      if (!selectedGameId) {
        const defaultGameId = data.games[0].id;
        setSelectedGameId(defaultGameId);
        localStorage.setItem("gameId", defaultGameId);
      }
    }
  }, [data, setGames, setSelectedGameId, selectedGameId]);

  useEffect(() => {
    if (dashboardData) {
      setDashboardData(dashboardData);
      console.log("Dashboard data for game:", selectedGameId, dashboardData);
    }
  }, [dashboardData, setDashboardData, selectedGameId]);

  const handleSelectGame = (game: any) => {
    setSelectedGameId(game.id);
    localStorage.setItem("gameId", game.id);
    console.log("Selected Game ID:", game.id);
    console.log("Selected Game Data:", game);
  };

  return (
    <div className="flex flex-col gap-4 pb-3 overflow-auto">
      <div className="flex gap-2">
        {games?.map((game) => (
          <div
            key={game.id}
            className={`border rounded-lg px-6 py-2 cursor-pointer shadow-md flex items-center gap-2 transition ${
              selectedGameId === game.id
                ? "bg-gray-200 font-medium"
                : "hover:bg-gray-100"
            }`}
            onClick={() => handleSelectGame(game)}
          >
            <p className="text-sm">{game.name}</p>
            {selectedGameId === game.id && dashboardLoading && (
              <Loader2 className="h-4 w-4 animate-spin text-gray-600" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Games;
