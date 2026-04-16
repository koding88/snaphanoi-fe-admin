import { useTranslations } from "next-intl";

import { StatusBadge } from "@/components/shared/status-badge";
import type { OrderStatus } from "@/features/orders/types/orders.types";

type OrderStatusBadgeProps = {
  status: OrderStatus;
};

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const t = useTranslations("orders.badges");

  if (status === "cancelled") {
    return <StatusBadge tone="danger">{t("cancelled")}</StatusBadge>;
  }

  if (status === "completed") {
    return <StatusBadge tone="success">{t("completed")}</StatusBadge>;
  }

  if (status === "confirmed") {
    return <StatusBadge tone="default">{t("confirmed")}</StatusBadge>;
  }

  if (status === "contacted") {
    return <StatusBadge tone="warning">{t("contacted")}</StatusBadge>;
  }

  return <StatusBadge tone="neutral">{t("pending")}</StatusBadge>;
}
