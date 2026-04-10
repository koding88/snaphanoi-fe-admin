import { useAuthStore } from "@/features/auth/store/auth.store";
import type { DeletePackageResult } from "@/features/packages/types/packages-api.types";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

export async function deletePackage(id: string) {
  const accessToken = useAuthStore.getState().session.accessToken;

  return apiClient.deleteEnvelope<DeletePackageResult>(
    API_ENDPOINTS.packages.byId(id),
    { accessToken },
  );
}
