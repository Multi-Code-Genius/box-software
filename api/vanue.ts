import { api } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

const registerNewGame = async (data: unknown) => {
  try {
    const response = await api("/api/game/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: data,
    });

    const resp = await response;
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
      toast.error("Something Went Wrong");
    },
  });
};
