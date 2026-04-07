import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { useAuthStore } from "@/features/auth/store/auth.store";
import type { UpdateUserPayload, UserMutationResult } from "@/features/users/types/users-api.types";

export async function updateUser(id: string, payload: UpdateUserPayload) {
  const accessToken = useAuthStore.getState().session.accessToken;

  return apiClient.patch<UserMutationResult>(API_ENDPOINTS.users.byId(id), payload, {
    accessToken,
  });
}
