import { getAllGames } from "@/api/booking";
import { getDashboardData } from "@/api/dashboard";
import { useBookingStore } from "@/store/bookingStore";
import { useDashboardStore } from "@/store/dashboardStore";
import { useEffect, useState } from "react";

const Games = () => {
  const { games, setGames } = useBookingStore();
  const { data, setDashboardData, selectedGameId, setSelectedGameId } =
    useDashboardStore();

  //   const [selectedGameId, setSelectedGameId] = useState<string | null>(null);

  useEffect(() => {
    const getGames = async () => {
      try {
        const result = await getAllGames();
        setGames(result.games);

        if (result.games?.length) {
          const defaultGameId = result.games[0].id;
          setSelectedGameId(defaultGameId);
          localStorage.setItem("gameId", defaultGameId);
          console.log("Default selected game:", result.games[0]);
        }
      } catch (error) {
        console.error("Error fetching games:", error);
      }
    };

    getGames();
  }, [setGames]);

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
    <div className="flex flex-col gap-4 pb-5">
      <div className="flex gap-12">
        {games?.map((game) => (
          <div
            key={game.id}
            className={`border rounded-xl px-30 py-1 cursor-pointer ${
              selectedGameId === game.id
                ? "bg-black text-white"
                : "hover:bg-black hover:text-white"
            }`}
            onClick={() => handleSelectGame(game)}
          >
            <p className="font-medium">{game.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Games;
