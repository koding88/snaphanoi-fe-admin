import { create } from "zustand";

import type { AuthenticatedUser, AuthStatus } from "@/features/auth/types/auth.types";

type AuthSession = {
  accessToken: string | null;
  refreshToken: string | null;
};

type AuthStore = {
  session: AuthSession;
  user: AuthenticatedUser | null;
  status: AuthStatus;
  hasBootstrapped: boolean;
  setSession: (session: Partial<AuthSession>) => void;
  setUser: (user: AuthenticatedUser | null) => void;
  markBootstrapped: () => void;
  setStatus: (status: AuthStatus) => void;
  clear: () => void;
};

const INITIAL_SESSION: AuthSession = {
  accessToken: null,
  refreshToken: null,
};

export const useAuthStore = create<AuthStore>((set) => ({
  session: INITIAL_SESSION,
  user: null,
  status: "idle",
  hasBootstrapped: false,
  setSession: (session) =>
    set((state) => ({
      session: { ...state.session, ...session },
    })),
  setUser: (user) => set({ user }),
  markBootstrapped: () => set({ hasBootstrapped: true }),
  setStatus: (status) => set({ status }),
  clear: () =>
    set({
      session: INITIAL_SESSION,
      user: null,
      status: "guest",
      hasBootstrapped: true,
    }),
}));
