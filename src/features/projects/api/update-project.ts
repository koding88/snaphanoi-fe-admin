import { useAuthStore } from "@/features/auth/store/auth.store";
import type { ProjectMutationPayload, ProjectMutationResult } from "@/features/projects/types/projects-api.types";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

export async function updateProject(id: string, payload: ProjectMutationPayload) {
  const accessToken = useAuthStore.getState().session.accessToken;

  return apiClient.patchEnvelope<ProjectMutationResult>(API_ENDPOINTS.projects.byId(id), payload, {
    accessToken,
  });
}
