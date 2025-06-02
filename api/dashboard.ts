import { DashboardData } from "@/types/auth";
import { useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";

const token = Cookies.get("accessToken");

export const getDashboardData = async (
  venueId: string
): Promise<DashboardData> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/dashboard/game/${venueId}`,
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

export const useDashboardData = (venueId: string | undefined) => {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["dashboard-data", venueId],
    queryFn: () => {
      if (!venueId) throw new Error("No game ID provided");
      return getDashboardData(venueId);
    },
    enabled: !!venueId,
  });

  return { data, isLoading, isError, error, refetch };
};

export const fetchDashboardPDF = async (venueId: string) => {
  const token = Cookies.get("accessToken");

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/dashboard/export-report/${venueId}`,
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
