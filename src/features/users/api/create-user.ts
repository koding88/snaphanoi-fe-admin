import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { useAuthStore } from "@/features/auth/store/auth.store";
import type { CreateUserPayload, UserMutationResult } from "@/features/users/types/users-api.types";

export async function createUser(payload: CreateUserPayload) {
  const accessToken = useAuthStore.getState().session.accessToken;

  return apiClient.postEnvelope<UserMutationResult>(API_ENDPOINTS.users.list, payload, {
    accessToken,
  });
}
