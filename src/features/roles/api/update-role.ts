import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { useAuthStore } from "@/features/auth/store/auth.store";
import type { RolePayload, RoleMutationResult } from "@/features/roles/types/roles-api.types";

export async function updateRole(id: string, payload: RolePayload) {
  const accessToken = useAuthStore.getState().session.accessToken;

  return apiClient.patch<RoleMutationResult>(API_ENDPOINTS.roles.byId(id), payload, {
    accessToken,
  });
}
