import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { useAuthStore } from "@/features/auth/store/auth.store";
import type { UserMutationResult } from "@/features/users/types/users-api.types";

export async function restoreUser(id: string) {
  const accessToken = useAuthStore.getState().session.accessToken;

  return apiClient.patch<UserMutationResult>(API_ENDPOINTS.users.restore(id), undefined, {
    accessToken,
  });
}
