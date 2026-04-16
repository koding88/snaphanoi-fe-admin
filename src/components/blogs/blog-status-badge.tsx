import { useTranslations } from "next-intl";

import { StatusBadge } from "@/components/shared/status-badge";

type BlogStatusBadgeProps = {
  isActive: boolean;
  deletedAt: string | null;
};

export function BlogStatusBadge({ isActive, deletedAt }: BlogStatusBadgeProps) {
  const t = useTranslations("blogs.badges");

  if (deletedAt) {
    return <StatusBadge tone="danger">{t("archived")}</StatusBadge>;
  }

  return isActive ? <StatusBadge tone="success">{t("active")}</StatusBadge> : <StatusBadge tone="warning">{t("inactive")}</StatusBadge>;
}
