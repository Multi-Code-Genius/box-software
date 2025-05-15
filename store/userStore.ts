import { create } from "zustand";

type User = {
  email: string;
  name: string;
  mobileNumber: string;
  profile_pic: string;
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
