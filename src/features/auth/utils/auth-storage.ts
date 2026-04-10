import type { AuthSuccessPayload } from "@/features/auth/types/auth-api.types";

const ACCESS_TOKEN_STORAGE_KEY = "snaphanoi.admin.access-token";
const AUTH_SNAPSHOT_STORAGE_KEY = "snaphanoi.admin.auth-snapshot";
const AUTH_HINT_COOKIE_NAME = "snaphanoi_admin_session";

function isBrowser() {
  return typeof window !== "undefined";
}

function parseStoredSnapshot(raw: string | null): AuthSuccessPayload | null {
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as AuthSuccessPayload;
    if (!parsed?.accessToken || !parsed?.user) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export function readStoredAuthSnapshot() {
  if (!isBrowser()) {
    return null;
  }

  return parseStoredSnapshot(window.localStorage.getItem(AUTH_SNAPSHOT_STORAGE_KEY));
}

export function readStoredAccessToken() {
  if (!isBrowser()) {
    return null;
  }

  const snapshot = readStoredAuthSnapshot();
  if (snapshot?.accessToken) {
    return snapshot.accessToken;
  }

  return window.localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
}

export function readAuthHintCookie() {
  if (!isBrowser()) {
    return false;
  }

  return document.cookie
    .split("; ")
    .some((entry) => entry.startsWith(`${AUTH_HINT_COOKIE_NAME}=`));
}

export function persistClientSession(payload: AuthSuccessPayload) {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, payload.accessToken);
  window.localStorage.setItem(AUTH_SNAPSHOT_STORAGE_KEY, JSON.stringify(payload));
  document.cookie = `${AUTH_HINT_COOKIE_NAME}=1; Path=/; Max-Age=2592000; SameSite=Lax`;
}

export function clearClientSession() {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
  window.localStorage.removeItem(AUTH_SNAPSHOT_STORAGE_KEY);
  document.cookie = `${AUTH_HINT_COOKIE_NAME}=; Path=/; Max-Age=0; SameSite=Lax`;
}
