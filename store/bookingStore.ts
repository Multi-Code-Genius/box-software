// stores/useGameStore.ts
import { Game } from "@/types/auth";
import { create } from "zustand";

interface GameStore {
  games: Game[];
  setGames: (games: Game[]) => void;
  addGame: (game: Game) => void;
  clearGames: () => void;
}

export const useBookingStore = create<GameStore>((set) => ({
  games: [],
  setGames: (games) => set({ games }),
  addGame: (game) => set((state) => ({ games: [...state.games, game] })),
  clearGames: () => set({ games: [] }),
}));
