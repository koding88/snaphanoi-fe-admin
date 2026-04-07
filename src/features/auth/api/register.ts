import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { RegisterPayload, RequestAcceptedPayload } from "@/features/auth/types/auth-api.types";

export function register(payload: RegisterPayload) {
  return apiClient.postEnvelope<RequestAcceptedPayload>(API_ENDPOINTS.auth.register, payload);
}
