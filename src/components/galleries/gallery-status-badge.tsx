import { useTranslations } from "next-intl";

import { StatusBadge } from "@/components/shared/status-badge";

export function GalleryStatusBadge({ isActive, deletedAt }: { isActive: boolean; deletedAt: string | null }) {
  const t = useTranslations("galleries.badges");

  if (deletedAt) {
    return <StatusBadge tone="danger">{t("archived")}</StatusBadge>;
  }

  return isActive ? <StatusBadge tone="success">{t("active")}</StatusBadge> : <StatusBadge tone="warning">{t("inactive")}</StatusBadge>;
}
