import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { useAuthStore } from "@/features/auth/store/auth.store";
import type { RolesListResult } from "@/features/users/types/users.types";

export async function listRoleOptions() {
  const accessToken = useAuthStore.getState().session.accessToken;
  const searchParams = new URLSearchParams({
    page: "1",
    limit: "100",
    keyword: "",
  });

  return apiClient.get<RolesListResult>(`${API_ENDPOINTS.roles.list}?${searchParams.toString()}`, {
    accessToken,
  });
}
