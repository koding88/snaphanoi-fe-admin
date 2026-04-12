import { StatusBadge } from "@/components/shared/status-badge";
import type { OrderPaymentStatus } from "@/features/orders/types/orders.types";

type OrderPaymentBadgeProps = {
  status: OrderPaymentStatus;
};

export function OrderPaymentBadge({ status }: OrderPaymentBadgeProps) {
  if (status === "paid") {
    return <StatusBadge tone="success">Paid</StatusBadge>;
  }

  if (status === "refunded") {
    return <StatusBadge tone="danger">Refunded</StatusBadge>;
  }

  if (status === "partiallyPaid") {
    return <StatusBadge tone="warning">Partially paid</StatusBadge>;
  }

  return <StatusBadge tone="neutral">Unpaid</StatusBadge>;
}
