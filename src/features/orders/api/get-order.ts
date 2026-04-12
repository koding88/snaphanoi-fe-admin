import { useAuthStore } from "@/features/auth/store/auth.store";
import type { OrderDetailRecord } from "@/features/orders/types/orders.types";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

export async function getOrder(id: string) {
  const accessToken = useAuthStore.getState().session.accessToken;

  return apiClient.get<OrderDetailRecord>(API_ENDPOINTS.orders.byId(id), {
    accessToken,
  });
}
