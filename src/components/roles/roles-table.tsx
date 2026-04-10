"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type KeyboardEvent, type MouseEvent, useState } from "react";

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

export function RolesTable({ roles, onDelete, isBusy = false }: RolesTableProps) {
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
        <div className="border-b border-border/70 bg-white/56 px-5 py-4">
          <p className="text-xs font-semibold tracking-[0.22em] text-[--color-brand-muted] uppercase">
            Role records
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Role identity and usage stay central, without adding extra permission complexity to this screen.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-[720px] w-full table-fixed text-left">
            <thead className="border-b border-border/80 bg-white/55">
              <tr className="text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                <th className="w-[40%] px-5 py-4">Role</th>
                <th className="w-[16%] px-5 py-4">Type</th>
                <th className="w-[27%] px-5 py-4">Users</th>
                <th className="w-[17%] px-5 py-4 text-right">Actions</th>
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
                  <td className="align-middle px-5 py-5">
                    <div className="space-y-1">
                      <p className="font-medium text-foreground">{role.name}</p>
                      <p className="text-sm text-muted-foreground">{role.key}</p>
                    </div>
                  </td>
                  <td className="align-middle px-5 py-5">
                    <RoleSystemBadge isSystem={role.isSystem} />
                  </td>
                  <td className="align-middle px-5 py-5 text-sm text-muted-foreground">
                    Active {role.activeUsersCount} / Deleted {role.deletedUsersCount}
                  </td>
                  <td className="align-middle px-5 py-5">
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
                        Edit
                      </Link>
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
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <ConfirmDialog
        open={Boolean(pendingRole)}
        title={`Delete ${pendingRole?.name}?`}
        description="Delete is only available when the role is no longer being used. Otherwise you will see a conflict message."
        confirmLabel="Delete role"
        confirmVariant="destructive"
        isSubmitting={isSubmitting}
        onCancel={() => setPendingRole(null)}
        onConfirm={handleConfirm}
        extra={
          pendingRole ? (
            <div className="space-y-1">
              <p className="text-xs font-semibold tracking-[0.16em] text-[--color-brand-muted] uppercase">
                Selected role
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
