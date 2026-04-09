"use client";

import { useRouter } from "next/navigation";

import { AdminPageContainer } from "@/components/admin/admin-page-container";
import { AdminSurface } from "@/components/admin/admin-surface";
import { GalleryForm } from "@/components/galleries/gallery-form";
import { PageHeader } from "@/components/shared/page-header";
import { createGallery } from "@/features/galleries/api/create-gallery";
import { ROUTES } from "@/lib/constants/routes";
import { queueNavigationToast } from "@/lib/toast";

export function GalleryCreatePage() {
  const router = useRouter();

  async function handleSubmit(payload: { name: { en: string; vi: string; cn: string } }) {
    const response = await createGallery(payload);
    queueNavigationToast({
      intent: "success",
      title: response.message ?? "Gallery created successfully.",
    });
    router.replace(ROUTES.admin.galleries.detail(response.data.id));
  }

  return (
    <AdminPageContainer tone="hero" className="space-y-8 pb-10">
      <PageHeader
        eyebrow="Create gallery"
        title="Create a new gallery."
        description="Add multilingual names so this collection is ready across supported languages."
      />
      <AdminSurface className="p-6 md:p-8">
        <GalleryForm
          submitLabel="Create gallery"
          description="All three localized names are required by the backend contract."
          onSubmit={handleSubmit}
        />
      </AdminSurface>
    </AdminPageContainer>
  );
}
