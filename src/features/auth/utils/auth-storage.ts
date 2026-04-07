const ACCESS_TOKEN_STORAGE_KEY = "snaphanoi.admin.access-token";
const AUTH_HINT_COOKIE_NAME = "snaphanoi_admin_session";

function isBrowser() {
  return typeof window !== "undefined";
}

export function readStoredAccessToken() {
  if (!isBrowser()) {
    return null;
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

export function persistClientSession(accessToken: string) {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, accessToken);
  document.cookie = `${AUTH_HINT_COOKIE_NAME}=1; Path=/; Max-Age=2592000; SameSite=Lax`;
}

export function clearClientSession() {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
  document.cookie = `${AUTH_HINT_COOKIE_NAME}=; Path=/; Max-Age=0; SameSite=Lax`;
}
