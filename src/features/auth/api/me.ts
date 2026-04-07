import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { AuthenticatedUser } from "@/features/auth/types/auth.types";

export function me(accessToken: string) {
  return apiClient.get<AuthenticatedUser>(API_ENDPOINTS.auth.me, {
    accessToken,
  });
}
