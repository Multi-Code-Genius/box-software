import { getAllGames, useGames } from "@/api/booking";
import { getDashboardData } from "@/api/dashboard";
import { useBookingStore } from "@/store/bookingStore";
import { useDashboardStore } from "@/store/dashboardStore";
import { useEffect, useState } from "react";

const Games = () => {
  const { games, setGames } = useBookingStore();
  const { setDashboardData, selectedGameId, setSelectedGameId } =
    useDashboardStore();

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") || "" : "";

  const { data, isLoading, isError, error } = useGames();

  useEffect(() => {
    if (data?.games?.length) {
      setGames(data.games);

      const defaultGameId = data.games[0].id;
      setSelectedGameId(defaultGameId);
      localStorage.setItem("gameId", defaultGameId);
    }
  }, [data, setGames, setSelectedGameId]);

  console.log(data);

  useEffect(() => {
    getAllGames();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedGameId) return;

      try {
        const result = await getDashboardData(selectedGameId);
        setDashboardData(result);
        console.log("Dashboard data for game:", selectedGameId, result);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchData();
  }, [selectedGameId, setDashboardData]);

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
            className={`border rounded-lg px-10 py-1 cursor-pointer shadow-md ${
              selectedGameId === game.id
                ? "bg-gray-200 font-medium"
                : "hover:bg-gray-200  "
            }`}
            onClick={() => handleSelectGame(game)}
          >
            <p className="text-sm">{game.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Games;
