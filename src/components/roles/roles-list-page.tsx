"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { AdminPageContainer } from "@/components/admin/admin-page-container";
import { AdminSurface } from "@/components/admin/admin-surface";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { LoadingState } from "@/components/shared/loading-state";
import { PageHeader } from "@/components/shared/page-header";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RolesTable } from "@/components/roles/roles-table";
import { deleteRole } from "@/features/roles/api/delete-role";
import { listRoles } from "@/features/roles/api/list-roles";
import type { RoleListQuery, RoleRecord, RolesListResult } from "@/features/roles/types/roles.types";
import { getFriendlyRolesError } from "@/features/roles/utils/roles-errors";
import { ROUTES } from "@/lib/constants/routes";
import { faPlus, faRotateLeft } from "@/lib/icons/fa";
import { cn } from "@/lib/utils";

const INITIAL_QUERY: RoleListQuery = {
  page: 1,
  limit: 10,
  keyword: "",
  isSystem: "all",
};

export function RolesListPage() {
  const [query, setQuery] = useState<RoleListQuery>(INITIAL_QUERY);
  const [result, setResult] = useState<RolesListResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);

  const loadData = useCallback(async (nextQuery: RoleListQuery) => {
    setIsLoading(true);
    setError(null);

    try {
      const rolesResult = await listRoles(nextQuery);
      setResult(rolesResult);
    } catch (loadError) {
      setError(getFriendlyRolesError(loadError));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData(query);
  }, [loadData, query]);

  async function handleDelete(role: RoleRecord) {
    setIsMutating(true);
    try {
      await deleteRole(role.id);
      await loadData(query);
    } catch (actionError) {
      setError(getFriendlyRolesError(actionError));
      throw actionError;
    } finally {
      setIsMutating(false);
    }
  }

  return (
    <AdminPageContainer tone="hero" className="space-y-8 pb-10">
      <PageHeader
        eyebrow="Roles"
        title="Manage role definitions."
        description="This page maps directly to the backend role endpoints: list, create, update, delete, and inspect users assigned to a role."
        meta={
          <span className="rounded-full border border-border/80 bg-white/70 px-3 py-1.5 text-xs font-semibold tracking-[0.16em] text-[--color-brand-muted] uppercase">
            Admin only
          </span>
        }
        actions={
          <Link
            href={ROUTES.admin.roles.create}
            className={cn(buttonVariants(), "rounded-full px-5")}
          >
            <FontAwesomeIcon icon={faPlus} />
            Create role
          </Link>
        }
      />
      <AdminSurface className="p-6 md:p-8">
        <div className="grid gap-4 md:grid-cols-3">
          <label className="space-y-2 md:col-span-2">
            <span className="text-sm font-medium text-foreground">Search keyword</span>
            <Input
              value={query.keyword ?? ""}
              onChange={(event) =>
                setQuery((current) => ({
                  ...current,
                  page: 1,
                  keyword: event.target.value,
                }))
              }
              placeholder="Search role name"
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-foreground">Role type</span>
            <select
              value={String(query.isSystem)}
              onChange={(event) =>
                setQuery((current) => ({
                  ...current,
                  page: 1,
                  isSystem:
                    event.target.value === "all" ? "all" : event.target.value === "true",
                }))
              }
              className="flex h-12 w-full rounded-2xl border border-border/80 bg-background/92 px-4 text-sm text-foreground outline-none transition-colors focus:border-[--color-brand]/40 focus:ring-3 focus:ring-[--color-brand]/12"
            >
              <option value="all">All</option>
              <option value="false">Custom</option>
              <option value="true">System</option>
            </select>
          </label>
        </div>
      </AdminSurface>
      {isLoading ? (
        <LoadingState
          title="Loading roles"
          description="Fetching role definitions and their usage counts from the backend."
        />
      ) : error ? (
        <ErrorState
          title="Unable to load roles"
          description={error}
          action={
            <button
              type="button"
              onClick={() => void loadData(query)}
              className={cn(buttonVariants({ variant: "outline" }), "rounded-full px-5")}
            >
              <FontAwesomeIcon icon={faRotateLeft} />
              Retry
            </button>
          }
        />
      ) : result && result.items.length > 0 ? (
        <>
          <RolesTable roles={result.items} onDelete={handleDelete} isBusy={isMutating} />
          <AdminSurface className="p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <p className="text-sm text-muted-foreground">
                Page {result.meta.page} of {result.meta.totalPages}. Total roles: {result.meta.total}.
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
                  Previous
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
                  Next
                </button>
              </div>
            </div>
          </AdminSurface>
        </>
      ) : (
        <EmptyState
          eyebrow="Roles"
          title="No roles matched the current filters."
          description="Try adjusting the keyword or system-role filter. Only backend-supported role filters are used here."
          action={
            <Link
              href={ROUTES.admin.roles.create}
              className={cn(buttonVariants(), "rounded-full px-5")}
            >
              <FontAwesomeIcon icon={faPlus} />
              Create first role
            </Link>
          }
        />
      )}
    </AdminPageContainer>
  );
}
