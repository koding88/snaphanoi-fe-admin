import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { useAuthStore } from "@/features/auth/store/auth.store";
import type { RoleListQuery, RolesListResult } from "@/features/roles/types/roles.types";

function toSearchParams(query: RoleListQuery) {
  const searchParams = new URLSearchParams();

  searchParams.set("page", String(query.page));
  searchParams.set("limit", String(query.limit));
  searchParams.set("keyword", query.keyword ?? "");

  if (query.isSystem !== undefined && query.isSystem !== "all") {
    searchParams.set("isSystem", String(query.isSystem));
  }

  return searchParams.toString();
}

export async function listRoles(query: RoleListQuery) {
  const accessToken = useAuthStore.getState().session.accessToken;

  return apiClient.get<RolesListResult>(`${API_ENDPOINTS.roles.list}?${toSearchParams(query)}`, {
    accessToken,
  });
}
