import { useAuthStore } from "@/features/auth/store/auth.store";
import type { BlogListQuery, BlogsListResult } from "@/features/blogs/types/blogs.types";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

function toSearchParams(query: BlogListQuery) {
  const searchParams = new URLSearchParams();

  searchParams.set("page", String(query.page));
  searchParams.set("limit", String(query.limit));
  searchParams.set("keyword", query.keyword ?? "");

  if (query.isActive !== undefined && query.isActive !== "all") {
    searchParams.set("isActive", String(query.isActive));
  }

  if (query.isPublished !== undefined && query.isPublished !== "all") {
    searchParams.set("isPublished", String(query.isPublished));
  }

  if (query.isPinned !== undefined && query.isPinned !== "all") {
    searchParams.set("isPinned", String(query.isPinned));
  }

  return searchParams.toString();
}

export async function listBlogs(query: BlogListQuery) {
  const accessToken = useAuthStore.getState().session.accessToken;

  return apiClient.get<BlogsListResult>(`${API_ENDPOINTS.blogs.list}?${toSearchParams(query)}`, {
    accessToken,
  });
}
