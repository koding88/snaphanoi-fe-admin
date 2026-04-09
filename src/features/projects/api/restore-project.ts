import { useAuthStore } from "@/features/auth/store/auth.store";
import type { ProjectMutationResult } from "@/features/projects/types/projects-api.types";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

export async function restoreProject(id: string) {
  const accessToken = useAuthStore.getState().session.accessToken;

  return apiClient.patchEnvelope<ProjectMutationResult>(API_ENDPOINTS.projects.restore(id), undefined, {
    accessToken,
  });
}
