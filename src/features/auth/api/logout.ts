import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { useAuthStore } from "@/features/auth/store/auth.store";

export function logout() {
  const accessToken = useAuthStore.getState().session.accessToken;

  return apiClient.postEnvelope<{ loggedOut: true }>(API_ENDPOINTS.auth.logout, undefined, {
    accessToken,
    enableAuthRefresh: false,
  });
}
