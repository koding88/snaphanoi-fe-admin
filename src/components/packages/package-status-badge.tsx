import { useTranslations } from "next-intl";

import { StatusBadge } from "@/components/shared/status-badge";

type PackageStatusBadgeProps = {
  isActive: boolean;
  deletedAt: string | null;
};

export function PackageStatusBadge({
  isActive,
  deletedAt,
}: PackageStatusBadgeProps) {
  const t = useTranslations("packages.badges");

  if (deletedAt) {
    return <StatusBadge tone="danger">{t("archived")}</StatusBadge>;
  }

  return isActive ? (
    <StatusBadge tone="success">{t("active")}</StatusBadge>
  ) : (
    <StatusBadge tone="warning">{t("inactive")}</StatusBadge>
  );
}
