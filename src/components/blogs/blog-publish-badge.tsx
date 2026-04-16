import { useTranslations } from "next-intl";

import { StatusBadge } from "@/components/shared/status-badge";

export function BlogPublishBadge({ isPublished }: { isPublished: boolean }) {
  const t = useTranslations("blogs.badges");

  return isPublished ? <StatusBadge tone="default">{t("published")}</StatusBadge> : <StatusBadge tone="neutral">{t("draft")}</StatusBadge>;
}
