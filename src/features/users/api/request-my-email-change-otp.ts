import { useAuthStore } from "@/features/auth/store/auth.store";
import type {
  RequestMyEmailChangeOtpPayload,
  RequestMyEmailChangeOtpResult,
} from "@/features/users/types/users-api.types";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

export async function requestMyEmailChangeOtp(payload: RequestMyEmailChangeOtpPayload) {
  const accessToken = useAuthStore.getState().session.accessToken;

  return apiClient.postEnvelope<RequestMyEmailChangeOtpResult>(
    API_ENDPOINTS.users.requestMyEmailChangeOtp,
    payload,
    {
      accessToken,
    },
  );
}
