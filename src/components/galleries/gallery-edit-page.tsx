"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { AdminPageContainer } from "@/components/admin/admin-page-container";
import { AdminSurface } from "@/components/admin/admin-surface";
import { GalleryForm } from "@/components/galleries/gallery-form";
import { BackButton } from "@/components/shared/back-button";
import { ErrorState } from "@/components/shared/error-state";
import { LoadingState } from "@/components/shared/loading-state";
import { PageHeader } from "@/components/shared/page-header";
import { getGallery } from "@/features/galleries/api/get-gallery";
import { updateGallery } from "@/features/galleries/api/update-gallery";
import type { GalleryRecord } from "@/features/galleries/types/galleries.types";
import { getFriendlyGalleriesError } from "@/features/galleries/utils/galleries-errors";
import { ROUTES } from "@/lib/constants/routes";
import { queueNavigationToast } from "@/lib/toast";

export function GalleryEditPage({ id }: { id: string }) {
  const t = useTranslations("galleries.edit");
  const router = useRouter();
  const [gallery, setGallery] = useState<GalleryRecord | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

  async function handleSubmit(payload: { name: { en: string; vi: string; cn: string } }) {
    const response = await updateGallery(id, payload);
    queueNavigationToast({
      intent: "success",
      title: response.message ?? t("toasts.updated"),
    });
    router.replace(ROUTES.admin.galleries.detail(response.data.id));
  }

  return (
    <AdminPageContainer tone="hero" className="space-y-8 pb-10">
      <PageHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("description")}
        meta={
          <BackButton
            href={ROUTES.admin.galleries.detail(id)}
            confirm
            confirmTitle={t("confirm.title")}
            confirmDescription={t("confirm.description")}
            confirmLabel={t("confirm.confirmLabel")}
          />
        }
      />
      {isLoading ? (
        <LoadingState title={t("loading.title")} description={t("loading.description")} />
      ) : error || !gallery ? (
        <ErrorState title={t("errorTitle")} description={error ?? t("notFound")} />
      ) : (
        <AdminSurface className="p-6 md:p-8">
          <GalleryForm
            initialValues={{
              en: gallery.name.en,
              vi: gallery.name.vi,
              cn: gallery.name.cn,
            }}
            submitLabel={t("submitLabel")}
            description={t("formDescription")}
            onSubmit={handleSubmit}
          />
        </AdminSurface>
      )}
    </AdminPageContainer>
  );
}
