import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { useAuthStore } from "@/features/auth/store/auth.store";
import type { UserRecord } from "@/features/users/types/users.types";

export async function getUser(id: string) {
  const accessToken = useAuthStore.getState().session.accessToken;

  return apiClient.get<UserRecord>(API_ENDPOINTS.users.byId(id), {
    accessToken,
  });
}
