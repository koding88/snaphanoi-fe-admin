import { useTranslations } from "next-intl";

import { AdminSurface } from "@/components/admin/admin-surface";
import { UserRoleBadge } from "@/components/users/user-role-badge";
import { UserStatusBadge } from "@/components/users/user-status-badge";
import type { UserRecord } from "@/features/users/types/users.types";
import { formatCountryCode, formatDateTime, formatPhoneNumberDisplay } from "@/features/users/utils/users-format";

export function UserDetailCard({ user }: { user: UserRecord }) {
  const t = useTranslations("users.detailCard");
  const lifecycleState = user.deletedAt
    ? t("lifecycle.archivedOn", { date: formatDateTime(user.deletedAt) })
    : user.isActive
      ? t("lifecycle.active")
      : t("lifecycle.inactive");
  const deletedAtLabel = user.deletedAt ? formatDateTime(user.deletedAt) : t("lifecycle.notDeleted");

  return (
    <AdminSurface className="p-6 md:p-8 xl:p-10">
      <div className="space-y-8">
        <section className="rounded-[1.7rem] border border-border/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.86),rgba(248,244,237,0.92))] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.78)] md:p-6">
          <div className="flex flex-wrap items-center gap-2">
            <UserStatusBadge isActive={user.isActive} deletedAt={user.deletedAt} />
            <UserRoleBadge roleName={user.roleName} />
            <span className="rounded-full border border-border/75 bg-white/80 px-3 py-1 text-[11px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
              {lifecycleState}
            </span>
          </div>
          <div className="mt-4 space-y-2">
            <p className="text-[11px] font-semibold tracking-[0.22em] text-[--color-brand-muted] uppercase">
              {t("sections.identity")}
            </p>
            <h2 className="font-heading text-4xl leading-tight tracking-[0.04em] text-foreground md:text-5xl">{user.name}</h2>
            <p className="text-sm text-muted-foreground">{t("id", { id: user.id })}</p>
            <p className="text-base text-foreground">{user.email}</p>
          </div>
        </section>

        <section className="rounded-[1.6rem] border border-border/80 bg-white/76 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.76)] md:p-6">
          <p className="text-[11px] font-semibold tracking-[0.22em] text-[--color-brand-muted] uppercase">
            {t("sections.profile")}
          </p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="rounded-[1.2rem] border border-border/70 bg-white/82 p-4">
              <p className="text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">{t("fields.email")}</p>
              <p className="mt-2 text-base font-medium text-foreground">{user.email}</p>
            </div>
            <div className="rounded-[1.2rem] border border-border/70 bg-white/82 p-4">
              <p className="text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">{t("fields.phoneNumber")}</p>
              <p className="mt-2 text-base font-medium text-foreground">{formatPhoneNumberDisplay(user.phoneNumber)}</p>
            </div>
            <div className="rounded-[1.2rem] border border-border/70 bg-white/82 p-4">
              <p className="text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">{t("fields.country")}</p>
              <p className="mt-2 text-base font-medium text-foreground">{formatCountryCode(user.countryCode)}</p>
            </div>
            <div className="rounded-[1.2rem] border border-border/70 bg-white/82 p-4">
              <p className="text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">{t("fields.role")}</p>
              <p className="mt-2 text-base font-medium text-foreground">{user.roleName ?? t("fields.noRole")}</p>
            </div>
            <div className="rounded-[1.2rem] border border-border/70 bg-white/82 p-4">
              <p className="text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">{t("fields.lifecycle")}</p>
              <p className="mt-2 text-base font-medium text-foreground">{deletedAtLabel}</p>
            </div>
          </div>
        </section>

        <section className="rounded-[1.6rem] border border-border/80 bg-white/70 p-5 md:p-6">
          <p className="text-[11px] font-semibold tracking-[0.22em] text-[--color-brand-muted] uppercase">
            {t("sections.metadata")}
          </p>
          <div className="mt-4 rounded-[1.2rem] border border-border/70 bg-white/78 p-4">
            <p className="text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">{t("fields.timeline")}</p>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <div>
                <p className="text-xs text-muted-foreground">{t("fields.createdAt")}</p>
                <p className="mt-1 text-sm text-foreground">{formatDateTime(user.createdAt)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{t("fields.updatedAt")}</p>
                <p className="mt-1 text-sm text-foreground">{formatDateTime(user.updatedAt)}</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </AdminSurface>
  );
}
