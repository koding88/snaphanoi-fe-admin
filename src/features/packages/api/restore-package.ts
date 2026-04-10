import { useAuthStore } from "@/features/auth/store/auth.store";
import type { PackageMutationResult } from "@/features/packages/types/packages-api.types";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

export async function restorePackage(id: string) {
  const accessToken = useAuthStore.getState().session.accessToken;

  return apiClient.patchEnvelope<PackageMutationResult>(
    API_ENDPOINTS.packages.restore(id),
    undefined,
    { accessToken },
  );
}
