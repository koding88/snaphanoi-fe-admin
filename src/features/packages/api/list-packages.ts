import { useAuthStore } from "@/features/auth/store/auth.store";
import type {
  PackageListQuery,
  PackagesListResult,
} from "@/features/packages/types/packages.types";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

function toSearchParams(query: PackageListQuery) {
  const searchParams = new URLSearchParams();

  searchParams.set("page", String(query.page));
  searchParams.set("limit", String(query.limit));
  searchParams.set("keyword", query.keyword ?? "");

  if (query.isActive !== undefined && query.isActive !== "all") {
    searchParams.set("isActive", String(query.isActive));
  }

  return searchParams.toString();
}

export async function listPackages(query: PackageListQuery) {
  const accessToken = useAuthStore.getState().session.accessToken;

  return apiClient.get<PackagesListResult>(
    `${API_ENDPOINTS.packages.list}?${toSearchParams(query)}`,
    { accessToken },
  );
}
