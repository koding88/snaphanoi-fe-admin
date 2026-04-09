import { useAuthStore } from "@/features/auth/store/auth.store";
import type { DeleteGalleryResult } from "@/features/galleries/types/galleries-api.types";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

export async function deleteGallery(id: string) {
  const accessToken = useAuthStore.getState().session.accessToken;

  return apiClient.deleteEnvelope<DeleteGalleryResult>(API_ENDPOINTS.galleries.byId(id), {
    accessToken,
  });
}
