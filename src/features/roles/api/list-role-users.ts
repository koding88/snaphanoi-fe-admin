import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { useAuthStore } from "@/features/auth/store/auth.store";
import type { RoleUsersQuery, RoleUsersResult } from "@/features/roles/types/roles.types";

function toSearchParams(query: RoleUsersQuery) {
  const searchParams = new URLSearchParams();
  searchParams.set("status", query.status);
  searchParams.set("page", String(query.page));
  searchParams.set("limit", String(query.limit));
  return searchParams.toString();
}

export async function listRoleUsers(roleId: string, query: RoleUsersQuery) {
  const accessToken = useAuthStore.getState().session.accessToken;

  return apiClient.get<RoleUsersResult>(
    `${API_ENDPOINTS.roles.users(roleId)}?${toSearchParams(query)}`,
    {
      accessToken,
    },
  );
}
