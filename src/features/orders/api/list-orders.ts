import { useAuthStore } from "@/features/auth/store/auth.store";
import type {
  OrderListQuery,
  OrdersListResult,
} from "@/features/orders/types/orders.types";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

function toSearchParams(query: OrderListQuery) {
  const searchParams = new URLSearchParams();

  searchParams.set("page", String(query.page));
  searchParams.set("limit", String(query.limit));
  searchParams.set("keyword", query.keyword);
  searchParams.set("status", query.status);
  searchParams.set("paymentStatus", query.paymentStatus);
  searchParams.set("discoverySource", query.discoverySource);

  return searchParams.toString();
}

export async function listOrders(query: OrderListQuery) {
  const accessToken = useAuthStore.getState().session.accessToken;

  return apiClient.get<OrdersListResult>(
    `${API_ENDPOINTS.orders.list}?${toSearchParams(query)}`,
    { accessToken },
  );
}
