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
import { AppSelect } from "@/components/ui/select";
import { UsersTable } from "@/components/users/users-table";
import { deleteUser } from "@/features/users/api/delete-user";
import { listRoleOptions } from "@/features/users/api/list-role-options";
import { listUsers } from "@/features/users/api/list-users";
import { restoreUser } from "@/features/users/api/restore-user";
import type { RoleOption, UserListQuery, UserRecord, UsersListResult } from "@/features/users/types/users.types";
import { getFriendlyUsersError } from "@/features/users/utils/users-errors";
import { ROUTES } from "@/lib/constants/routes";
import { faPlus, faRotateLeft } from "@/lib/icons/fa";
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
  const [query, setQuery] = useState<UserListQuery>(INITIAL_QUERY);
  const [roles, setRoles] = useState<RoleOption[]>([]);
  const [result, setResult] = useState<UsersListResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);

  const loadData = useCallback(async (nextQuery: UserListQuery) => {
    setIsLoading(true);
    setError(null);

    try {
      const [usersResult, rolesResult] = await Promise.all([
        listUsers(nextQuery),
        listRoleOptions(),
      ]);

      setResult(usersResult);
      setRoles(rolesResult.items);
    } catch (loadError) {
      setError(getFriendlyUsersError(loadError));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData(query);
  }, [loadData, query]);

  async function handleDelete(user: UserRecord) {
    setIsMutating(true);
    try {
      await deleteUser(user.id);
      await loadData(query);
    } catch (actionError) {
      setError(getFriendlyUsersError(actionError));
      throw actionError;
    } finally {
      setIsMutating(false);
    }
  }

  async function handleRestore(user: UserRecord) {
    setIsMutating(true);
    try {
      await restoreUser(user.id);
      await loadData(query);
    } catch (actionError) {
      setError(getFriendlyUsersError(actionError));
      throw actionError;
    } finally {
      setIsMutating(false);
    }
  }

  return (
    <AdminPageContainer tone="hero" className="space-y-8 pb-10">
      <PageHeader
        eyebrow="Users"
        title="Manage user accounts."
        description="Create, update, archive, and restore team access while keeping self-service account settings in a separate place."
        meta={
          <>
            <span className="rounded-full border border-border/80 bg-white/70 px-3 py-1.5 text-xs font-semibold tracking-[0.16em] text-[--color-brand-muted] uppercase">
              Admin only
            </span>
          </>
        }
        actions={
          <Link
            href={ROUTES.admin.users.create}
            className={cn(buttonVariants(), "rounded-full px-5")}
          >
            <FontAwesomeIcon icon={faPlus} />
            Add user
          </Link>
        }
      />
      <AdminSurface className="p-6 md:p-8">
        <div className="mb-5 flex flex-wrap gap-2">
          <span className="rounded-full border border-border/80 bg-white/70 px-3 py-1.5 text-[11px] font-semibold tracking-[0.18em] text-[--color-brand-muted] uppercase">
            Search and account states
          </span>
          <span className="rounded-full border border-border/80 bg-white/70 px-3 py-1.5 text-[11px] font-semibold tracking-[0.18em] text-[--color-brand-muted] uppercase">
            Quick filters
          </span>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <label className="space-y-2 xl:col-span-2">
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
              placeholder="Search by name or email"
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-foreground">Status</span>
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
                { value: "all", label: "All users" },
                { value: "true", label: "Active only" },
                { value: "false", label: "Inactive only" },
              ]}
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-foreground">Role</span>
            <AppSelect
              value={query.roleId ? query.roleId : ALL_ROLES_VALUE}
              onChange={(roleId) =>
                setQuery((current) => ({
                  ...current,
                  page: 1,
                  roleId: roleId === ALL_ROLES_VALUE ? "" : roleId,
                }))
              }
              options={[
                { value: ALL_ROLES_VALUE, label: "All roles", description: "No role filter" },
                ...roles.map((role) => ({
                  value: role.id,
                  label: role.name,
                  description: role.isSystem ? "System role" : "Custom role",
                })),
              ]}
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-foreground">Deleted records</span>
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
                { value: "false", label: "Hide archived" },
                { value: "true", label: "Show archived too" },
              ]}
            />
          </label>
        </div>
      </AdminSurface>
      {isLoading ? (
        <LoadingState
          title="Loading users"
          description="Preparing the latest user list and filter options."
        />
      ) : error ? (
        <ErrorState
          title="Unable to load users"
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
          <UsersTable users={result.items} isBusy={isMutating} onDelete={handleDelete} onRestore={handleRestore} />
          <AdminSurface className="p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <p className="text-sm text-muted-foreground">
                Page {result.meta.page} of {result.meta.totalPages}. Total users: {result.meta.total}.
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={query.page <= 1}
                  onClick={() => setQuery((current) => ({ ...current, page: current.page - 1 }))}
                  className={cn(buttonVariants({ variant: "outline" }), "rounded-full px-4 disabled:pointer-events-none disabled:opacity-50")}
                >
                  Previous
                </button>
                <button
                  type="button"
                  disabled={query.page >= result.meta.totalPages}
                  onClick={() => setQuery((current) => ({ ...current, page: current.page + 1 }))}
                  className={cn(buttonVariants({ variant: "outline" }), "rounded-full px-4 disabled:pointer-events-none disabled:opacity-50")}
                >
                  Next
                </button>
              </div>
            </div>
          </AdminSurface>
        </>
      ) : (
        <EmptyState
          eyebrow="Users"
          title="No users matched the current filters."
          description="Try a broader keyword or reset one of the filters."
          action={
            <Link
              href={ROUTES.admin.users.create}
              className={cn(buttonVariants(), "rounded-full px-5")}
            >
              <FontAwesomeIcon icon={faPlus} />
              Create first user
            </Link>
          }
        />
      )}
    </AdminPageContainer>
  );
}
