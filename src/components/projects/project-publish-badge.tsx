import { useTranslations } from "next-intl";

import { StatusBadge } from "@/components/shared/status-badge";

export function ProjectPublishBadge({ isPublished }: { isPublished: boolean }) {
  const t = useTranslations("projects.badges");

  return isPublished ? (
    <StatusBadge tone="default">{t("published")}</StatusBadge>
  ) : (
    <StatusBadge tone="neutral">{t("draft")}</StatusBadge>
  );
}
