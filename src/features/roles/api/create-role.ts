import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { useAuthStore } from "@/features/auth/store/auth.store";
import type { RolePayload, RoleMutationResult } from "@/features/roles/types/roles-api.types";

export async function createRole(payload: RolePayload) {
  const accessToken = useAuthStore.getState().session.accessToken;

  return apiClient.postEnvelope<RoleMutationResult>(API_ENDPOINTS.roles.list, payload, {
    accessToken,
  });
}
