import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { AuthSuccessPayload, LoginPayload } from "@/features/auth/types/auth-api.types";

export function login(payload: LoginPayload) {
  return apiClient.post<AuthSuccessPayload>(API_ENDPOINTS.auth.login, payload);
}
