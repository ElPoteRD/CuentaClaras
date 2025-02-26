import { IUserProfile } from "@/entities/auth";
import { create } from "zustand";

interface IUserData {
  data: IUserProfile | null;
  login: (newUser: IUserProfile) => void;
  logout: () => void;
}

const useStore = create<IUserData>()((set) => ({
  data: null,
  login: (newData: IUserProfile) => set({ data: newData }),
  logout: () => set({ data: null }),
}));

export default useStore;
