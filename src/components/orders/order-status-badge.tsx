import { StatusBadge } from "@/components/shared/status-badge";
import type { OrderStatus } from "@/features/orders/types/orders.types";

type OrderStatusBadgeProps = {
  status: OrderStatus;
};

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  if (status === "cancelled") {
    return <StatusBadge tone="danger">Cancelled</StatusBadge>;
  }

  if (status === "completed") {
    return <StatusBadge tone="success">Completed</StatusBadge>;
  }

  if (status === "confirmed") {
    return <StatusBadge tone="default">Confirmed</StatusBadge>;
  }

  if (status === "contacted") {
    return <StatusBadge tone="warning">Contacted</StatusBadge>;
  }

  return <StatusBadge tone="neutral">Pending</StatusBadge>;
}
