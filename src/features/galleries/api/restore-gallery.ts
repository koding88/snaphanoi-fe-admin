import { useAuthStore } from "@/features/auth/store/auth.store";
import type { GalleryMutationResult } from "@/features/galleries/types/galleries-api.types";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

export async function restoreGallery(id: string) {
  const accessToken = useAuthStore.getState().session.accessToken;

  return apiClient.patchEnvelope<GalleryMutationResult>(API_ENDPOINTS.galleries.restore(id), undefined, {
    accessToken,
  });
}
