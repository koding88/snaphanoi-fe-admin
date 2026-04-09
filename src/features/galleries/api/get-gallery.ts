import { useAuthStore } from "@/features/auth/store/auth.store";
import type { GalleryRecord } from "@/features/galleries/types/galleries.types";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

export async function getGallery(id: string) {
  const accessToken = useAuthStore.getState().session.accessToken;

  return apiClient.get<GalleryRecord>(API_ENDPOINTS.galleries.byId(id), {
    accessToken,
  });
}
