import Link from "next/link";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { AdminSurface } from "@/components/admin/admin-surface";
import { buttonVariants } from "@/components/ui/button";
import { UserRoleBadge } from "@/components/users/user-role-badge";
import { UserStatusBadge } from "@/components/users/user-status-badge";
import { ROUTES } from "@/lib/constants/routes";
import { faUserPen } from "@/lib/icons/fa";
import { cn } from "@/lib/utils";
import type { UserRecord } from "@/features/users/types/users.types";
import { formatCountryCode, formatDateTime } from "@/features/users/utils/users-format";

export function UserDetailCard({ user }: { user: UserRecord }) {
  const detailRows = [
    { label: "Email", value: user.email },
    { label: "Country code", value: formatCountryCode(user.countryCode) },
    { label: "Role", value: user.roleName ?? "N/A" },
    { label: "Created at", value: formatDateTime(user.createdAt) },
    { label: "Updated at", value: formatDateTime(user.updatedAt) },
    { label: "Deleted at", value: formatDateTime(user.deletedAt) },
  ];

  return (
    <AdminSurface className="p-6 md:p-8">
      <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <UserStatusBadge isActive={user.isActive} deletedAt={user.deletedAt} />
            <UserRoleBadge roleName={user.roleName} />
          </div>
          <div>
            <h2 className="font-heading text-4xl tracking-[0.04em] text-foreground">{user.name}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{user.id}</p>
          </div>
        </div>
        <Link
          href={ROUTES.admin.users.edit(user.id)}
          className={cn(buttonVariants({ size: "lg" }), "rounded-full")}
        >
          <FontAwesomeIcon icon={faUserPen} />
          Edit user
        </Link>
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {detailRows.map((row) => (
          <div key={row.label} className="rounded-[1.5rem] border border-border/80 bg-white/70 p-4">
            <p className="text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">
              {row.label}
            </p>
            <p className="mt-2 text-sm leading-7 text-foreground">{row.value}</p>
          </div>
        ))}
      </div>
    </AdminSurface>
  );
}
