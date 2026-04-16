"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { AdminPageContainer } from "@/components/admin/admin-page-container";
import { AdminSurface } from "@/components/admin/admin-surface";
import { BackButton } from "@/components/shared/back-button";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { LoadingState } from "@/components/shared/loading-state";
import { PageHeader } from "@/components/shared/page-header";
import { buttonVariants } from "@/components/ui/button";
import { AppSelect } from "@/components/ui/select";
import { RoleDetailCard } from "@/components/roles/role-detail-card";
import { RoleUsersTable } from "@/components/roles/role-users-table";
import { deleteRole } from "@/features/roles/api/delete-role";
import { getRole } from "@/features/roles/api/get-role";
import { listRoleUsers } from "@/features/roles/api/list-role-users";
import type {
  RoleRecord,
  RoleUsersQuery,
  RoleUsersResult,
} from "@/features/roles/types/roles.types";
import { getFriendlyRolesError } from "@/features/roles/utils/roles-errors";
import { ROUTES } from "@/lib/constants/routes";
import { faTrashCan, faUserPen } from "@/lib/icons/fa";
import { consumeNavigationToast, notifyError, notifySuccess } from "@/lib/toast";
import { cn } from "@/lib/utils";

const INITIAL_USERS_QUERY: RoleUsersQuery = {
  status: "all",
  page: 1,
  limit: 10,
};

// Temporarily hidden until permission-based access is implemented.
// Backend still uses hard-coded role-based access, so delete role UI affordances are disabled for now.
const SHOW_ROLE_DELETE_ACTIONS = false;

export function RoleDetailPage({ id }: { id: string }) {
  const t = useTranslations("roles.detail");
  const router = useRouter();
  const [role, setRole] = useState<RoleRecord | null>(null);
  const [roleUsers, setRoleUsers] = useState<RoleUsersResult | null>(null);
  const [usersQuery, setUsersQuery] = useState<RoleUsersQuery>(INITIAL_USERS_QUERY);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    consumeNavigationToast();
  }, []);

  const loadRoleData = useCallback(async (nextUsersQuery: RoleUsersQuery) => {
    setIsLoading(true);
    setError(null);

    try {
      const [roleResult, roleUsersResult] = await Promise.all([
        getRole(id),
        listRoleUsers(id, nextUsersQuery),
      ]);
      setRole(roleResult);
      setRoleUsers(roleUsersResult);
    } catch (loadError) {
      setError(getFriendlyRolesError(loadError));
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void loadRoleData(usersQuery);
  }, [loadRoleData, usersQuery]);

  async function handleDelete() {
    if (!role) {
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await deleteRole(role.id);
      notifySuccess(response.message ?? response.data.message, t("toasts.deleted"));
      router.replace(ROUTES.admin.roles.root);
    } catch (actionError) {
      notifyError(getFriendlyRolesError(actionError));
    } finally {
      setIsSubmitting(false);
      setDialogOpen(false);
    }
  }

  return (
    <AdminPageContainer tone="hero" className="space-y-8 pb-10">
      <PageHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("description")}
        meta={<BackButton href={ROUTES.admin.roles.root} />}
        actions={
          role ? (
            <div className="flex flex-wrap gap-2">
              <Link
                href={ROUTES.admin.roles.edit(role.id)}
                className={cn(buttonVariants({ variant: "outline" }), "rounded-full px-5")}
              >
                <FontAwesomeIcon icon={faUserPen} />
                {t("actions.edit")}
              </Link>
              {SHOW_ROLE_DELETE_ACTIONS ? (
                <button
                  type="button"
                  onClick={() => setDialogOpen(true)}
                  className={cn(buttonVariants({ variant: "destructive" }), "rounded-full px-5")}
                >
                  <FontAwesomeIcon icon={faTrashCan} />
                  {t("actions.delete")}
                </button>
              ) : null}
            </div>
          ) : null
        }
      />
      {isLoading ? (
        <LoadingState
          title={t("loading.title")}
          description={t("loading.description")}
        />
      ) : error || !role ? (
        <ErrorState title={t("errorTitle")} description={error ?? t("notFound")} />
      ) : (
        <>
          <RoleDetailCard role={role} />
          <AdminSurface className="p-6 md:p-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="space-y-2">
                <p className="text-xs font-semibold tracking-[0.22em] text-[--color-brand-muted] uppercase">
                  {t("users.eyebrow")}
                </p>
                <h3 className="font-heading text-3xl tracking-[0.04em] text-foreground">
                  {t("users.title")}
                </h3>
                <p className="text-sm leading-7 text-muted-foreground">
                  {t("users.description")}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <AppSelect
                  value={usersQuery.status}
                  onChange={(status) =>
                    setUsersQuery((current) => ({
                      ...current,
                      page: 1,
                      status: status as RoleUsersQuery["status"],
                    }))
                  }
                  className="min-w-52"
                  options={[
                    { value: "all", label: t("users.filters.all") },
                    { value: "active", label: t("users.filters.active") },
                    { value: "inactive", label: t("users.filters.inactive") },
                    { value: "deleted", label: t("users.filters.deleted") },
                  ]}
                />
              </div>
            </div>
            <div className="mt-6 space-y-4">
              {roleUsers && roleUsers.items.length > 0 ? (
                <>
                  <RoleUsersTable users={roleUsers.items} />
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <p className="text-sm text-muted-foreground">
                      {t("users.pagination", {
                        page: roleUsers.meta.page,
                        totalPages: roleUsers.meta.totalPages,
                        total: roleUsers.meta.total,
                      })}
                    </p>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        disabled={usersQuery.page <= 1}
                        onClick={() =>
                          setUsersQuery((current) => ({ ...current, page: current.page - 1 }))
                        }
                        className={cn(
                          buttonVariants({ variant: "outline" }),
                          "rounded-full px-4 disabled:pointer-events-none disabled:opacity-50",
                        )}
                      >
                        {t("actions.previous")}
                      </button>
                      <button
                        type="button"
                        disabled={usersQuery.page >= roleUsers.meta.totalPages}
                        onClick={() =>
                          setUsersQuery((current) => ({ ...current, page: current.page + 1 }))
                        }
                        className={cn(
                          buttonVariants({ variant: "outline" }),
                          "rounded-full px-4 disabled:pointer-events-none disabled:opacity-50",
                        )}
                      >
                        {t("actions.next")}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <EmptyState
                  eyebrow={t("users.eyebrow")}
                  title={t("users.emptyTitle")}
                  description={t("users.emptyDescription")}
                />
              )}
            </div>
          </AdminSurface>
        </>
      )}
      <ConfirmDialog
        open={SHOW_ROLE_DELETE_ACTIONS && dialogOpen}
        title={t("dialogs.deleteTitle", { name: role?.name ?? "" })}
        description={t("dialogs.deleteDescription")}
        confirmLabel={t("dialogs.deleteConfirm")}
        confirmVariant="destructive"
        isSubmitting={isSubmitting}
        onCancel={() => setDialogOpen(false)}
        onConfirm={handleDelete}
        extra={
          role ? (
            <div className="space-y-1">
              <p className="text-xs font-semibold tracking-[0.16em] text-[--color-brand-muted] uppercase">
                {t("dialogs.roleInFocus")}
              </p>
              <p className="text-sm font-medium text-foreground">{role.name}</p>
              <p className="text-sm text-muted-foreground">{role.key}</p>
            </div>
          ) : null
        }
      />
    </AdminPageContainer>
  );
}
