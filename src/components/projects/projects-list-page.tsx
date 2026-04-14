"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
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
import { ProjectsTable } from "@/components/projects/projects-table";
import { deleteProject } from "@/features/projects/api/delete-project";
import { listProjects } from "@/features/projects/api/list-projects";
import { restoreProject } from "@/features/projects/api/restore-project";
import type { ProjectListQuery, ProjectRecord, ProjectsListResult } from "@/features/projects/types/projects.types";
import { getFriendlyProjectsError } from "@/features/projects/utils/projects-errors";
import { ROUTES } from "@/lib/constants/routes";
import { useDebouncedValue } from "@/lib/hooks/use-debounced-value";
import { faPlus, faRotateLeft } from "@/lib/icons/fa";
import { notifyError, notifySuccess } from "@/lib/toast";
import { cn } from "@/lib/utils";

const INITIAL_QUERY: ProjectListQuery = {
  page: 1,
  limit: 10,
  keyword: "",
  isActive: "all",
  isPublished: "all",
};

export function ProjectsListPage() {
  const [query, setQuery] = useState<ProjectListQuery>(INITIAL_QUERY);
  const [keywordInput, setKeywordInput] = useState(INITIAL_QUERY.keyword ?? "");
  const [result, setResult] = useState<ProjectsListResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isMutating, setIsMutating] = useState(false);
  const debouncedKeyword = useDebouncedValue(keywordInput, 300);
  const hasLoadedOnceRef = useRef(false);

  const loadData = useCallback(async (nextQuery: ProjectListQuery) => {
    const isInitialLoad = !hasLoadedOnceRef.current;
    if (isInitialLoad) {
      setIsLoading(true);
      setError(null);
    } else {
      setIsRefreshing(true);
    }

    try {
      const projectResult = await listProjects(nextQuery);
      setResult(projectResult);
      setError(null);
      hasLoadedOnceRef.current = true;
    } catch (loadError) {
      const friendlyError = getFriendlyProjectsError(loadError);

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

  async function handleDelete(project: ProjectRecord) {
    setIsMutating(true);

    try {
      const response = await deleteProject(project.id);
      notifySuccess(response.message ?? response.data.message, "Project archived.");
      await loadData(query);
    } catch (actionError) {
      notifyError(getFriendlyProjectsError(actionError));
      throw actionError;
    } finally {
      setIsMutating(false);
    }
  }

  async function handleRestore(project: ProjectRecord) {
    setIsMutating(true);

    try {
      const response = await restoreProject(project.id);
      notifySuccess(response.message, "Project restored successfully.");
      await loadData(query);
    } catch (actionError) {
      notifyError(getFriendlyProjectsError(actionError));
      throw actionError;
    } finally {
      setIsMutating(false);
    }
  }

  return (
    <AdminPageContainer tone="hero" className="space-y-6 pb-8">
      <PageHeader
        eyebrow="Projects"
        title="Manage project stories."
        description="Manage project stories, publication, and gallery linkage with faster operational scanning."
        meta={
          <span className="rounded-full border border-border/80 bg-white/70 px-3 py-1 text-[11px] font-semibold tracking-[0.16em] text-[--color-brand-muted] uppercase">
            Admin only
          </span>
        }
        actions={
          <Link
            href={ROUTES.admin.projects.create}
            className={cn(buttonVariants(), "rounded-full px-4")}
          >
            <FontAwesomeIcon icon={faPlus} />
            Create project
          </Link>
        }
      />
      <AdminSurface className="p-5 md:p-6">
        <div className="mb-3 flex flex-wrap gap-2">
          <span className="rounded-full border border-border/80 bg-white/70 px-3 py-1 text-[10px] font-semibold tracking-[0.18em] text-[--color-brand-muted] uppercase">
            Quick filters
          </span>
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          <label className="space-y-1.5 xl:col-span-2">
            <span className="text-sm font-medium text-foreground">Search keyword</span>
            <Input
              value={keywordInput}
              onChange={(event) => setKeywordInput(event.target.value)}
              placeholder="Search by project title"
            />
          </label>
          <label className="space-y-1.5">
            <span className="text-sm font-medium text-foreground">Status</span>
            <AppSelect
              value={String(query.isActive)}
              onChange={(statusValue) =>
                setQuery((current) => ({
                  ...current,
                  page: 1,
                  isActive: statusValue === "all" ? "all" : statusValue === "true",
                }))
              }
              options={[
                { value: "all", label: "All projects" },
                { value: "true", label: "Active only" },
                { value: "false", label: "Inactive only" },
              ]}
            />
          </label>
          <label className="space-y-1.5">
            <span className="text-sm font-medium text-foreground">Publication</span>
            <AppSelect
              value={String(query.isPublished)}
              onChange={(publishValue) =>
                setQuery((current) => ({
                  ...current,
                  page: 1,
                  isPublished: publishValue === "all" ? "all" : publishValue === "true",
                }))
              }
              options={[
                { value: "all", label: "All publish states" },
                { value: "true", label: "Published only" },
                { value: "false", label: "Draft only" },
              ]}
            />
          </label>
          <label className="space-y-1.5">
            <span className="text-sm font-medium text-foreground">Page size</span>
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
                { value: "10", label: "10 per page" },
                { value: "20", label: "20 per page" },
                { value: "50", label: "50 per page" },
              ]}
            />
          </label>
        </div>
      </AdminSurface>
      {isLoading && !result ? (
        <LoadingState
          title="Loading projects"
          description="Preparing the latest projects, filters, and content states."
        />
      ) : error ? (
        <ErrorState
          title="Unable to load projects"
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
          <ProjectsTable
            projects={result.items}
            isBusy={isMutating || isRefreshing}
            onDelete={handleDelete}
            onRestore={handleRestore}
          />
          <AdminSurface className="p-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <p className="text-xs text-muted-foreground">
                Page {result.meta.page} of {result.meta.totalPages}. Total projects: {result.meta.total}.
                {isRefreshing ? " Updating…" : ""}
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
          eyebrow="Projects"
          title="No projects matched the current filters."
          description="Try a broader keyword or reset one of the status filters."
          action={
            <Link
              href={ROUTES.admin.projects.create}
              className={cn(buttonVariants(), "rounded-full px-5")}
            >
              <FontAwesomeIcon icon={faPlus} />
              Create first project
            </Link>
          }
        />
      )}
    </AdminPageContainer>
  );
}
