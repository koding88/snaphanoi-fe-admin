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
import { RolesTable } from "@/components/roles/roles-table";
import { deleteRole } from "@/features/roles/api/delete-role";
import { listRoles } from "@/features/roles/api/list-roles";
import type { RoleListQuery, RoleRecord, RolesListResult } from "@/features/roles/types/roles.types";
import { getFriendlyRolesError } from "@/features/roles/utils/roles-errors";
import { ROUTES } from "@/lib/constants/routes";
import { useDebouncedValue } from "@/lib/hooks/use-debounced-value";
import { faPlus, faRotateLeft } from "@/lib/icons/fa";
import { notifyError, notifySuccess } from "@/lib/toast";
import { cn } from "@/lib/utils";

const INITIAL_QUERY: RoleListQuery = {
  page: 1,
  limit: 10,
  keyword: "",
  isSystem: "all",
};

// Temporarily hidden until permission-based access is implemented.
// Backend still uses hard-coded role-based access, so create role UI affordances are disabled for now.
const SHOW_ROLE_CREATE_ACTIONS = false;

export function RolesListPage() {
  const t = useTranslations("roles.list");
  const [query, setQuery] = useState<RoleListQuery>(INITIAL_QUERY);
  const [keywordInput, setKeywordInput] = useState(INITIAL_QUERY.keyword ?? "");
  const [result, setResult] = useState<RolesListResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isMutating, setIsMutating] = useState(false);
  const debouncedKeyword = useDebouncedValue(keywordInput, 300);
  const hasLoadedOnceRef = useRef(false);

  const loadData = useCallback(async (nextQuery: RoleListQuery) => {
    const isInitialLoad = !hasLoadedOnceRef.current;
    if (isInitialLoad) {
      setIsLoading(true);
      setError(null);
    } else {
      setIsRefreshing(true);
    }

    try {
      const rolesResult = await listRoles(nextQuery);
      setResult(rolesResult);
      setError(null);
      hasLoadedOnceRef.current = true;
    } catch (loadError) {
      const friendlyError = getFriendlyRolesError(loadError);

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

  async function handleDelete(role: RoleRecord) {
    setIsMutating(true);
    try {
      const response = await deleteRole(role.id);
      notifySuccess(response.message ?? response.data.message, t("toasts.deleted"));
      await loadData(query);
    } catch (actionError) {
      notifyError(getFriendlyRolesError(actionError));
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
          <span className="rounded-full border border-border/80 bg-white/70 px-3 py-1 text-[11px] font-semibold tracking-[0.16em] text-[--color-brand-muted] uppercase">
            {t("meta.adminOnly")}
          </span>
        }
        actions={
          SHOW_ROLE_CREATE_ACTIONS ? (
            <Link
              href={ROUTES.admin.roles.create}
              className={cn(buttonVariants(), "rounded-full px-4")}
            >
              <FontAwesomeIcon icon={faPlus} />
              {t("actions.createRole")}
            </Link>
          ) : undefined
        }
      />
      <AdminSurface className="p-5 md:p-6">
        <div className="mb-3 flex flex-wrap gap-2">
          <span className="rounded-full border border-border/80 bg-white/70 px-3 py-1 text-[10px] font-semibold tracking-[0.18em] text-[--color-brand-muted] uppercase">
            {t("filters.quick")}
          </span>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          <label className="space-y-1.5 md:col-span-2">
            <span className="text-sm font-medium text-foreground">{t("filters.searchLabel")}</span>
            <Input
              value={keywordInput}
              onChange={(event) => setKeywordInput(event.target.value)}
              placeholder={t("filters.searchPlaceholder")}
            />
          </label>
          <label className="space-y-1.5">
            <span className="text-sm font-medium text-foreground">{t("filters.roleType")}</span>
            <AppSelect
              value={String(query.isSystem)}
              onChange={(roleType) =>
                setQuery((current) => ({
                  ...current,
                  page: 1,
                  isSystem:
                    roleType === "all" ? "all" : roleType === "true",
                }))
              }
              options={[
                { value: "all", label: t("filters.typeAll") },
                { value: "false", label: t("filters.typeCustom") },
                { value: "true", label: t("filters.typeSystem") },
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
          title={t("errorTitle")}
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
          <RolesTable roles={result.items} onDelete={handleDelete} isBusy={isMutating || isRefreshing} />
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
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "rounded-full px-4 disabled:pointer-events-none disabled:opacity-50",
                  )}
                >
                  {t("actions.previous")}
                </button>
                <button
                  type="button"
                  disabled={query.page >= result.meta.totalPages}
                  onClick={() => setQuery((current) => ({ ...current, page: current.page + 1 }))}
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "rounded-full px-4 disabled:pointer-events-none disabled:opacity-50",
                  )}
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
            SHOW_ROLE_CREATE_ACTIONS ? (
              <Link
                href={ROUTES.admin.roles.create}
                className={cn(buttonVariants(), "rounded-full px-5")}
              >
                <FontAwesomeIcon icon={faPlus} />
                {t("empty.createFirst")}
              </Link>
            ) : undefined
          }
        />
      )}
    </AdminPageContainer>
  );
}
