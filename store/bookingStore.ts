import { Game } from "@/types/auth";
import { create } from "zustand";

interface GameStore {
  games: Game[];
  submittedVenue: Game | null;
  setGames: (games: Game[]) => void;
  addGame: (game: Game) => void;
  clearGames: () => void;
  setSubmittedVenue: (game: Game) => void;
}

export const useBookingStore = create<GameStore>((set) => ({
  games: [],
  submittedVenue: null,
  setGames: (games) => set({ games }),
  addGame: (game) => set((state) => ({ games: [...state.games, game] })),
  clearGames: () => set({ games: [] }),
  setSubmittedVenue: (game) => set({ submittedVenue: game }),
}));
