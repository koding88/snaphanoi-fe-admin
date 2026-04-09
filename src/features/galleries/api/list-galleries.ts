import { useAuthStore } from "@/features/auth/store/auth.store";
import type { GalleriesListResult, GalleryListQuery } from "@/features/galleries/types/galleries.types";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

function toSearchParams(query: GalleryListQuery) {
  const searchParams = new URLSearchParams();

  searchParams.set("page", String(query.page));
  searchParams.set("limit", String(query.limit));
  searchParams.set("keyword", query.keyword ?? "");

  if (query.isActive !== undefined && query.isActive !== "all") {
    searchParams.set("isActive", String(query.isActive));
  }

  return searchParams.toString();
}

export async function listGalleries(query: GalleryListQuery) {
  const accessToken = useAuthStore.getState().session.accessToken;

  return apiClient.get<GalleriesListResult>(
    `${API_ENDPOINTS.galleries.list}?${toSearchParams(query)}`,
    { accessToken },
  );
}
