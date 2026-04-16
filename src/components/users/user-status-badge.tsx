import { useTranslations } from "next-intl";

import { StatusBadge } from "@/components/shared/status-badge";

type UserStatusBadgeProps = {
  isActive: boolean;
  deletedAt: string | null;
};

export function UserStatusBadge({ isActive, deletedAt }: UserStatusBadgeProps) {
  const t = useTranslations("users.badges");

  if (deletedAt) {
    return <StatusBadge tone="danger">{t("deleted")}</StatusBadge>;
  }

  if (isActive) {
    return <StatusBadge tone="success">{t("active")}</StatusBadge>;
  }

  return <StatusBadge tone="warning">{t("inactive")}</StatusBadge>;
}
