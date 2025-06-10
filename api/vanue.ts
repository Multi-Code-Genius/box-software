import { api } from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { Venues } from "@/types/vanue";

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

const token = Cookies.get("accessToken");

const registerNewGame = async (data: unknown) => {
  try {
    const response = await api("/api/v2/venue/create-venue", {
      method: "POST",
      body: data,
    });

    const resp = await response;
    return resp;
  } catch (error) {
    console.error("Error registering game:", error);
  }
};

export const useAddVenue = () => {
  return useMutation({
    mutationFn: (data: unknown) => registerNewGame(data),
    onSuccess: (data) => {
      toast.success("Venue created successfully!");
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });
};

export const getVenues = async (): Promise<{ venues: Venues[] }> => {
  try {
    const response = await api(`/api/v2/venue/my-venues`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response;
    return { venues: data.venues };
  } catch (error) {
    console.error("Failed to fetch venues", error);
    throw error;
  }
};

export const useVenues = () => {
  return useQuery<{ venues: Venues[] }, Error>({
    queryKey: ["venues"],
    queryFn: () => getVenues(),
    enabled: !!token,
  });
};

export const editVenueDetails = async (
  data: Partial<VenueFormDetails>,
  venueId: any
) => {
  try {
    const response = await api(`/api/v2/venue/update/${venueId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
      body: JSON.stringify(data),
    });

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
      venueId,
    }: {
      data: Partial<VenueFormDetails>;
      venueId: string;
    }) => editVenueDetails(data, venueId),

    onSuccess: (data: any) => {
      toast.success(data?.message || "Venue updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["venues"] });
    },

    onError: (error: any) => {
      toast.error(error?.message || "Failed to update venue.");
    },
  });
};
const deleteVenue = async (venueId: string) => {
  try {
    const response = await api(`/api/v2/venue/delete/${venueId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

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
      queryClient.invalidateQueries({ queryKey: ["venues"] });
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
