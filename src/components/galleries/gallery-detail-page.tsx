"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

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
  const t = useTranslations("galleries.detail");
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
        notifySuccess(response.message ?? response.data.message, t("toasts.archived"));
        router.replace(ROUTES.admin.galleries.root);
        return;
      }

      const response = await restoreGallery(gallery.id);
      setGallery(response.data);
      notifySuccess(response.message, t("toasts.restored"));
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
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("description")}
        meta={<BackButton href={ROUTES.admin.galleries.root} />}
        actions={
          gallery ? (
            <div className="flex flex-wrap gap-2">
              <Link
                href={ROUTES.admin.galleries.edit(gallery.id)}
                className={cn(buttonVariants({ variant: "outline" }), "rounded-full px-5")}
              >
                <FontAwesomeIcon icon={faUserPen} />
                {t("actions.edit")}
              </Link>
              {gallery.deletedAt ? (
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
      ) : error || !gallery ? (
        <ErrorState title={t("errorTitle")} description={error ?? t("notFound")} />
      ) : (
        <>
          <GalleryDetailCard gallery={gallery} />
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
        open={Boolean(dialogMode && gallery)}
        title={dialogMode === "delete" ? t("dialogs.deleteTitle", { name: gallery?.name.en ?? "" }) : t("dialogs.restoreTitle", { name: gallery?.name.en ?? "" })}
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
