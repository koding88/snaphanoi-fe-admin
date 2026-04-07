import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type {
  ForgotPasswordPayload,
  RequestAcceptedPayload,
} from "@/features/auth/types/auth-api.types";

export function forgotPassword(payload: ForgotPasswordPayload) {
  return apiClient.postEnvelope<RequestAcceptedPayload>(
    API_ENDPOINTS.auth.forgotPassword,
    payload,
  );
}
