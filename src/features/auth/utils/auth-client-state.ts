import { useAuthStore } from "@/features/auth/store/auth.store";
import { clearClientSession } from "@/features/auth/utils/auth-storage";

type ClearAuthClientStateInput = {
  reason: string;
};

const REFRESH_LOCK_KEY = "snaphanoi.admin.auth-refresh-lock";
const REFRESH_EVENT_KEY = "snaphanoi.admin.auth-refresh-event";
const TAB_ID_STORAGE_KEY = "snaphanoi.admin.tab-id";

export function clearAuthClientState(input: ClearAuthClientStateInput) {
  clearClientSession();

  if (typeof window !== "undefined") {
    window.localStorage.removeItem(REFRESH_LOCK_KEY);
    window.localStorage.removeItem(REFRESH_EVENT_KEY);
    window.sessionStorage.removeItem(TAB_ID_STORAGE_KEY);
  }

  useAuthStore.getState().clear(input.reason);
}
