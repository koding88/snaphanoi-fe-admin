import { AdminSurface } from "@/components/admin/admin-surface";
import { RoleSystemBadge } from "@/components/roles/role-system-badge";
import type { RoleRecord } from "@/features/roles/types/roles.types";
import { formatDateTime } from "@/features/users/utils/users-format";

export function RoleDetailCard({ role }: { role: RoleRecord }) {
  const detailRows = [
    { label: "Role key", value: role.key },
    { label: "Created at", value: formatDateTime(role.createdAt) },
    { label: "Updated at", value: formatDateTime(role.updatedAt) },
    { label: "Active users", value: String(role.activeUsersCount) },
    { label: "Deleted users", value: String(role.deletedUsersCount) },
  ];

  return (
    <AdminSurface className="p-6 md:p-8">
      <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <RoleSystemBadge isSystem={role.isSystem} />
          </div>
          <div>
            <h2 className="font-heading text-4xl tracking-[0.04em] text-foreground">{role.name}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{role.id}</p>
          </div>
        </div>
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {detailRows.map((row) => (
          <div
            key={row.label}
            className="rounded-[1.5rem] border border-border/80 bg-white/72 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.76)]"
          >
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
