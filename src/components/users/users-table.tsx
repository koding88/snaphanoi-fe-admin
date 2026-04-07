"use client";

import Link from "next/link";
import { useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { UserRoleBadge } from "@/components/users/user-role-badge";
import { UserStatusBadge } from "@/components/users/user-status-badge";
import { ROUTES } from "@/lib/constants/routes";
import { faRotateLeft, faTrashCan, faUserPen } from "@/lib/icons/fa";
import { cn } from "@/lib/utils";
import type { UserRecord } from "@/features/users/types/users.types";

type UsersTableProps = {
  users: UserRecord[];
  isBusy?: boolean;
  onDelete: (user: UserRecord) => Promise<void>;
  onRestore: (user: UserRecord) => Promise<void>;
};

export function UsersTable({ users, isBusy = false, onDelete, onRestore }: UsersTableProps) {
  const [pendingAction, setPendingAction] = useState<{
    type: "delete" | "restore";
    user: UserRecord;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleConfirm() {
    if (!pendingAction) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (pendingAction.type === "delete") {
        await onDelete(pendingAction.user);
      } else {
        await onRestore(pendingAction.user);
      }
      setPendingAction(null);
    } catch {
      // Parent page surfaces the mutation error.
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <div className="surface-enter overflow-hidden rounded-[2rem] border border-border/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(248,244,237,0.88))] shadow-soft">
        <div className="border-b border-border/70 bg-white/56 px-5 py-4">
          <p className="text-xs font-semibold tracking-[0.22em] text-[--color-brand-muted] uppercase">
            User records
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Core actions stay visible while the table keeps horizontal overflow manageable on smaller screens.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-[760px] w-full text-left">
            <thead className="border-b border-border/80 bg-white/55">
              <tr className="text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                <th className="px-5 py-4">User</th>
                <th className="px-5 py-4">Role</th>
                <th className="px-5 py-4">Country</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-border/60 transition-colors hover:bg-white/46 last:border-b-0"
                >
                  <td className="px-5 py-4">
                    <div className="space-y-1">
                      <Link
                        href={ROUTES.admin.users.detail(user.id)}
                        className="font-medium text-foreground transition-opacity hover:opacity-75"
                      >
                        {user.name}
                      </Link>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <UserRoleBadge roleName={user.roleName} />
                  </td>
                  <td className="px-5 py-4 text-sm text-muted-foreground">
                    {user.countryCode ?? "N/A"}
                  </td>
                  <td className="px-5 py-4">
                    <UserStatusBadge isActive={user.isActive} deletedAt={user.deletedAt} />
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={ROUTES.admin.users.edit(user.id)}
                        className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
                      >
                        <FontAwesomeIcon icon={faUserPen} />
                        Edit
                      </Link>
                      {user.deletedAt ? (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          disabled={isBusy}
                          onClick={() => setPendingAction({ type: "restore", user })}
                        >
                          <FontAwesomeIcon icon={faRotateLeft} />
                          Restore
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          disabled={isBusy}
                          onClick={() => setPendingAction({ type: "delete", user })}
                        >
                          <FontAwesomeIcon icon={faTrashCan} />
                          Delete
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <ConfirmDialog
        open={Boolean(pendingAction)}
        title={
          pendingAction?.type === "delete"
            ? `Delete ${pendingAction.user.name}?`
            : `Restore ${pendingAction?.user.name}?`
        }
        description={
          pendingAction?.type === "delete"
            ? "This performs a soft delete through the backend. The user can be restored later."
            : "This will restore the soft-deleted user and return them to an active record."
        }
        confirmLabel={pendingAction?.type === "delete" ? "Delete user" : "Restore user"}
        confirmVariant={pendingAction?.type === "delete" ? "destructive" : "default"}
        isSubmitting={isSubmitting}
        onCancel={() => setPendingAction(null)}
        onConfirm={handleConfirm}
        extra={
          pendingAction ? (
            <div className="space-y-1">
              <p className="text-xs font-semibold tracking-[0.16em] text-[--color-brand-muted] uppercase">
                Selected record
              </p>
              <p className="text-sm font-medium text-foreground">{pendingAction.user.name}</p>
              <p className="text-sm text-muted-foreground">{pendingAction.user.email}</p>
            </div>
          ) : null
        }
      />
    </>
  );
}
