import { useTranslations } from "next-intl";

import { StatusBadge } from "@/components/shared/status-badge";
import type { OrderPaymentStatus } from "@/features/orders/types/orders.types";

type OrderPaymentBadgeProps = {
  status: OrderPaymentStatus;
};

export function OrderPaymentBadge({ status }: OrderPaymentBadgeProps) {
  const t = useTranslations("orders.badges");

  if (status === "paid") {
    return <StatusBadge tone="success">{t("paid")}</StatusBadge>;
  }

  if (status === "refunded") {
    return <StatusBadge tone="danger">{t("refunded")}</StatusBadge>;
  }

  if (status === "partiallyPaid") {
    return <StatusBadge tone="warning">{t("partiallyPaid")}</StatusBadge>;
  }

  return <StatusBadge tone="neutral">{t("unpaid")}</StatusBadge>;
}
