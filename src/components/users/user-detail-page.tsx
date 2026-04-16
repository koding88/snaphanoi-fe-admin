"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { AdminPageContainer } from "@/components/admin/admin-page-container";
import { AdminSurface } from "@/components/admin/admin-surface";
import { BackButton } from "@/components/shared/back-button";
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
import { consumeNavigationToast, notifyError, notifySuccess } from "@/lib/toast";
import { cn } from "@/lib/utils";

export function UserDetailPage({ id }: { id: string }) {
  const t = useTranslations("users.detail");
  const router = useRouter();
  const [user, setUser] = useState<UserRecord | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogMode, setDialogMode] = useState<"delete" | "restore" | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    consumeNavigationToast();
  }, []);

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
        const response = await deleteUser(user.id);
        notifySuccess(response.message ?? response.data.message, t("toasts.archived"));
        router.replace(ROUTES.admin.users.root);
        return;
      }

      const response = await restoreUser(user.id);
      setUser(response.data);
      notifySuccess(response.message, t("toasts.restored"));
      setDialogMode(null);
    } catch (actionError) {
      notifyError(getFriendlyUsersError(actionError));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AdminPageContainer tone="hero" className="space-y-8 pb-10">
      <PageHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("description")}
        meta={<BackButton href={ROUTES.admin.users.root} />}
        actions={
          user ? (
            <div className="flex flex-wrap gap-2">
              <Link
                href={ROUTES.admin.users.edit(user.id)}
                className={cn(buttonVariants({ variant: "outline" }), "rounded-full px-5")}
                >
                  <FontAwesomeIcon icon={faUserPen} />
                  {t("actions.edit")}
                </Link>
              {user.deletedAt ? (
                <button
                  type="button"
                  onClick={() => setDialogMode("restore")}
                  className={cn(buttonVariants(), "rounded-full px-5")}
                  >
                    <FontAwesomeIcon icon={faRotateLeft} />
                    {t("actions.restore")}
                  </button>
                ) : (
                <button
                  type="button"
                  onClick={() => setDialogMode("delete")}
                  className={cn(buttonVariants({ variant: "destructive" }), "rounded-full px-5")}
                  >
                    <FontAwesomeIcon icon={faTrashCan} />
                    {t("actions.delete")}
                  </button>
                )}
            </div>
          ) : null
        }
      />
      {isLoading ? (
        <LoadingState title={t("loading.title")} description={t("loading.description")} />
      ) : error || !user ? (
        <ErrorState title={t("errorTitle")} description={error ?? t("userNotFound")} />
      ) : (
        <>
          <UserDetailCard user={user} />
          <AdminSurface className="p-6 md:p-8">
            <p className="text-xs font-semibold tracking-[0.22em] text-[--color-brand-muted] uppercase">
              {t("adminActionsTitle")}
            </p>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              {t("adminActionsDescription")}
            </p>
          </AdminSurface>
        </>
      )}
      <ConfirmDialog
        open={Boolean(dialogMode && user)}
        title={
          dialogMode === "delete"
            ? t("dialogs.deleteTitle", { name: user?.name ?? "" })
            : t("dialogs.restoreTitle", { name: user?.name ?? "" })
        }
        description={
          dialogMode === "delete"
            ? t("dialogs.deleteDescription")
            : t("dialogs.restoreDescription")
        }
        confirmLabel={dialogMode === "delete" ? t("dialogs.deleteConfirm") : t("dialogs.restoreConfirm")}
        confirmVariant={dialogMode === "delete" ? "destructive" : "default"}
        isSubmitting={isSubmitting}
        onCancel={() => setDialogMode(null)}
        onConfirm={handleAction}
      />
    </AdminPageContainer>
  );
}
