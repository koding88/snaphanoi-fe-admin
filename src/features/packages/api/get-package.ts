import { useAuthStore } from "@/features/auth/store/auth.store";
import type { PackageDetailRecord } from "@/features/packages/types/packages.types";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

export async function getPackage(id: string) {
  const accessToken = useAuthStore.getState().session.accessToken;

  return apiClient.get<PackageDetailRecord>(API_ENDPOINTS.packages.byId(id), {
    accessToken,
  });
}
