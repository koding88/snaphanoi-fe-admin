import { useAuthStore } from "@/features/auth/store/auth.store";
import type { BlogMutationResult } from "@/features/blogs/types/blogs-api.types";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

export async function restoreBlog(id: string) {
  const accessToken = useAuthStore.getState().session.accessToken;

  return apiClient.patchEnvelope<BlogMutationResult>(API_ENDPOINTS.blogs.restore(id), undefined, {
    accessToken,
  });
}
