import { useAuthStore } from "@/features/auth/store/auth.store";
import type {
  VerifyMyEmailChangeOtpPayload,
  VerifyMyEmailChangeOtpResult,
} from "@/features/users/types/users-api.types";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

export async function verifyMyEmailChangeOtp(payload: VerifyMyEmailChangeOtpPayload) {
  const accessToken = useAuthStore.getState().session.accessToken;

  return apiClient.postEnvelope<VerifyMyEmailChangeOtpResult>(
    API_ENDPOINTS.users.verifyMyEmailChangeOtp,
    payload,
    {
      accessToken,
    },
  );
}
