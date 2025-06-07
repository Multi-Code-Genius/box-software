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
  dashboardData: DashboardData | null;
  setDashboardData: (dashboardData: DashboardData | null) => void;
  // selectedvenueId: string | undefined;
  // setSelectedvenueId: (id: string | undefined) => void;
};

export const useDashboardStore = create<DashboardStore>((set) => ({
  dashboardData: null,
  setDashboardData: (dashboardData) => set({ dashboardData }),
  // selectedvenueId: undefined,
  // setSelectedvenueId: (id) => set({ selectedvenueId: id }),
}));
