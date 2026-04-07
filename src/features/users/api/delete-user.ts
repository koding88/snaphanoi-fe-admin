import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { useAuthStore } from "@/features/auth/store/auth.store";
import type { DeleteUserResult } from "@/features/users/types/users-api.types";

export async function deleteUser(id: string) {
  const accessToken = useAuthStore.getState().session.accessToken;

  return apiClient.delete<DeleteUserResult>(API_ENDPOINTS.users.byId(id), {
    accessToken,
  });
}
