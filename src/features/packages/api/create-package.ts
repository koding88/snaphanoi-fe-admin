import { useAuthStore } from "@/features/auth/store/auth.store";
import type {
  PackageMutationPayload,
  PackageMutationResult,
} from "@/features/packages/types/packages-api.types";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

export async function createPackage(payload: PackageMutationPayload) {
  const accessToken = useAuthStore.getState().session.accessToken;

  return apiClient.postEnvelope<PackageMutationResult>(
    API_ENDPOINTS.packages.list,
    payload,
    { accessToken },
  );
}
