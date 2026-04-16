"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type KeyboardEvent, type MouseEvent, useState } from "react";
import { useTranslations } from "next-intl";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { buttonVariants } from "@/components/ui/button";
import { RoleSystemBadge } from "@/components/roles/role-system-badge";
import { ROUTES } from "@/lib/constants/routes";
import { faTrashCan, faUserPen } from "@/lib/icons/fa";
import { cn } from "@/lib/utils";
import type { RoleRecord } from "@/features/roles/types/roles.types";

type RolesTableProps = {
  roles: RoleRecord[];
  onDelete: (role: RoleRecord) => Promise<void>;
  isBusy?: boolean;
};

// Temporarily hidden until permission-based access is implemented.
// Backend still uses hard-coded role-based access, so delete role UI affordances are disabled for now.
const SHOW_ROLE_DELETE_ACTIONS = false;

export function RolesTable({ roles, onDelete, isBusy = false }: RolesTableProps) {
  const t = useTranslations("roles.table");
  const router = useRouter();
  const [pendingRole, setPendingRole] = useState<RoleRecord | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleRowActionClick = (event: MouseEvent | KeyboardEvent) => {
    event.stopPropagation();
  };

  function navigateToRole(roleId: string) {
    router.push(ROUTES.admin.roles.detail(roleId));
  }

  async function handleConfirm() {
    if (!pendingRole) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onDelete(pendingRole);
      setPendingRole(null);
    } catch {
      // Parent page surfaces the error.
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <div className="surface-enter overflow-hidden rounded-[2rem] border border-border/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(248,244,237,0.88))] shadow-soft">
        <div className="border-b border-border/70 bg-white/56 px-5 py-3">
            <p className="text-xs font-semibold tracking-[0.22em] text-[--color-brand-muted] uppercase">
            {t("title")}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {t("description")}
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full table-fixed text-left sm:min-w-[640px]">
            <thead className="border-b border-border/80 bg-white/55">
              <tr className="text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                <th className="w-[40%] px-5 py-4">{t("columns.role")}</th>
                <th className="w-[16%] px-5 py-4">{t("columns.type")}</th>
                <th className="hidden w-[27%] px-5 py-4 md:table-cell">{t("columns.users")}</th>
                <th className="w-[17%] px-5 py-4 text-right">{t("columns.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {roles.map((role) => (
                <tr
                  key={role.id}
                  role="link"
                  tabIndex={0}
                  onClick={() => navigateToRole(role.id)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      navigateToRole(role.id);
                    }
                  }}
                  className="cursor-pointer border-b border-border/60 transition-[background-color,box-shadow] hover:bg-white/60 focus-visible:bg-white/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-brand]/30 last:border-b-0"
                >
                  <td className="align-middle px-5 py-4">
                    <div className="space-y-1">
                      <p className="font-medium text-foreground">{role.name}</p>
                      <p className="text-sm text-muted-foreground">{role.key}</p>
                      <p className="text-xs text-muted-foreground md:hidden">
                        {t("usersSummary", { active: role.activeUsersCount, deleted: role.deletedUsersCount })}
                      </p>
                    </div>
                  </td>
                  <td className="align-middle px-5 py-4">
                    <RoleSystemBadge isSystem={role.isSystem} />
                  </td>
                  <td className="hidden align-middle px-5 py-4 text-sm text-muted-foreground md:table-cell">
                    {t("usersSummary", { active: role.activeUsersCount, deleted: role.deletedUsersCount })}
                  </td>
                  <td className="align-middle px-5 py-4">
                    <div
                      className="flex flex-wrap justify-end gap-2"
                      onClick={handleRowActionClick}
                      onKeyDown={handleRowActionClick}
                    >
                      <Link
                        href={ROUTES.admin.roles.edit(role.id)}
                        className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
                        onClick={handleRowActionClick}
                      >
                        <FontAwesomeIcon icon={faUserPen} />
                        {t("actions.edit")}
                      </Link>
                      {SHOW_ROLE_DELETE_ACTIONS ? (
                        <button
                          type="button"
                          disabled={isBusy}
                          onClick={(event) => {
                            handleRowActionClick(event);
                            setPendingRole(role);
                          }}
                          className={cn(
                            buttonVariants({ variant: "destructive", size: "sm" }),
                            "disabled:pointer-events-none disabled:opacity-50",
                          )}
                        >
                          <FontAwesomeIcon icon={faTrashCan} />
                          {t("actions.delete")}
                        </button>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <ConfirmDialog
        open={SHOW_ROLE_DELETE_ACTIONS && Boolean(pendingRole)}
        title={t("dialogs.deleteTitle", { name: pendingRole?.name ?? "" })}
        description={t("dialogs.deleteDescription")}
        confirmLabel={t("dialogs.deleteConfirm")}
        confirmVariant="destructive"
        isSubmitting={isSubmitting}
        onCancel={() => setPendingRole(null)}
        onConfirm={handleConfirm}
        extra={
          pendingRole ? (
            <div className="space-y-1">
              <p className="text-xs font-semibold tracking-[0.16em] text-[--color-brand-muted] uppercase">
                {t("dialogs.selectedRole")}
              </p>
              <p className="text-sm font-medium text-foreground">{pendingRole.name}</p>
              <p className="text-sm text-muted-foreground">{pendingRole.key}</p>
            </div>
          ) : null
        }
      />
    </>
  );
}
