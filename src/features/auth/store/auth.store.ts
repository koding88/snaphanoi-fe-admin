import { create } from "zustand";

import type { AuthSuccessPayload } from "@/features/auth/types/auth-api.types";
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
  beginBootstrap: () => void;
  setAuthenticated: (payload: AuthSuccessPayload) => void;
  setSession: (session: Partial<AuthSession>) => void;
  setUser: (user: AuthenticatedUser | null) => void;
  markBootstrapped: () => void;
  setGuest: () => void;
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
  beginBootstrap: () => set({ status: "loading" }),
  setAuthenticated: (payload) =>
    set({
      session: {
        accessToken: payload.accessToken,
        refreshToken: null,
      },
      user: payload.user,
      status: "authenticated",
      hasBootstrapped: true,
    }),
  setSession: (session) =>
    set((state) => ({
      session: { ...state.session, ...session },
    })),
  setUser: (user) => set({ user }),
  markBootstrapped: () => set({ hasBootstrapped: true }),
  setGuest: () =>
    set({
      session: INITIAL_SESSION,
      user: null,
      status: "guest",
      hasBootstrapped: true,
    }),
  setStatus: (status) => set({ status }),
  clear: () =>
    set({
      session: INITIAL_SESSION,
      user: null,
      status: "guest",
      hasBootstrapped: true,
    }),
}));
