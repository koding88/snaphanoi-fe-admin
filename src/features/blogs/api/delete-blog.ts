import { useAuthStore } from "@/features/auth/store/auth.store";
import type { DeleteBlogResult } from "@/features/blogs/types/blogs-api.types";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

export async function deleteBlog(id: string) {
  const accessToken = useAuthStore.getState().session.accessToken;

  return apiClient.deleteEnvelope<DeleteBlogResult>(API_ENDPOINTS.blogs.byId(id), {
    accessToken,
  });
}
