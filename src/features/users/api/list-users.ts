import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { useAuthStore } from "@/features/auth/store/auth.store";
import type { UserListQuery, UsersListResult } from "@/features/users/types/users.types";

function toSearchParams(query: UserListQuery) {
  const searchParams = new URLSearchParams();

  searchParams.set("page", String(query.page));
  searchParams.set("limit", String(query.limit));
  searchParams.set("keyword", query.keyword ?? "");
  searchParams.set("roleId", query.roleId ?? "");
  searchParams.set("includeDeleted", String(Boolean(query.includeDeleted)));

  if (query.isActive !== undefined && query.isActive !== "all") {
    searchParams.set("isActive", String(query.isActive));
  }

  return searchParams.toString();
}

export async function listUsers(query: UserListQuery) {
  const accessToken = useAuthStore.getState().session.accessToken;

  return apiClient.get<UsersListResult>(
    `${API_ENDPOINTS.users.list}?${toSearchParams(query)}`,
    {
      accessToken,
    },
  );
}
