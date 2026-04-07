import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { useAuthStore } from "@/features/auth/store/auth.store";
import type {
  ChangeMyPasswordPayload,
  ChangeMyPasswordResult,
} from "@/features/users/types/users-api.types";

export async function changeMyPassword(payload: ChangeMyPasswordPayload) {
  const accessToken = useAuthStore.getState().session.accessToken;

  return apiClient.patch<ChangeMyPasswordResult>(API_ENDPOINTS.users.changePassword, payload, {
    accessToken,
  });
}
