import type { PublicOrderGalleryOption } from "@/features/orders/types/orders.types";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

export async function listPublicOrderGalleries() {
  return apiClient.get<PublicOrderGalleryOption[]>(
    API_ENDPOINTS.galleries.publicList,
  );
}
