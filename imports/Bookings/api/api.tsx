import { BookingRequest, Game } from "@/types/auth";
import Cookies from "js-cookie";

const token = Cookies.get("accessToken");

export const getAllGames = async (): Promise<{ games: Game[] }> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/game/all`,
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

    return { games: data.games };
  } catch (error) {
    console.error("Failed to fetch games", error);
    throw error;
  }
};

export const getGameById = async (
  date?: string
): Promise<{ games: Game[] }> => {
  const id = localStorage.getItem("gameId");

  if (!id || !token) {
    throw new Error("Missing game ID or token");
  }

  const dateObj = date ? new Date(date) : new Date();
  const day = String(dateObj.getDate()).padStart(2, "0");
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const year = String(dateObj.getFullYear());
  const formattedDate = `${day}-${month}-${year}`;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/booking/game/${id}/${formattedDate}`,
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
    console.log(data, "bygameId");
    return data;
  } catch (error) {
    console.error("Failed to fetch game by ID", error);
    throw error;
  }
};

export const createBooking = async (data: BookingRequest) => {
  if (!token) throw new Error("No auth token found");

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/booking/create`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `Request failed: ${response.status}`);
    }

    const res = await response.json();
    console.log("Booking created:", res);
    return res;
  } catch (error: any) {
    console.error("Error creating booking:", error);
    throw new Error(
      error.message || "Unknown error occurred while creating booking"
    );
  }
};
