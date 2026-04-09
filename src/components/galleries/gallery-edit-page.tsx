"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { AdminPageContainer } from "@/components/admin/admin-page-container";
import { AdminSurface } from "@/components/admin/admin-surface";
import { GalleryForm } from "@/components/galleries/gallery-form";
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
      title: response.message ?? "Gallery updated successfully.",
    });
    router.replace(ROUTES.admin.galleries.detail(response.data.id));
  }

  return (
    <AdminPageContainer tone="hero" className="space-y-8 pb-10">
      <PageHeader
        eyebrow="Edit gallery"
        title="Update gallery names."
        description="Refine localized naming while keeping the existing gallery record."
      />
      {isLoading ? (
        <LoadingState title="Loading gallery" description="Fetching the current gallery record." />
      ) : error || !gallery ? (
        <ErrorState title="Unable to load this gallery" description={error ?? "Gallery not found."} />
      ) : (
        <AdminSurface className="p-6 md:p-8">
          <GalleryForm
            initialValues={{
              en: gallery.name.en,
              vi: gallery.name.vi,
              cn: gallery.name.cn,
            }}
            submitLabel="Save changes"
            description="Updating names keeps the same gallery ID and lifecycle history."
            onSubmit={handleSubmit}
          />
        </AdminSurface>
      )}
    </AdminPageContainer>
  );
}
