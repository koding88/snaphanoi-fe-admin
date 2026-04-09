import { useAuthStore } from "@/features/auth/store/auth.store";
import type { ProjectDetailRecord } from "@/features/projects/types/projects.types";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

export async function getProject(id: string) {
  const accessToken = useAuthStore.getState().session.accessToken;

  return apiClient.get<ProjectDetailRecord>(API_ENDPOINTS.projects.byId(id), {
    accessToken,
  });
}
