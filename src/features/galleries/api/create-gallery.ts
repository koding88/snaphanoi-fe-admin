import { useAuthStore } from "@/features/auth/store/auth.store";
import type { GalleryMutationResult, GalleryPayload } from "@/features/galleries/types/galleries-api.types";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

export async function createGallery(payload: GalleryPayload) {
  const accessToken = useAuthStore.getState().session.accessToken;

  return apiClient.postEnvelope<GalleryMutationResult>(API_ENDPOINTS.galleries.list, payload, {
    accessToken,
  });
}
