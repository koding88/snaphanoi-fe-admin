"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { AdminPageContainer } from "@/components/admin/admin-page-container";
import { AdminSurface } from "@/components/admin/admin-surface";
import { PackageForm } from "@/components/packages/package-form";
import { BackButton } from "@/components/shared/back-button";
import { PageHeader } from "@/components/shared/page-header";
import { createPackage } from "@/features/packages/api/create-package";
import { ROUTES } from "@/lib/constants/routes";
import { queueNavigationToast } from "@/lib/toast";

export function PackageCreatePage() {
  const t = useTranslations("packages.create");
  const router = useRouter();

  async function handleSubmit(payload: Parameters<typeof createPackage>[0]) {
    const response = await createPackage(payload);
    queueNavigationToast({
      intent: "success",
      title: response.message ?? t("toasts.created"),
    });
    router.replace(ROUTES.admin.packages.detail(response.data.id));
  }

  return (
    <AdminPageContainer tone="hero" className="space-y-8 pb-10">
      <PageHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("description")}
        meta={
          <BackButton
            href={ROUTES.admin.packages.root}
            confirm
            confirmTitle={t("confirm.title")}
            confirmDescription={t("confirm.description")}
            confirmLabel={t("confirm.confirmLabel")}
          />
        }
      />
      <AdminSurface className="overflow-hidden border-white/60 bg-white/84 p-6 shadow-[0_30px_100px_-70px_rgba(15,23,42,0.5)] md:p-8">
        <PackageForm
          mode="create"
          submitLabel={t("submitLabel")}
          description={t("formDescription")}
          onSubmit={handleSubmit}
        />
      </AdminSurface>
    </AdminPageContainer>
  );
}
