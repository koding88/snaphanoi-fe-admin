"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { AdminPageContainer } from "@/components/admin/admin-page-container";
import { AdminSurface } from "@/components/admin/admin-surface";
import { PackagesTable } from "@/components/packages/packages-table";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { LoadingState } from "@/components/shared/loading-state";
import { PageHeader } from "@/components/shared/page-header";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AppSelect } from "@/components/ui/select";
import { deletePackage } from "@/features/packages/api/delete-package";
import { listPackages } from "@/features/packages/api/list-packages";
import { restorePackage } from "@/features/packages/api/restore-package";
import type {
  PackageListQuery,
  PackageRecord,
  PackagesListResult,
} from "@/features/packages/types/packages.types";
import { getFriendlyPackagesError } from "@/features/packages/utils/packages-errors";
import { ROUTES } from "@/lib/constants/routes";
import { useDebouncedValue } from "@/lib/hooks/use-debounced-value";
import { faPlus, faRotateLeft } from "@/lib/icons/fa";
import { notifyError, notifySuccess } from "@/lib/toast";
import { cn } from "@/lib/utils";

const INITIAL_QUERY: PackageListQuery = {
  page: 1,
  limit: 10,
  keyword: "",
  isActive: "all",
};

export function PackagesListPage() {
  const t = useTranslations("packages.list");
  const [query, setQuery] = useState<PackageListQuery>(INITIAL_QUERY);
  const [keywordInput, setKeywordInput] = useState(INITIAL_QUERY.keyword ?? "");
  const [result, setResult] = useState<PackagesListResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isMutating, setIsMutating] = useState(false);
  const debouncedKeyword = useDebouncedValue(keywordInput, 300);
  const hasLoadedOnceRef = useRef(false);

  const loadData = useCallback(async (nextQuery: PackageListQuery) => {
    const isInitialLoad = !hasLoadedOnceRef.current;

    if (isInitialLoad) {
      setIsLoading(true);
      setError(null);
    } else {
      setIsRefreshing(true);
    }

    try {
      const packageResult = await listPackages(nextQuery);
      setResult(packageResult);
      setError(null);
      hasLoadedOnceRef.current = true;
    } catch (loadError) {
      const friendlyError = getFriendlyPackagesError(loadError);

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

  async function handleDelete(pkg: PackageRecord) {
    setIsMutating(true);

    try {
      const response = await deletePackage(pkg.id);
      notifySuccess(response.message ?? response.data.message, t("toasts.archived"));
      await loadData(query);
    } catch (actionError) {
      notifyError(getFriendlyPackagesError(actionError));
      throw actionError;
    } finally {
      setIsMutating(false);
    }
  }

  async function handleRestore(pkg: PackageRecord) {
    setIsMutating(true);

    try {
      const response = await restorePackage(pkg.id);
      notifySuccess(response.message, t("toasts.restored"));
      await loadData(query);
    } catch (actionError) {
      notifyError(getFriendlyPackagesError(actionError));
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
          <Link
            href={ROUTES.admin.packages.create}
            className={cn(buttonVariants(), "rounded-full px-4")}
          >
            <FontAwesomeIcon icon={faPlus} />
            {t("actions.create")}
          </Link>
        }
      />

      <AdminSurface className="p-5 md:p-6">
        <div className="mb-3 flex flex-wrap gap-2">
          <span className="rounded-full border border-border/80 bg-white/70 px-3 py-1 text-[10px] font-semibold tracking-[0.18em] text-[--color-brand-muted] uppercase">
            {t("filters.quick")}
          </span>
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <label className="space-y-1.5 xl:col-span-2">
            <span className="text-sm font-medium text-foreground">
              {t("filters.searchLabel")}
            </span>
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
            <span className="text-sm font-medium text-foreground">
              {t("filters.pageSize")}
            </span>
            <AppSelect
              value={String(query.limit)}
              onChange={(limitValue) =>
                setQuery((current) => ({
                  ...current,
                  page: 1,
                  limit: Number(limitValue),
                }))
              }
              options={[
                { value: "10", label: t("filters.perPage", { value: 10 }) },
                { value: "20", label: t("filters.perPage", { value: 20 }) },
                { value: "50", label: t("filters.perPage", { value: 50 }) },
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
          title={t("errors.load")}
          description={error}
          action={
            <button
              type="button"
              onClick={() => void loadData(query)}
              className={cn(
                buttonVariants({ variant: "outline" }),
                "rounded-full px-5",
              )}
            >
              <FontAwesomeIcon icon={faRotateLeft} />
              {t("actions.retry")}
            </button>
          }
        />
      ) : result && result.items.length > 0 ? (
        <>
          <PackagesTable
            packages={result.items}
            isBusy={isMutating || isRefreshing}
            onDelete={handleDelete}
            onRestore={handleRestore}
          />
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
                  onClick={() =>
                    setQuery((current) => ({
                      ...current,
                      page: current.page - 1,
                    }))
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
                  disabled={query.page >= result.meta.totalPages}
                  onClick={() =>
                    setQuery((current) => ({
                      ...current,
                      page: current.page + 1,
                    }))
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
          </AdminSurface>
        </>
      ) : (
        <EmptyState
          eyebrow={t("eyebrow")}
          title={t("empty.title")}
          description={t("empty.description")}
          action={
            <Link
              href={ROUTES.admin.packages.create}
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
