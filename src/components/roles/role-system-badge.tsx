import { useTranslations } from "next-intl";

import { StatusBadge } from "@/components/shared/status-badge";

export function RoleSystemBadge({ isSystem }: { isSystem: boolean }) {
  const t = useTranslations("roles.badges");

  return isSystem ? (
    <StatusBadge tone="warning">{t("system")}</StatusBadge>
  ) : (
    <StatusBadge tone="neutral">{t("custom")}</StatusBadge>
  );
}
