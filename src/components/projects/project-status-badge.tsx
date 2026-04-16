import { useTranslations } from "next-intl";

import { StatusBadge } from "@/components/shared/status-badge";

type ProjectStatusBadgeProps = {
  isActive: boolean;
  deletedAt: string | null;
};

export function ProjectStatusBadge({ isActive, deletedAt }: ProjectStatusBadgeProps) {
  const t = useTranslations("projects.badges");

  if (deletedAt) {
    return <StatusBadge tone="danger">{t("archived")}</StatusBadge>;
  }

  return isActive ? (
    <StatusBadge tone="success">{t("active")}</StatusBadge>
  ) : (
    <StatusBadge tone="warning">{t("inactive")}</StatusBadge>
  );
}
