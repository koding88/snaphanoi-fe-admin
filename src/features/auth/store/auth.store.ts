import { create } from "zustand";

import type { AuthSuccessPayload } from "@/features/auth/types/auth-api.types";
import type { AuthenticatedUser, AuthStatus } from "@/features/auth/types/auth.types";

type AuthSession = {
  accessToken: string | null;
};

type AuthStore = {
  session: AuthSession;
  user: AuthenticatedUser | null;
  status: AuthStatus;
  hasBootstrapped: boolean;
  beginBootstrap: () => void;
  setAuthenticated: (payload: AuthSuccessPayload) => void;
  setUser: (user: AuthenticatedUser | null) => void;
  setGuest: () => void;
  clear: () => void;
};

const INITIAL_SESSION: AuthSession = {
  accessToken: null,
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
      },
      user: payload.user,
      status: "authenticated",
      hasBootstrapped: true,
    }),
  setUser: (user) => set({ user }),
  setGuest: () =>
    set({
      session: INITIAL_SESSION,
      user: null,
      status: "guest",
      hasBootstrapped: true,
    }),
  clear: () =>
    set({
      session: INITIAL_SESSION,
      user: null,
      status: "guest",
      hasBootstrapped: true,
    }),
}));
