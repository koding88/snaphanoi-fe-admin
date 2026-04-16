"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { AdminPageContainer } from "@/components/admin/admin-page-container";
import { AdminSurface } from "@/components/admin/admin-surface";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { LoadingState } from "@/components/shared/loading-state";
import { PageHeader } from "@/components/shared/page-header";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AppSelect } from "@/components/ui/select";
import { UsersTable } from "@/components/users/users-table";
import { deleteUser } from "@/features/users/api/delete-user";
import { listRoleOptions } from "@/features/users/api/list-role-options";
import { listUsers } from "@/features/users/api/list-users";
import { restoreUser } from "@/features/users/api/restore-user";
import type { RoleOption, UserListQuery, UserRecord, UsersListResult } from "@/features/users/types/users.types";
import { getFriendlyUsersError } from "@/features/users/utils/users-errors";
import { ROUTES } from "@/lib/constants/routes";
import { useDebouncedValue } from "@/lib/hooks/use-debounced-value";
import { faPlus, faRotateLeft } from "@/lib/icons/fa";
import { notifyError, notifySuccess } from "@/lib/toast";
import { cn } from "@/lib/utils";

const INITIAL_QUERY: UserListQuery = {
  page: 1,
  limit: 10,
  keyword: "",
  isActive: "all",
  roleId: "",
  includeDeleted: false,
};
const ALL_ROLES_VALUE = "__all__";

