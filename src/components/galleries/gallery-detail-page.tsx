"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { AdminPageContainer } from "@/components/admin/admin-page-container";
import { AdminSurface } from "@/components/admin/admin-surface";
import { GalleryDetailCard } from "@/components/galleries/gallery-detail-card";
import { BackButton } from "@/components/shared/back-button";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { ErrorState } from "@/components/shared/error-state";
import { LoadingState } from "@/components/shared/loading-state";
import { PageHeader } from "@/components/shared/page-header";
import { buttonVariants } from "@/components/ui/button";
import { deleteGallery } from "@/features/galleries/api/delete-gallery";
import { getGallery } from "@/features/galleries/api/get-gallery";
import { restoreGallery } from "@/features/galleries/api/restore-gallery";
import type { GalleryRecord } from "@/features/galleries/types/galleries.types";
import { getFriendlyGalleriesError } from "@/features/galleries/utils/galleries-errors";
import { ROUTES } from "@/lib/constants/routes";
import { faRotateLeft, faTrashCan, faUserPen } from "@/lib/icons/fa";
import { consumeNavigationToast, notifyError, notifySuccess } from "@/lib/toast";
import { cn } from "@/lib/utils";

export function GalleryDetailPage({ id }: { id: string }) {
  const router = useRouter();
  const [gallery, setGallery] = useState<GalleryRecord | null>(null);
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
        const galleryResult = await getGallery(id);
        setGallery(galleryResult);
      } catch (loadError) {
        setError(getFriendlyGalleriesError(loadError));
      } finally {
        setIsLoading(false);
      }
    }

    void bootstrap();
  }, [id]);

  async function handleAction() {
    if (!gallery || !dialogMode) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      if (dialogMode === "delete") {
        const response = await deleteGallery(gallery.id);
        notifySuccess(response.message ?? response.data.message, "Gallery archived.");
        router.replace(ROUTES.admin.galleries.root);
        return;
      }

      const response = await restoreGallery(gallery.id);
      setGallery(response.data);
      notifySuccess(response.message, "Gallery restored successfully.");
      setDialogMode(null);
    } catch (actionError) {
      notifyError(getFriendlyGalleriesError(actionError));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AdminPageContainer tone="hero" className="space-y-8 pb-10">
      <PageHeader
        eyebrow="Gallery detail"
        title="Review this gallery."
        description="Inspect multilingual names, lifecycle state, and ownership context before making changes."
        meta={<BackButton href={ROUTES.admin.galleries.root} />}
        actions={
          gallery ? (
            <div className="flex flex-wrap gap-2">
              <Link
                href={ROUTES.admin.galleries.edit(gallery.id)}
                className={cn(buttonVariants({ variant: "outline" }), "rounded-full px-5")}
              >
                <FontAwesomeIcon icon={faUserPen} />
                Edit
              </Link>
              {gallery.deletedAt ? (
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
        <LoadingState title="Loading gallery" description="Fetching the selected gallery record." />
      ) : error || !gallery ? (
        <ErrorState title="Unable to load this gallery" description={error ?? "Gallery not found."} />
      ) : (
        <>
          <GalleryDetailCard gallery={gallery} />
          <AdminSurface className="p-6 md:p-8">
            <p className="text-xs font-semibold tracking-[0.22em] text-[--color-brand-muted] uppercase">
              Admin actions
            </p>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              Archive and restore controls are kept here so gallery lifecycle changes stay deliberate.
            </p>
          </AdminSurface>
        </>
      )}
      <ConfirmDialog
        open={Boolean(dialogMode && gallery)}
        title={dialogMode === "delete" ? `Delete ${gallery?.name.en}?` : `Restore ${gallery?.name.en}?`}
        description={
          dialogMode === "delete"
            ? "This archives the gallery for now. You can restore it later if needed."
            : "This will bring the archived gallery back into the active collection."
        }
        confirmLabel={dialogMode === "delete" ? "Delete gallery" : "Restore gallery"}
        confirmVariant={dialogMode === "delete" ? "destructive" : "default"}
        isSubmitting={isSubmitting}
        onCancel={() => setDialogMode(null)}
        onConfirm={handleAction}
      />
    </AdminPageContainer>
  );
}
