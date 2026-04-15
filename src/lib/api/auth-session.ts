"use client";

import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { isApiError } from "@/lib/api/errors";
import { useAuthStore } from "@/features/auth/store/auth.store";
import type { AuthSuccessPayload } from "@/features/auth/types/auth-api.types";
import { clearAuthClientState } from "@/features/auth/utils/auth-client-state";
import { persistClientSession } from "@/features/auth/utils/auth-storage";
import { apiRequestEnvelope } from "@/lib/api/request";

let refreshPromise: Promise<AuthSuccessPayload | null> | null = null;
const TERMINAL_REFRESH_ERROR_CODES = new Set([
  "REFRESH_TOKEN_NOT_FOUND",
  "REFRESH_TOKEN_REVOKED",
  "INVALID_REFRESH_TOKEN",
  "UNAUTHORIZED",
]);

function clearLocalAuthState(reason: string) {
  refreshPromise = null;
  clearAuthClientState({ reason });
}

function isTerminalRefreshFailure(error: unknown) {
  if (!isApiError(error)) {
    return false;
  }

  if (error.statusCode === 401 || error.statusCode === 403) {
    return true;
  }

  if (!error.code) {
    return false;
  }

  return TERMINAL_REFRESH_ERROR_CODES.has(error.code);
}

async function requestRefresh() {
  const payload = await apiRequestEnvelope<AuthSuccessPayload>(
    API_ENDPOINTS.auth.refresh,
    {
      method: "POST",
      enableAuthRefresh: false,
    },
  );

  return payload.data;
}

export async function refreshAuthSession() {
  if (typeof window === "undefined") {
    return null;
  }

  if (!refreshPromise) {
    refreshPromise = requestRefresh()
      .then((payload) => {
        persistClientSession(payload);
        useAuthStore.getState().setAuthenticated(payload);
        return payload;
      })
      .catch((error) => {
        if (isTerminalRefreshFailure(error)) {
          clearLocalAuthState("refresh_failed");
        }

        throw error;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

export function clearAuthSession() {
  clearLocalAuthState("manual_clear");
}
