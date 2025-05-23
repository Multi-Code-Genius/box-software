import { api } from "@/lib/api";
import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Game } from "@/types/auth";
import Cookies from "js-cookie";

const token = Cookies.get("accessToken");

const fetchBooking = async (data: { date: string; gameId: string }) => {
  try {
    const response = await api(
      `/api/booking/game/${data.gameId}/${data.date}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      }
    );
    const resp = await response;
    return resp;
  } catch (error) {
    console.error("Booking Response:", error);
    throw new Error(error instanceof Error ? error.message : "Data Not Found");
  }
};

export const useBookingInfo = (data: { date: string; gameId: string }) => {
  return useQuery({
    queryKey: ["booking", data.date, data.gameId],
    queryFn: () => fetchBooking(data),
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    retry: 0,
  });
};

export const useBookingMutation = (
  onSuccess?: () => void,
  onError?: () => void
) => {
  return useMutation({
    mutationFn: (data: { date: string; gameId: string }) => fetchBooking(data),
    onSuccess,
    onError,
  });
};

const createBooking = async (data: { date: string; gameId: string }) => {
  try {
    const response = await api("/api/booking/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
      body: JSON.stringify(data),
    });
    const resp = await response;

    return resp;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Data Not Found");
  }
};

export const useCreateBooking = (
  onSuccess?: () => void,
  onError?: () => void
) => {
  return useMutation({
    mutationFn: (data: any) => createBooking(data),
    onSuccess: () => {
      toast.success("Booking Done!");
      onSuccess?.();
    },
    onError: (err: any) => {
      toast.error(err.message);
      onError?.();
    },
  });
};

const cancelBooking = async (id: string) => {
  try {
    const response = await api(`/api/booking/cancel/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });
    const resp = await response;
    return resp;
  } catch (error) {
    console.log("Bokking Response", error);
    throw new Error(error instanceof Error ? error.message : "Data Not Found");
  }
};

export const useCancelBooking = (
  onSuccess?: () => void,
  onError?: () => void
) => {
  return useMutation({
    mutationFn: (id: string) => cancelBooking(id),
    onSuccess: () => {
      toast.success("Cancel Booking!");
      onSuccess?.();
    },
    onError: (err: any) => {
      toast.error(err.message);
      onError?.();
    },
  });
};

const updateBooking = async (
  id: string,
  data: { date: string; startTime: string; endTime: string }
) => {
  try {
    const response = await api(`/api/booking/update/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      cache: "no-store",
    });

    return response;
  } catch (error) {
    console.log("Booking Response", error);
    throw new Error(error instanceof Error ? error.message : "Data Not Found");
  }
};

export const useUpdateBooking = (
  onSuccess?: () => void,
  onError?: () => void
) => {
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: { date: string; startTime: string; endTime: string };
    }) => updateBooking(id, data),

    onSuccess: () => {
      toast.success("Booking Updated!");
      onSuccess?.();
    },
    onError: (err: any) => {
      toast.error(err.message);
      onError?.();
    },
  });
};

export const updateBookingStatus = async (id: string, status: string) => {
  try {
    const response = await api(`/api/booking/status/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
      cache: "no-store",
    });
    const resp = await response;
    return resp;
  } catch (error) {
    console.log("Booking response", error);
    throw new Error(error instanceof Error ? error.message : "Data Not Found");
  }
};

export const useUpdateBokkingStatus = (
  onSuccess?: () => void,
  onError?: () => void
) => {
  const queryClient = new QueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      updateBookingStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["booking"] });
      onSuccess?.();
    },
    onError,
  });
};

const bookingById = async (id: string) => {
  try {
    const response = await api(`/api/one-booking/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });
    const resp = await response;
    return resp;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Data Not Found");
  }
};

export const useBookingById = (id: string) => {
  return useQuery({
    queryKey: ["booking", id],
    queryFn: () => bookingById(id),
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    retry: 0,
    enabled: !!id,
  });
};

// const bookingByRange = async (
//   gameId: string,
//   range: { start: string; end: string }
// ) => {
//   try {
//     const response = await api(
//       `/api/booking/week/${gameId}/${range.start}/${range.end}`,
//       {
//         method: "GET",
//         headers: { "Content-Type": "application/json" },
//         cache: "no-store",
//       }
//     );
//     const resp = await response;
//     return resp;
//   } catch (error) {
//     throw new Error(error instanceof Error ? error.message : "Data Not Found");
//   }
// };

const bookingByRange = async (
  gameId: string,
  range: { start: string; end: string }
) => {
  if (!range.start || !range.end) {
    throw new Error("Invalid range");
  }

  try {
    const response = await api(
      `/api/booking/week/${gameId}/${range.start}/${range.end}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      }
    );
    const resp = await response;
    return resp;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Data Not Found");
  }
};

// export const useBookingByRange = (
//   gameId: string,
//   range: { start: string; end: string }
// ) => {
//   return useQuery({
//     queryKey: ["booking", gameId, range],
//     queryFn: () => bookingByRange(gameId, range),
//     staleTime: 0,
//     refetchOnMount: true,
//     refetchOnWindowFocus: true,
//     retry: 0,
//     enabled: !!gameId && !!range,
//   });
// };

export const useBookingByRange = (
  gameId: string,
  range: { start: string; end: string }
) => {
  const isValid = !!gameId && !!range.start && !!range.end;

  return useQuery({
    queryKey: ["booking", gameId, range],
    queryFn: () => bookingByRange(gameId, range),
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    retry: 0,
    enabled: isValid,
  });
};

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

export const useGames = () => {
  return useQuery<{ games: Game[] }, Error>({
    queryKey: ["games"],
    queryFn: () => getAllGames(),
    enabled: !!token,
  });
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

    return data;
  } catch (error) {
    console.error("Failed to fetch game by ID", error);
    throw error;
  }
};

// export const createBooking = async (data: BookingRequest) => {
//   if (!token) throw new Error("No auth token found");

//   try {
//     const response = await fetch(
//       `${process.env.NEXT_PUBLIC_BASE_URL}/api/booking/create`,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(data),
//       }
//     );

//     if (!response.ok) {
//       const error = await response.json();
//       throw new Error(error.message || `Request failed: ${response.status}`);
//     }

//     const res = await response.json();
//     console.log("Booking created:", res);
//     return res;
//   } catch (error: any) {
//     console.error("Error creating booking:", error);
//     throw new Error(
//       error.message || "Unknown error occurred while creating booking"
//     );
//   }
// };
