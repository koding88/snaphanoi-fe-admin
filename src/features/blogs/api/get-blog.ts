import { useAuthStore } from "@/features/auth/store/auth.store";
import type { BlogDetailRecord } from "@/features/blogs/types/blogs.types";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

export async function getBlog(id: string) {
  const accessToken = useAuthStore.getState().session.accessToken;

  return apiClient.get<BlogDetailRecord>(API_ENDPOINTS.blogs.byId(id), {
    accessToken,
  });
}
