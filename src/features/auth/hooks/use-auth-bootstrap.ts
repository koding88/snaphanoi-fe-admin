"use client";

import { useEffect } from "react";

import { useAuthStore } from "@/features/auth/store/auth.store";
import {
  clearClientSession,
  readAuthHintCookie,
  readStoredAccessToken,
  readStoredAuthSnapshot,
} from "@/features/auth/utils/auth-storage";
import { clearAuthClientState } from "@/features/auth/utils/auth-client-state";
import { refreshAuthSession } from "@/lib/api/auth-session";

let bootstrapPromise: Promise<void> | null = null;

async function runBootstrapFlow() {
  const authStore = useAuthStore.getState();

  if (authStore.hasBootstrapped) {
    return;
  }

  authStore.beginBootstrap();

  const snapshot = readStoredAuthSnapshot();
  const accessToken = snapshot?.accessToken ?? readStoredAccessToken();
  const hasSessionHint = readAuthHintCookie();

  if (snapshot?.accessToken && snapshot.user) {
    authStore.setAuthenticated(snapshot);
    return;
  }

  if (!accessToken && !hasSessionHint) {
    clearClientSession();
    authStore.setGuest();
    return;
  }

  try {
    const refreshed = await refreshAuthSession();

    if (!refreshed?.accessToken) {
      throw new Error("SESSION_REFRESH_FAILED");
    }
  } catch {
    clearAuthClientState({
      reason: "bootstrap_failed",
    });
  }
}

function bootstrapAuthSessionOnce() {
  if (useAuthStore.getState().hasBootstrapped) {
    return Promise.resolve();
  }

  if (!bootstrapPromise) {
    bootstrapPromise = runBootstrapFlow().finally(() => {
      bootstrapPromise = null;
    });
  }

  return bootstrapPromise;
}

export function useAuthBootstrap() {
  useEffect(() => {
    void bootstrapAuthSessionOnce();
  }, []);
}
