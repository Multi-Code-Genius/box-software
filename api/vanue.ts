import { api } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";

const registerNewGame = async (data: unknown) => {
  try {
    const response = await api("/api/game/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const resp = await response;
    return resp;
  } catch (error: { message: string }) {
    console.log("Game Error", error?.message);
  }
};

export const useAddGame = (
  onSuccess?: (data: unknown) => void,
  onError?: (error: unknown) => void
) => {
  return useMutation({
    mutationFn: (data: unknown) => registerNewGame(data),
    onSuccess,
    onError,
  });
};
