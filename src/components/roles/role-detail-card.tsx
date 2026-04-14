import { AdminSurface } from "@/components/admin/admin-surface";
import { RoleSystemBadge } from "@/components/roles/role-system-badge";
import type { RoleRecord } from "@/features/roles/types/roles.types";
import { formatDateTime } from "@/features/users/utils/users-format";

export function RoleDetailCard({ role }: { role: RoleRecord }) {
  const lifecycleLabel = role.isSystem ? "System-managed role" : "Custom role";

  return (
    <AdminSurface className="p-6 md:p-8 xl:p-10">
      <div className="space-y-8">
        <section className="rounded-[1.7rem] border border-border/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.86),rgba(248,244,237,0.92))] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.78)] md:p-6">
          <div className="flex flex-wrap items-center gap-2">
            <RoleSystemBadge isSystem={role.isSystem} />
            <span className="rounded-full border border-border/75 bg-white/80 px-3 py-1 text-[11px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
              {lifecycleLabel}
            </span>
          </div>
          <div className="mt-4 space-y-2">
            <p className="text-[11px] font-semibold tracking-[0.22em] text-[--color-brand-muted] uppercase">
              Role identity
            </p>
            <h2 className="font-heading text-4xl leading-tight tracking-[0.04em] text-foreground md:text-5xl">{role.name}</h2>
            <p className="text-sm text-muted-foreground">ID: {role.id}</p>
            <p className="text-sm text-foreground">Role key: {role.key}</p>
          </div>
        </section>

        <section className="rounded-[1.6rem] border border-border/80 bg-white/76 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.76)] md:p-6">
          <p className="text-[11px] font-semibold tracking-[0.22em] text-[--color-brand-muted] uppercase">
            Usage summary
          </p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="rounded-[1.2rem] border border-border/70 bg-white/82 p-4">
              <p className="text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">Active users</p>
              <p className="mt-2 text-2xl font-semibold text-foreground">{role.activeUsersCount}</p>
            </div>
            <div className="rounded-[1.2rem] border border-border/70 bg-white/82 p-4">
              <p className="text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">Archived users</p>
              <p className="mt-2 text-2xl font-semibold text-foreground">{role.deletedUsersCount}</p>
            </div>
          </div>
        </section>

        <section className="rounded-[1.6rem] border border-border/80 bg-white/70 p-5 md:p-6">
          <p className="text-[11px] font-semibold tracking-[0.22em] text-[--color-brand-muted] uppercase">
            Admin metadata
          </p>
          <div className="mt-4 rounded-[1.2rem] border border-border/70 bg-white/78 p-4">
            <p className="text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">Timeline</p>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <div>
                <p className="text-xs text-muted-foreground">Created at</p>
                <p className="mt-1 text-sm text-foreground">{formatDateTime(role.createdAt)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Updated at</p>
                <p className="mt-1 text-sm text-foreground">{formatDateTime(role.updatedAt)}</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </AdminSurface>
  );
}
