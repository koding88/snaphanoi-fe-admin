import { useAuthStore } from "@/features/auth/store/auth.store";
import type { BlogMutationPayload, BlogMutationResult } from "@/features/blogs/types/blogs-api.types";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

export async function updateBlog(id: string, payload: Partial<BlogMutationPayload>) {
  const accessToken = useAuthStore.getState().session.accessToken;

  return apiClient.patchEnvelope<BlogMutationResult>(API_ENDPOINTS.blogs.byId(id), payload, {
    accessToken,
  });
}
