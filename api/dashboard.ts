import { DashboardData, Game } from "@/types/auth";
import Cookies from "js-cookie";

const token = Cookies.get("accessToken");

export const getDashboardData = async (gameId: any): Promise<DashboardData> => {
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
    console.log(data);
    return data;
  } catch (error) {
    console.error("Failed to fetch dashboard data", error);
    throw error;
  }
};
