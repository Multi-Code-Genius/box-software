import { api } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface GameInfo {
  surface: string;
  indoor: string;
  outdoor: string;
  roof: string;
}
interface VenueFormDetails {
  name: string;
  description: string;
  address: string;
  location: Location;
  capacity: string;
  category: string;
  hourlyPrice: string;
  net: string;
  turfType: string;
  gameInfo: GameInfo;
  images: string[];
}
const registerNewGame = async (data: unknown) => {
  try {
    const response = await api("/api/game/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: data,
    });

    const resp = await response;
    console.log(resp);
    return resp;
  } catch (error: unknown) {
    if (error && typeof error === "object" && "message" in error) {
      console.log("Game Error", (error as { message: string }).message);
    } else {
      console.log("Game Error", error);
    }
  }
};

export const useAddGame = () => {
  return useMutation({
    mutationFn: (data: unknown) => registerNewGame(data),
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });
};

export const editVenueDetails = async (
  data: Partial<VenueFormDetails>,
  gameId: any
) => {
  try {
    const response = await api(`/api/game/update-venue/${gameId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
      body: JSON.stringify(data),
    });

    console.log("response", response);

    return response;
  } catch (error) {
    console.error("message Error:", error);
    throw new Error(error instanceof Error ? error.message : "message failed");
  }
};

export const useEditVenue = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      data,
      gameId,
    }: {
      data: Partial<VenueFormDetails>;
      gameId: string;
    }) => editVenueDetails(data, gameId),

    onSuccess: (data: any) => {
      toast.success(data?.message || "Venue updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["games"] });
    },

    onError: (error: any) => {
      toast.error(error?.message || "Failed to update venue.");
    },
  });
};
const deleteVenue = async (venueId: string) => {
  try {
    const response = await api(`/api/game/delete-venue/${venueId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    console.log(response);
    return response;
  } catch (error: any) {
    const errorMessage = error?.message || "Failed to delete venue";
    throw new Error(errorMessage);
  }
};

export const useDeleteVenue = () => {
  const queryClient = useQueryClient();

  const {
    mutate: deleteVenueMutation,
    error,
    isSuccess,
  } = useMutation({
    mutationFn: (id: string) => deleteVenue(id),
    onSuccess: (data) => {
      toast.success("Venue deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["games"] });
    },
    onError: (error) => {
      toast.error("Failed to delete venue");
      console.error(error);
    },
  });

  return {
    deleteVenueMutation,
    error,
    isSuccess,
  };
};
