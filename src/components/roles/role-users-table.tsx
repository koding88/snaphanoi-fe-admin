import Link from "next/link";
import { useTranslations } from "next-intl";

import { UserStatusBadge } from "@/components/users/user-status-badge";
import { ROUTES } from "@/lib/constants/routes";
import type { RoleUserRecord } from "@/features/roles/types/roles.types";
import { formatCountryCode } from "@/features/users/utils/users-format";

export function RoleUsersTable({ users }: { users: RoleUserRecord[] }) {
  const t = useTranslations("roles.roleUsersTable");

  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-border/80 bg-white/72">
      <div className="overflow-x-auto">
          <table className="w-full text-left sm:min-w-[520px]">
            <thead className="border-b border-border/80 bg-white/60">
              <tr className="text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                <th className="px-5 py-4">{t("columns.user")}</th>
                <th className="hidden px-5 py-4 sm:table-cell">{t("columns.country")}</th>
                <th className="px-5 py-4">{t("columns.status")}</th>
              </tr>
            </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-border/60 last:border-b-0">
                <td className="px-5 py-4">
                  <div className="space-y-1">
                    <Link
                      href={ROUTES.admin.users.detail(user.id)}
                      className="font-medium text-foreground transition-opacity hover:opacity-75"
                    >
                      {user.name}
                    </Link>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <p className="text-xs text-muted-foreground sm:hidden">
                      {formatCountryCode(user.countryCode)}
                    </p>
                  </div>
                </td>
                <td className="hidden px-5 py-4 text-sm text-muted-foreground sm:table-cell">
                  {formatCountryCode(user.countryCode)}
                </td>
                <td className="px-5 py-4">
                  <UserStatusBadge isActive={user.isActive} deletedAt={user.deletedAt} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
