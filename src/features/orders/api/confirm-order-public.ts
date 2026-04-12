import type {
  PublicOrderConfirmPayload,
  OrderUpdateResult,
} from "@/features/orders/types/orders-api.types";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

export async function confirmOrderPublic(payload: PublicOrderConfirmPayload) {
  return apiClient.postEnvelope<OrderUpdateResult>(
    API_ENDPOINTS.orders.publicConfirm,
    payload,
  );
}
