import { DashboardData } from "@/types/auth";
import { useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";

const token = Cookies.get("accessToken");

export const getDashboardData = async (
  gameId: string
): Promise<DashboardData> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/dashboard/game/${gameId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`status:${response.status}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Failed to fetch dashboard data", error);
    throw error;
  }
};

export const useDashboardData = (gameId: string | undefined) => {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["dashboard-data", gameId],
    queryFn: () => {
      if (!gameId) throw new Error("No game ID provided");
      return getDashboardData(gameId);
    },
    enabled: !!gameId,
  });

  return { data, isLoading, isError, error, refetch };
};

export const fetchDashboardPDF = async (gameId: string) => {
  const token = Cookies.get("accessToken");

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/dashboard/export-report/${gameId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch dashboard report");
  }

  return res.blob();
};
