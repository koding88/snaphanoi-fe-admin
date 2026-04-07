"use client";

import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { useAuthStore } from "@/features/auth/store/auth.store";
import type { AuthSuccessPayload } from "@/features/auth/types/auth-api.types";
import {
  clearClientSession,
  persistClientSession,
} from "@/features/auth/utils/auth-storage";
import { apiRequestEnvelope } from "@/lib/api/request";

let refreshPromise: Promise<AuthSuccessPayload | null> | null = null;

function clearLocalAuthState() {
  clearClientSession();
  useAuthStore.getState().clear();
}

async function requestRefresh() {
  const payload = await apiRequestEnvelope<AuthSuccessPayload>(API_ENDPOINTS.auth.refresh, {
    method: "POST",
    credentials: "include",
    cache: "no-store",
  });

  return payload.data;
}

export async function refreshAuthSession() {
  if (typeof window === "undefined") {
    return null;
  }

  if (!refreshPromise) {
    refreshPromise = requestRefresh()
      .then((payload) => {
        persistClientSession(payload.accessToken);
        useAuthStore.getState().setAuthenticated(payload);
        return payload;
      })
      .catch((error) => {
        clearLocalAuthState();
        throw error;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

export function clearAuthSession() {
  clearLocalAuthState();
}
