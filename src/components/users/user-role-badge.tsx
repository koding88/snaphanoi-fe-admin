import { useTranslations } from "next-intl";

import { StatusBadge } from "@/components/shared/status-badge";

export function UserRoleBadge({ roleName }: { roleName: string | null }) {
  const t = useTranslations("users.badges");

  return <StatusBadge tone="default">{roleName ?? t("noRole")}</StatusBadge>;
}
