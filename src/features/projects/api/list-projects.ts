import { useAuthStore } from "@/features/auth/store/auth.store";
import type { ProjectListQuery, ProjectsListResult } from "@/features/projects/types/projects.types";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

function toSearchParams(query: ProjectListQuery) {
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

  return searchParams.toString();
}

export async function listProjects(query: ProjectListQuery) {
  const accessToken = useAuthStore.getState().session.accessToken;

  return apiClient.get<ProjectsListResult>(`${API_ENDPOINTS.projects.list}?${toSearchParams(query)}`, {
    accessToken,
  });
}
