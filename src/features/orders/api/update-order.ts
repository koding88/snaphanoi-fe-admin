import { useAuthStore } from "@/features/auth/store/auth.store";
import type {
  OrderUpdatePayload,
  OrderUpdateResult,
} from "@/features/orders/types/orders-api.types";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

export async function updateOrder(id: string, payload: OrderUpdatePayload) {
  const accessToken = useAuthStore.getState().session.accessToken;

  return apiClient.patchEnvelope<OrderUpdateResult>(
    API_ENDPOINTS.orders.byId(id),
    payload,
    { accessToken },
  );
}
