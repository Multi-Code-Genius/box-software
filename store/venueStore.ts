import { create } from "zustand";
import { Venues } from "@/types/vanue";

interface VenueStore {
  venues: Venues[];
  venue: Venues | null;
  selectedvenueId: string | null;
  setSelectedvenueId: (id: string | null) => void;
  setVenues: (venues: Venues[]) => void;
  submittedVenue: Venues | null;
  addVenue: (venues: Venues) => void;
  clearVenue: () => void;
  setSubmittedVenue: (Venues: Venues) => void;

  setVenue: (venue: Venues | null) => void;
}

export const useVenueStore = create<VenueStore>((set) => ({
  venues: [],
  venue: null,
  submittedVenue: null,
  setVenues: (venues) => set({ venues }),
  addVenue: (Venue) => set((state) => ({ venues: [...state.venues, Venue] })),
  clearVenue: () => set({ venues: [] }),
  setSubmittedVenue: (venue) => set({ submittedVenue: venue }),
  setVenue: (venue) => set({ venue }),
  selectedvenueId: null,
  setSelectedvenueId: (id) => set({ selectedvenueId: id }),
}));