export function UsersListPage() {
  const t = useTranslations("users.list");
  const [query, setQuery] = useState<UserListQuery>(INITIAL_QUERY);
  const [keywordInput, setKeywordInput] = useState(INITIAL_QUERY.keyword ?? "");
  const [roles, setRoles] = useState<RoleOption[]>([]);
  const [result, setResult] = useState<UsersListResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isMutating, setIsMutating] = useState(false);
  const [isLoadingRoles, setIsLoadingRoles] = useState(true);
  const debouncedKeyword = useDebouncedValue(keywordInput, 300);
  const hasLoadedOnceRef = useRef(false);

  const loadData = useCallback(async (nextQuery: UserListQuery) => {
    const isInitialLoad = !hasLoadedOnceRef.current;
    if (isInitialLoad) {
      setIsLoading(true);
      setError(null);
    } else {
      setIsRefreshing(true);
    }

    try {
      const usersResult = await listUsers(nextQuery);
      setResult(usersResult);
      setError(null);
      hasLoadedOnceRef.current = true;
    } catch (loadError) {
      const friendlyError = getFriendlyUsersError(loadError);

      if (!hasLoadedOnceRef.current) {
        setError(friendlyError);
      } else {
        notifyError(friendlyError);
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void loadData(query);
  }, [loadData, query]);

  useEffect(() => {
    const loadRoles = async () => {
      setIsLoadingRoles(true);

      try {
        const rolesResult = await listRoleOptions();
        setRoles(rolesResult.items);
      } catch (loadError) {
        notifyError(getFriendlyUsersError(loadError));
      } finally {
        setIsLoadingRoles(false);
      }
    };

    void loadRoles();
  }, []);

  useEffect(() => {
    setQuery((current) => {
      if ((current.keyword ?? "") === debouncedKeyword) {
        return current;
      }

      return {
        ...current,
        page: 1,
        keyword: debouncedKeyword,
      };
    });
  }, [debouncedKeyword]);

  async function handleDelete(user: UserRecord) {
    setIsMutating(true);
    try {
      const response = await deleteUser(user.id);
      notifySuccess(response.message ?? response.data.message, t("toasts.archived"));
      await loadData(query);
    } catch (actionError) {
      notifyError(getFriendlyUsersError(actionError));
      throw actionError;
    } finally {
      setIsMutating(false);
    }
  }

  async function handleRestore(user: UserRecord) {
    setIsMutating(true);
    try {
      const response = await restoreUser(user.id);
      notifySuccess(response.message, t("toasts.restored"));
      await loadData(query);
    } catch (actionError) {
      notifyError(getFriendlyUsersError(actionError));
      throw actionError;
    } finally {
      setIsMutating(false);
    }
  }

  return (
    <AdminPageContainer tone="hero" className="space-y-6 pb-8">
      <PageHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("description")}
        meta={
          <>
            <span className="rounded-full border border-border/80 bg-white/70 px-3 py-1 text-[11px] font-semibold tracking-[0.16em] text-[--color-brand-muted] uppercase">
              {t("meta.adminOnly")}
            </span>
          </>
        }
        actions={
          <Link
            href={ROUTES.admin.users.create}
            className={cn(buttonVariants(), "rounded-full px-4")}
          >
            <FontAwesomeIcon icon={faPlus} />
            {t("actions.addUser")}
          </Link>
        }
      />
      <AdminSurface className="p-5 md:p-6">
        <div className="mb-3 flex flex-wrap gap-2">
          <span className="rounded-full border border-border/80 bg-white/70 px-3 py-1 text-[10px] font-semibold tracking-[0.18em] text-[--color-brand-muted] uppercase">
            {t("filters.quick")}
          </span>
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          <label className="space-y-1.5 xl:col-span-2">
            <span className="text-sm font-medium text-foreground">{t("filters.searchLabel")}</span>
            <Input
              value={keywordInput}
              onChange={(event) => setKeywordInput(event.target.value)}
              placeholder={t("filters.searchPlaceholder")}
            />
          </label>
          <label className="space-y-1.5">
            <span className="text-sm font-medium text-foreground">{t("filters.status")}</span>
            <AppSelect
              value={String(query.isActive)}
              onChange={(statusValue) =>
                setQuery((current) => ({
                  ...current,
                  page: 1,
                  isActive:
                    statusValue === "all" ? "all" : statusValue === "true",
                }))
              }
              options={[
                { value: "all", label: t("filters.statusAll") },
                { value: "true", label: t("filters.statusActive") },
                { value: "false", label: t("filters.statusInactive") },
              ]}
            />
          </label>
          <label className="space-y-1.5">
            <span className="text-sm font-medium text-foreground">{t("filters.role")}</span>
            <AppSelect
              value={query.roleId ? query.roleId : ALL_ROLES_VALUE}
              disabled={isLoadingRoles}
              onChange={(roleId) =>
                setQuery((current) => ({
                  ...current,
                  page: 1,
                  roleId: roleId === ALL_ROLES_VALUE ? "" : roleId,
                }))
              }
              options={[
                { value: ALL_ROLES_VALUE, label: t("filters.roleAll"), description: t("filters.roleAllDescription") },
                ...roles.map((role) => ({
                  value: role.id,
                  label: role.name,
                  description: role.isSystem ? t("filters.systemRole") : t("filters.customRole"),
                })),
              ]}
            />
          </label>
          <label className="space-y-1.5">
            <span className="text-sm font-medium text-foreground">{t("filters.deleted")}</span>
            <AppSelect
              value={String(Boolean(query.includeDeleted))}
              onChange={(includeDeleted) =>
                setQuery((current) => ({
                  ...current,
                  page: 1,
                  includeDeleted: includeDeleted === "true",
                }))
              }
              options={[
                { value: "false", label: t("filters.hideArchived") },
                { value: "true", label: t("filters.showArchived") },
              ]}
            />
          </label>
        </div>
      </AdminSurface>
      {isLoading && !result ? (
        <LoadingState
          title={t("loading.title")}
          description={t("loading.description")}
        />
      ) : error ? (
        <ErrorState
          title={t("errors.loadTitle")}
          description={error}
          action={
            <button
              type="button"
              onClick={() => void loadData(query)}
              className={cn(buttonVariants({ variant: "outline" }), "rounded-full px-5")}
            >
              <FontAwesomeIcon icon={faRotateLeft} />
              {t("actions.retry")}
            </button>
          }
        />
      ) : result && result.items.length > 0 ? (
        <>
          <UsersTable users={result.items} isBusy={isMutating || isRefreshing} onDelete={handleDelete} onRestore={handleRestore} />
          <AdminSurface className="p-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <p className="text-xs text-muted-foreground">
                {t("pagination.summary", {
                  page: result.meta.page,
                  totalPages: result.meta.totalPages,
                  total: result.meta.total,
                })}
                {isRefreshing ? ` ${t("pagination.updating")}` : ""}
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={query.page <= 1}
                  onClick={() => setQuery((current) => ({ ...current, page: current.page - 1 }))}
                  className={cn(buttonVariants({ variant: "outline" }), "rounded-full px-4 disabled:pointer-events-none disabled:opacity-50")}
                >
                  {t("actions.previous")}
                </button>
                <button
                  type="button"
                  disabled={query.page >= result.meta.totalPages}
                  onClick={() => setQuery((current) => ({ ...current, page: current.page + 1 }))}
                  className={cn(buttonVariants({ variant: "outline" }), "rounded-full px-4 disabled:pointer-events-none disabled:opacity-50")}
                >
                  {t("actions.next")}
                </button>
              </div>
            </div>
          </AdminSurface>
        </>
      ) : (
        <EmptyState
          eyebrow={t("eyebrow")}
          title={t("empty.title")}
          description={t("empty.description")}
          action={
            <Link
              href={ROUTES.admin.users.create}
              className={cn(buttonVariants(), "rounded-full px-5")}
            >
              <FontAwesomeIcon icon={faPlus} />
              {t("empty.createFirst")}
            </Link>
          }
        />
      )}
    </AdminPageContainer>
  );
}
