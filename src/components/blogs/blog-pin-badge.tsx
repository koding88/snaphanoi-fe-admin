import { useTranslations } from "next-intl";

import { StatusBadge } from "@/components/shared/status-badge";

export function BlogPinBadge({ isPinned }: { isPinned: boolean }) {
  const t = useTranslations("blogs.badges");

  return isPinned ? <StatusBadge tone="warning">{t("pinned")}</StatusBadge> : <StatusBadge tone="neutral">{t("standard")}</StatusBadge>;
}
