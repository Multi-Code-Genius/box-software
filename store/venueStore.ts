import { create } from "zustand";
import { Venues } from "@/types/vanue";

interface VenueStore {
  venues: Venues[];
  setVenues: (venues: Venues[]) => void;
  submittedVenue: Venues | null;
  addVenue: (venues: Venues) => void;
  clearVenue: () => void;
  setSubmittedVenue: (Venues: Venues) => void;
}

export const useVenueStore = create<VenueStore>((set) => ({
  venues: [],
  submittedVenue: null,
  setVenues: (venues) => set({ venues }),
  addVenue: (Venue) => set((state) => ({ venues: [...state.venues, Venue] })),
  clearVenue: () => set({ venues: [] }),
  setSubmittedVenue: (venue) => set({ submittedVenue: venue }),
}));
