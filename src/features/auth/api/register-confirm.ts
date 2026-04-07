import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type {
  RegisterConfirmPayload,
  RegisterConfirmedPayload,
} from "@/features/auth/types/auth-api.types";

export function registerConfirm(payload: RegisterConfirmPayload) {
  return apiClient.post<RegisterConfirmedPayload>(
    API_ENDPOINTS.auth.registerConfirm,
    payload,
  );
}
