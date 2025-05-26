import { DashboardData } from "@/types/auth";
import { create } from "zustand";

type StatusCounts = {
  PENDING: number;
  CONFIRMED: number;
  CANCELLED: number;
  COMPLETED: number;
};

type WeeklyBookings = {
  [key: string]: number;
};

type DashboardStore = {
  data: DashboardData | null;
  setDashboardData: (data: DashboardData | null) => void;
  selectedGameId: string | undefined;
  setSelectedGameId: (id: string | undefined) => void;
};

export const useDashboardStore = create<DashboardStore>((set) => ({
  data: null,
  setDashboardData: (data) => set({ data }),
  selectedGameId: undefined,
  setSelectedGameId: (id) => set({ selectedGameId: id }),
}));
