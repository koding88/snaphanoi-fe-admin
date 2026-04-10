"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type KeyboardEvent, type MouseEvent, useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { UserRoleBadge } from "@/components/users/user-role-badge";
import { UserStatusBadge } from "@/components/users/user-status-badge";
import { ROUTES } from "@/lib/constants/routes";
import { faRotateLeft, faTrashCan, faUserPen } from "@/lib/icons/fa";
import { cn } from "@/lib/utils";
import type { UserRecord } from "@/features/users/types/users.types";
import { formatCountryCode } from "@/features/users/utils/users-format";

type UsersTableProps = {
  users: UserRecord[];
  isBusy?: boolean;
  onDelete: (user: UserRecord) => Promise<void>;
  onRestore: (user: UserRecord) => Promise<void>;
};

export function UsersTable({ users, isBusy = false, onDelete, onRestore }: UsersTableProps) {
  const router = useRouter();
  const [pendingAction, setPendingAction] = useState<{
    type: "delete" | "restore";
    user: UserRecord;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleRowActionClick = (event: MouseEvent | KeyboardEvent) => {
    event.stopPropagation();
  };

  function navigateToUser(userId: string) {
    router.push(ROUTES.admin.users.detail(userId));
  }

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
          <table className="min-w-[760px] w-full table-fixed text-left">
            <thead className="border-b border-border/80 bg-white/55">
              <tr className="text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                <th className="w-[38%] px-5 py-4">User</th>
                <th className="w-[18%] px-5 py-4">Role</th>
                <th className="w-[16%] px-5 py-4">Country</th>
                <th className="w-[12%] px-5 py-4">Status</th>
                <th className="w-[16%] px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  role="link"
                  tabIndex={0}
                  onClick={() => navigateToUser(user.id)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      navigateToUser(user.id);
                    }
                  }}
                  className="cursor-pointer border-b border-border/60 transition-[background-color,box-shadow] hover:bg-white/60 focus-visible:bg-white/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-brand]/30 last:border-b-0"
                >
                  <td className="align-middle px-5 py-5">
                    <div className="space-y-1">
                      <p className="font-medium text-foreground">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </td>
                  <td className="align-middle px-5 py-5">
                    <UserRoleBadge roleName={user.roleName} />
                  </td>
                  <td className="align-middle px-5 py-5 text-sm text-muted-foreground">
                    {formatCountryCode(user.countryCode)}
                  </td>
                  <td className="align-middle px-5 py-5">
                    <UserStatusBadge isActive={user.isActive} deletedAt={user.deletedAt} />
                  </td>
                  <td className="align-middle px-5 py-5">
                    <div
                      className="flex flex-wrap justify-end gap-2"
                      onClick={handleRowActionClick}
                      onKeyDown={handleRowActionClick}
                    >
                      <Link
                        href={ROUTES.admin.users.edit(user.id)}
                        className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
                        onClick={handleRowActionClick}
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
                          onClick={(event) => {
                            handleRowActionClick(event);
                            setPendingAction({ type: "restore", user });
                          }}
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
                          onClick={(event) => {
                            handleRowActionClick(event);
                            setPendingAction({ type: "delete", user });
                          }}
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
            ? "This archives the account for now. It can still be restored later."
            : "This returns the archived account to the active roster."
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
