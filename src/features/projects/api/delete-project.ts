import { useAuthStore } from "@/features/auth/store/auth.store";
import type { DeleteProjectResult } from "@/features/projects/types/projects-api.types";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

export async function deleteProject(id: string) {
  const accessToken = useAuthStore.getState().session.accessToken;

  return apiClient.deleteEnvelope<DeleteProjectResult>(API_ENDPOINTS.projects.byId(id), {
    accessToken,
  });
}
