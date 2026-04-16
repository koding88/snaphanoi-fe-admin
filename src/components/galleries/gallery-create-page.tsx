"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { AdminPageContainer } from "@/components/admin/admin-page-container";
import { AdminSurface } from "@/components/admin/admin-surface";
import { GalleryForm } from "@/components/galleries/gallery-form";
import { BackButton } from "@/components/shared/back-button";
import { PageHeader } from "@/components/shared/page-header";
import { createGallery } from "@/features/galleries/api/create-gallery";
import { ROUTES } from "@/lib/constants/routes";
import { queueNavigationToast } from "@/lib/toast";

export function GalleryCreatePage() {
  const t = useTranslations("galleries.create");
  const router = useRouter();

  async function handleSubmit(payload: { name: { en: string; vi: string; cn: string } }) {
    const response = await createGallery(payload);
    queueNavigationToast({
      intent: "success",
      title: response.message ?? t("toasts.created"),
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
            href={ROUTES.admin.galleries.root}
            confirm
            confirmTitle={t("confirm.title")}
            confirmDescription={t("confirm.description")}
            confirmLabel={t("confirm.confirmLabel")}
          />
        }
      />
      <AdminSurface className="p-6 md:p-8">
        <GalleryForm
          submitLabel={t("submitLabel")}
          description={t("formDescription")}
          onSubmit={handleSubmit}
        />
      </AdminSurface>
    </AdminPageContainer>
  );
}
