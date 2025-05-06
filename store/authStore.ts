import { create } from "zustand";
import Cookies from "js-cookie";
import { AuthState } from "../types/auth";

export const useAuthStore = create<AuthState>((set) => ({
  token: Cookies.get("accessToken") || null,

  saveToken: async (token: string) => {
    Cookies.set("accessToken", token, { expires: 7 });
    set({ token });
  },

  logout: async () => {
    Cookies.remove("accessToken");
    set({ token: null });
  },
}));
