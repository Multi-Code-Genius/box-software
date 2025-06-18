import { api } from "@/lib/api";
import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { UpdateBooking } from "@/types/vanue";

const token = Cookies.get("accessToken");

const fetchBooking = async (data: { date: string; venueId: string }) => {
  try {
    const response = await api(
      `/api/booking/game/${data.venueId}/${data.date}`,
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

export const useBookingInfo = (data: { date: string; venueId: string }) => {
  return useQuery({
    queryKey: ["booking", data.date, data.venueId],
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
    mutationFn: (data: { date: string; venueId: string }) => fetchBooking(data),
    onSuccess,
    onError,
  });
};

interface BookingPayload {
  name: string;
  phone: string;
  startTime: string;
  endTime: string;
  date: string;
  totalAmount: number;
  venueId: number;
  bookedGrounds: number;
}

export const createBooking = async (data: BookingPayload) => {
  try {
    const response = await api("/api/v2/booking/create-booking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response;
      throw new Error(errorData.message || "Booking failed");
    }

    const res = await response;
    return res;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Booking failed");
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
    const response = await api(`/api/v2/booking/cancel/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });
    const resp = await response;
    return resp;
  } catch (error) {
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

const updateBooking = async (id: string, data: UpdateBooking) => {
  try {
    const response = await api(`/api/v2/booking/update-booking/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      cache: "no-store",
    });

    const res = response;
    return res;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Data Not Found");
  }
};

export const useUpdateBooking = (
  onSuccess?: () => void,
  onError?: () => void
) => {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBooking }) =>
      updateBooking(id, data),

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
    const response = await api(`/api/v2/booking/booking-id/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });
    const resp = await response.json();
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
  venueId: string,
  ground: string,
  range: { start: string; end: string }
) => {
  if (!range.start || !range.end) {
    throw new Error("Invalid range");
  }

  try {
    const response = await api(
      `/api/v2/booking/booking-week/${venueId}/${ground}?startDate=${range.start}&endDate=${range.end}`,
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
  venueId: string,
  ground: string,
  range: { start: string; end: string }
) => {
  const isValid = !!venueId && !!range.start && !!range.end;

  return useQuery({
    queryKey: ["booking", venueId, ground, range],
    queryFn: () => bookingByRange(venueId, ground, range),
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    retry: 0,
    enabled: isValid,
  });
};
