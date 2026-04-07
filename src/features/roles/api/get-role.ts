import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { useAuthStore } from "@/features/auth/store/auth.store";
import type { RoleRecord } from "@/features/roles/types/roles.types";

export async function getRole(id: string) {
  const accessToken = useAuthStore.getState().session.accessToken;

  return apiClient.get<RoleRecord>(API_ENDPOINTS.roles.byId(id), {
    accessToken,
  });
}
