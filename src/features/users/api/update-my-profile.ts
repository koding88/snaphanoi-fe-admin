import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { useAuthStore } from "@/features/auth/store/auth.store";
import type {
  UpdateMyProfilePayload,
  UserMutationResult,
} from "@/features/users/types/users-api.types";

export async function updateMyProfile(payload: UpdateMyProfilePayload) {
  const accessToken = useAuthStore.getState().session.accessToken;

  return apiClient.patchEnvelope<UserMutationResult>(API_ENDPOINTS.users.me, payload, {
    accessToken,
  });
}
