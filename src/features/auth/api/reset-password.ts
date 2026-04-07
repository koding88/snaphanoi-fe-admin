import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type {
  ResetPasswordPayload,
  ResetPasswordSuccessPayload,
} from "@/features/auth/types/auth-api.types";

export function resetPassword(payload: ResetPasswordPayload) {
  return apiClient.post<ResetPasswordSuccessPayload>(
    API_ENDPOINTS.auth.resetPassword,
    payload,
  );
}
