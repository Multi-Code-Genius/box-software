import { create } from "zustand";

type User = {
  zip_code: string;
  state: string;
  city: string;
  address: string;
  phone: string;
  email: string;
  name: string;
  // mobileNumber: string;
  profile: string;
  id: string;
  role: string;
};

type UserStore = {
  user: User | null;
  image: string;
  setUser: (user: User) => void;
  setUserImage: (image: string) => void;
};

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  image: "/images/profile.jpg",
  setUser: (user) => set({ user }),
  setUserImage: (image) => set({ image }),
}));
