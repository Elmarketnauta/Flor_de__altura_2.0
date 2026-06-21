import { create } from "zustand";
import { MMKVStorage } from "react-native-mmkv";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  email: string;
  fullName?: string;
  phone?: string;
  country: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;

  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

const storage = new MMKVStorage();

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoading: false,

      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      setLoading: (isLoading) => set({ isLoading }),

      logout: () =>
        set({
          user: null,
          token: null,
          isLoading: false,
        }),
    }),
    {
      name: "fa-auth",
      storage: MMKVStorage,
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }),
    }
  )
);
