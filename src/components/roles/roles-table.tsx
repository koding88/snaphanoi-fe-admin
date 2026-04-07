"use client";

import Link from "next/link";
import { useState } from "react";

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
  const [pendingRole, setPendingRole] = useState<RoleRecord | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
          <table className="min-w-[720px] w-full text-left">
            <thead className="border-b border-border/80 bg-white/55">
              <tr className="text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                <th className="px-5 py-4">Role</th>
                <th className="px-5 py-4">Type</th>
                <th className="px-5 py-4">Users</th>
                <th className="px-5 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {roles.map((role) => (
                <tr
                  key={role.id}
                  className="border-b border-border/60 transition-colors hover:bg-white/46 last:border-b-0"
                >
                  <td className="px-5 py-4">
                    <div className="space-y-1">
                      <Link
                        href={ROUTES.admin.roles.detail(role.id)}
                        className="font-medium text-foreground transition-opacity hover:opacity-75"
                      >
                        {role.name}
                      </Link>
                      <p className="text-sm text-muted-foreground">{role.key}</p>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <RoleSystemBadge isSystem={role.isSystem} />
                  </td>
                  <td className="px-5 py-4 text-sm text-muted-foreground">
                    Active {role.activeUsersCount} / Deleted {role.deletedUsersCount}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={ROUTES.admin.roles.edit(role.id)}
                        className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
                      >
                        <FontAwesomeIcon icon={faUserPen} />
                        Edit
                      </Link>
                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={() => setPendingRole(role)}
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
