import type {
  OrderItemRecord,
  OrderMoney,
  OrderPaymentStatus,
  OrderStatus,
} from "@/features/orders/types/orders.types";
import { formatCountryCode } from "@/features/users/utils/users-format";

const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Pending",
  contacted: "Contacted",
  confirmed: "Confirmed",
  completed: "Completed",
  cancelled: "Cancelled",
};

const ORDER_PAYMENT_STATUS_LABELS: Record<OrderPaymentStatus, string> = {
  unpaid: "Unpaid",
  partiallyPaid: "Partially paid",
  paid: "Paid",
  refunded: "Refunded",
};

const ORDER_STATUS_TRANSLATION_KEYS: Record<OrderStatus, string> = {
  pending: "pending",
  contacted: "contacted",
  confirmed: "confirmed",
  completed: "completed",
  cancelled: "cancelled",
};

const ORDER_PAYMENT_STATUS_TRANSLATION_KEYS: Record<
  OrderPaymentStatus,
  string
> = {
  unpaid: "unpaid",
  partiallyPaid: "partiallyPaid",
  paid: "paid",
  refunded: "refunded",
};

const STATUS_FLOW: OrderStatus[] = [
  "pending",
  "contacted",
  "confirmed",
  "completed",
];

const PAYMENT_FLOW: OrderPaymentStatus[] = [
  "unpaid",
  "partiallyPaid",
  "paid",
  "refunded",
];

const ALLOWED_PAYMENT_BY_STATUS: Record<OrderStatus, OrderPaymentStatus[]> = {
  pending: ["unpaid"],
  contacted: ["unpaid", "partiallyPaid", "paid"],
  confirmed: ["unpaid", "partiallyPaid", "paid"],
  completed: ["paid"],
  cancelled: ["unpaid", "partiallyPaid", "paid", "refunded"],
};

export function formatOrderStatus(value: OrderStatus) {
  return ORDER_STATUS_LABELS[value];
}

export function formatOrderPaymentStatus(value: OrderPaymentStatus) {
  return ORDER_PAYMENT_STATUS_LABELS[value];
}

export function translateOrderStatus(
  value: OrderStatus,
  translate: (key: string) => string,
) {
  return translate(ORDER_STATUS_TRANSLATION_KEYS[value]);
}

export function translateOrderPaymentStatus(
  value: OrderPaymentStatus,
  translate: (key: string) => string,
) {
  return translate(ORDER_PAYMENT_STATUS_TRANSLATION_KEYS[value]);
}

export function formatOrderMoney(value: OrderMoney | null | undefined) {
  if (!value) {
    return "N/A";
  }

  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: value.currency,
      maximumFractionDigits: 0,
    }).format(value.amount);
  } catch {
    return `${value.amount.toLocaleString()} ${value.currency}`;
  }
}

export function formatOrderDiscoverySource(value: string | null | undefined) {
  if (!value) {
    return "Unknown";
  }

  return value
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function formatOrderCountry(value: string | null | undefined) {
  return formatCountryCode(value ?? null);
}

export function getPackageOrderPricing(item: OrderItemRecord) {
  if (item.type !== "package") {
    return null;
  }

  return item.pricing;
}

export function getCustomOrderBudget(item: OrderItemRecord) {
  if (item.type !== "custom") {
    return null;
  }

  return item.budget;
}

export function getAllowedNextStatuses(current: OrderStatus) {
  if (current === "cancelled" || current === "completed") {
    return [current];
  }

  const currentIndex = STATUS_FLOW.indexOf(current);
  const forwardFlow =
    currentIndex >= 0 ? STATUS_FLOW.slice(currentIndex) : [current];

  if (!forwardFlow.includes("cancelled")) {
    forwardFlow.push("cancelled");
  }

  return forwardFlow;
}

export function getAllowedNextPaymentStatuses(current: OrderPaymentStatus) {
  const currentIndex = PAYMENT_FLOW.indexOf(current);

  if (currentIndex < 0) {
    return [current];
  }

  return PAYMENT_FLOW.slice(currentIndex);
}

export function getAllowedPaymentStatusesForStatus(status: OrderStatus) {
  return ALLOWED_PAYMENT_BY_STATUS[status];
}

export function getAllowedPaymentStatusesForSelection({
  selectedStatus,
  currentPaymentStatus,
}: {
  selectedStatus: OrderStatus;
  currentPaymentStatus: OrderPaymentStatus;
}) {
  const allowedByStatus = getAllowedPaymentStatusesForStatus(selectedStatus);
  const allowedByForwardTransition =
    getAllowedNextPaymentStatuses(currentPaymentStatus);

  return allowedByForwardTransition.filter((paymentStatus) =>
    allowedByStatus.includes(paymentStatus),
  );
}
