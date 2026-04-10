import { useAuthStore } from "@/features/auth/store/auth.store";
import type { BlogMutationPayload, BlogMutationResult } from "@/features/blogs/types/blogs-api.types";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

export async function createBlog(payload: BlogMutationPayload) {
  const accessToken = useAuthStore.getState().session.accessToken;

  return apiClient.postEnvelope<BlogMutationResult>(API_ENDPOINTS.blogs.list, payload, {
    accessToken,
  });
}
