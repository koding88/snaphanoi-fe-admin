"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { AdminPageContainer } from "@/components/admin/admin-page-container";
import { AdminSurface } from "@/components/admin/admin-surface";
import { GalleriesTable } from "@/components/galleries/galleries-table";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { LoadingState } from "@/components/shared/loading-state";
import { PageHeader } from "@/components/shared/page-header";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AppSelect } from "@/components/ui/select";
import { deleteGallery } from "@/features/galleries/api/delete-gallery";
import { listGalleries } from "@/features/galleries/api/list-galleries";
import { restoreGallery } from "@/features/galleries/api/restore-gallery";
import type { GalleriesListResult, GalleryListQuery, GalleryRecord } from "@/features/galleries/types/galleries.types";
import { getFriendlyGalleriesError } from "@/features/galleries/utils/galleries-errors";
import { ROUTES } from "@/lib/constants/routes";
import { faPlus, faRotateLeft } from "@/lib/icons/fa";
import { notifyError, notifySuccess } from "@/lib/toast";
import { cn } from "@/lib/utils";

const INITIAL_QUERY: GalleryListQuery = {
  page: 1,
  limit: 10,
  keyword: "",
  isActive: "all",
};

export function GalleriesListPage() {
  const [query, setQuery] = useState<GalleryListQuery>(INITIAL_QUERY);
  const [result, setResult] = useState<GalleriesListResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);

  const loadData = useCallback(async (nextQuery: GalleryListQuery) => {
    setIsLoading(true);
    setError(null);

    try {
      const galleriesResult = await listGalleries(nextQuery);
      setResult(galleriesResult);
    } catch (loadError) {
      setError(getFriendlyGalleriesError(loadError));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData(query);
  }, [loadData, query]);

  async function handleDelete(gallery: GalleryRecord) {
    setIsMutating(true);

    try {
      const response = await deleteGallery(gallery.id);
      notifySuccess(response.message ?? response.data.message, "Gallery archived.");
      await loadData(query);
    } catch (actionError) {
      notifyError(getFriendlyGalleriesError(actionError));
      throw actionError;
    } finally {
      setIsMutating(false);
    }
  }

  async function handleRestore(gallery: GalleryRecord) {
    setIsMutating(true);

    try {
      const response = await restoreGallery(gallery.id);
      notifySuccess(response.message, "Gallery restored successfully.");
      await loadData(query);
    } catch (actionError) {
      notifyError(getFriendlyGalleriesError(actionError));
      throw actionError;
    } finally {
      setIsMutating(false);
    }
  }

  return (
    <AdminPageContainer tone="hero" className="space-y-8 pb-10">
      <PageHeader
        eyebrow="Galleries"
        title="Manage gallery collections."
        description="Create, refine, archive, and restore multilingual gallery groups used by the studio."
        meta={
          <span className="rounded-full border border-border/80 bg-white/70 px-3 py-1.5 text-xs font-semibold tracking-[0.16em] text-[--color-brand-muted] uppercase">
            Admin only
          </span>
        }
        actions={
          <Link
            href={ROUTES.admin.galleries.create}
            className={cn(buttonVariants(), "rounded-full px-5")}
          >
            <FontAwesomeIcon icon={faPlus} />
            Create gallery
          </Link>
        }
      />
      <AdminSurface className="p-6 md:p-8">
        <div className="mb-5 flex flex-wrap gap-2">
          <span className="rounded-full border border-border/80 bg-white/70 px-3 py-1.5 text-[11px] font-semibold tracking-[0.18em] text-[--color-brand-muted] uppercase">
            Search and lifecycle
          </span>
          <span className="rounded-full border border-border/80 bg-white/70 px-3 py-1.5 text-[11px] font-semibold tracking-[0.18em] text-[--color-brand-muted] uppercase">
            Backend list filters
          </span>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
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
              placeholder="Search by gallery name"
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
                  isActive: statusValue === "all" ? "all" : statusValue === "true",
                }))
              }
              options={[
                { value: "all", label: "All galleries" },
                { value: "true", label: "Active only" },
                { value: "false", label: "Inactive only" },
              ]}
            />
          </label>
          <label className="space-y-2">
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
      {isLoading ? (
        <LoadingState
          title="Loading galleries"
          description="Preparing the latest gallery list and filter results."
        />
      ) : error ? (
        <ErrorState
          title="Unable to load galleries"
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
          <GalleriesTable
            galleries={result.items}
            isBusy={isMutating}
            onDelete={handleDelete}
            onRestore={handleRestore}
          />
          <AdminSurface className="p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <p className="text-sm text-muted-foreground">
                Page {result.meta.page} of {result.meta.totalPages}. Total galleries: {result.meta.total}.
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
          eyebrow="Galleries"
          title="No galleries matched the current filters."
          description="Try a broader keyword or change the status filter."
          action={
            <Link
              href={ROUTES.admin.galleries.create}
              className={cn(buttonVariants(), "rounded-full px-5")}
            >
              <FontAwesomeIcon icon={faPlus} />
              Create first gallery
            </Link>
          }
        />
      )}
    </AdminPageContainer>
  );
}
