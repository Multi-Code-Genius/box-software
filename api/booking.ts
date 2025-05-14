import { api } from "@/lib/api";
import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

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
  data: { date: string; gameId: string }
) => {
  console.log("id, data", id, data);

  try {
    const response = await api(`/api/booking/update/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      cache: "no-store",
    });
    const resp = await response;
    return resp;
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
      data: { date: string; gameId: string };
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

const bookingByRange = async (
  gameId: string,
  range: { start: string; end: string }
) => {
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

export const useBookingByRange = (
  gameId: string,
  range: { start: string; end: string }
) => {
  return useQuery({
    queryKey: ["booking", gameId, range],
    queryFn: () => bookingByRange(gameId, range),
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    retry: 0,
    enabled: !!gameId && !!range,
  });
};
