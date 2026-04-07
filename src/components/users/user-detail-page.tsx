"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { AdminPageContainer } from "@/components/admin/admin-page-container";
import { AdminSurface } from "@/components/admin/admin-surface";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { ErrorState } from "@/components/shared/error-state";
import { LoadingState } from "@/components/shared/loading-state";
import { PageHeader } from "@/components/shared/page-header";
import { UserDetailCard } from "@/components/users/user-detail-card";
import { deleteUser } from "@/features/users/api/delete-user";
import { getUser } from "@/features/users/api/get-user";
import { restoreUser } from "@/features/users/api/restore-user";
import type { UserRecord } from "@/features/users/types/users.types";
import { getFriendlyUsersError } from "@/features/users/utils/users-errors";
import { ROUTES } from "@/lib/constants/routes";
import { faRotateLeft, faTrashCan, faUserPen } from "@/lib/icons/fa";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function UserDetailPage({ id }: { id: string }) {
  const router = useRouter();
  const [user, setUser] = useState<UserRecord | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogMode, setDialogMode] = useState<"delete" | "restore" | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function bootstrap() {
      setIsLoading(true);
      try {
        const userResult = await getUser(id);
        setUser(userResult);
      } catch (loadError) {
        setError(getFriendlyUsersError(loadError));
      } finally {
        setIsLoading(false);
      }
    }

    void bootstrap();
  }, [id]);

  async function handleAction() {
    if (!user || !dialogMode) {
      return;
    }

    setIsSubmitting(true);
    try {
      if (dialogMode === "delete") {
        await deleteUser(user.id);
        router.replace(ROUTES.admin.users.root);
        return;
      }

      const nextUser = await restoreUser(user.id);
      setUser(nextUser);
      setDialogMode(null);
    } catch (actionError) {
      setError(getFriendlyUsersError(actionError));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AdminPageContainer tone="hero" className="space-y-8 pb-10">
      <PageHeader
        eyebrow="User detail"
        title="Inspect an individual user record."
        description="This surface respects the backend self-or-admin detail semantics. In the admin area it is used as the main detail view for user management."
        actions={
          user ? (
            <div className="flex flex-wrap gap-2">
              <Link
                href={ROUTES.admin.users.edit(user.id)}
                className={cn(buttonVariants({ variant: "outline" }), "rounded-full px-5")}
              >
                <FontAwesomeIcon icon={faUserPen} />
                Edit
              </Link>
              {user.deletedAt ? (
                <button
                  type="button"
                  onClick={() => setDialogMode("restore")}
                  className={cn(buttonVariants(), "rounded-full px-5")}
                >
                  <FontAwesomeIcon icon={faRotateLeft} />
                  Restore
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setDialogMode("delete")}
                  className={cn(buttonVariants({ variant: "destructive" }), "rounded-full px-5")}
                >
                  <FontAwesomeIcon icon={faTrashCan} />
                  Delete
                </button>
              )}
            </div>
          ) : null
        }
      />
      {isLoading ? (
        <LoadingState title="Loading user" description="Fetching the selected user record." />
      ) : error || !user ? (
        <ErrorState title="Unable to load this user" description={error ?? "User not found."} />
      ) : (
        <>
          <UserDetailCard user={user} />
          <AdminSurface className="p-6 md:p-8">
            <p className="text-xs font-semibold tracking-[0.22em] text-[--color-brand-muted] uppercase">
              Admin actions
            </p>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              Soft delete and restore actions are available here because the backend exposes them as
              separate admin operations.
            </p>
          </AdminSurface>
        </>
      )}
      <ConfirmDialog
        open={Boolean(dialogMode && user)}
        title={
          dialogMode === "delete"
            ? `Delete ${user?.name}?`
            : `Restore ${user?.name}?`
        }
        description={
          dialogMode === "delete"
            ? "This performs the backend soft-delete action. The user can be restored later."
            : "This restores the selected user record from soft-deleted state."
        }
        confirmLabel={dialogMode === "delete" ? "Delete user" : "Restore user"}
        confirmVariant={dialogMode === "delete" ? "destructive" : "default"}
        isSubmitting={isSubmitting}
        onCancel={() => setDialogMode(null)}
        onConfirm={handleAction}
      />
    </AdminPageContainer>
  );
}
