import type {
  PublicOrderRequestPayload,
  PublicOrderRequestResult,
} from "@/features/orders/types/orders-api.types";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

export async function requestOrderPublic(payload: PublicOrderRequestPayload) {
  return apiClient.postEnvelope<PublicOrderRequestResult>(
    API_ENDPOINTS.orders.publicRequest,
    payload,
  );
}
