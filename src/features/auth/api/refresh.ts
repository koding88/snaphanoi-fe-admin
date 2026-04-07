import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { AuthSuccessPayload } from "@/features/auth/types/auth-api.types";

export function refresh() {
  return apiClient.post<AuthSuccessPayload>(API_ENDPOINTS.auth.refresh);
}
