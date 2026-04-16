"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { AdminPageContainer } from "@/components/admin/admin-page-container";
import { AdminSurface } from "@/components/admin/admin-surface";
import { BackButton } from "@/components/shared/back-button";
import { PageHeader } from "@/components/shared/page-header";
import { RoleForm } from "@/components/roles/role-form";
import { createRole } from "@/features/roles/api/create-role";
import { ROUTES } from "@/lib/constants/routes";
import { queueNavigationToast } from "@/lib/toast";

export function RoleCreatePage() {
  const t = useTranslations("roles.create");
  const router = useRouter();

  async function handleSubmit(payload: { name: string }) {
    const response = await createRole(payload);
    queueNavigationToast({
      intent: "success",
      title: response.message ?? t("toasts.created"),
    });
    router.replace(ROUTES.admin.roles.detail(response.data.id));
  }

  return (
    <AdminPageContainer tone="hero" className="space-y-8 pb-10">
      <PageHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("description")}
        meta={
          <BackButton
            href={ROUTES.admin.roles.root}
            confirm
            confirmTitle={t("confirm.title")}
            confirmDescription={t("confirm.description")}
            confirmLabel={t("confirm.confirmLabel")}
          />
        }
      />
      <AdminSurface className="p-6 md:p-8">
        <RoleForm
          submitLabel={t("submitLabel")}
          description={t("formDescription")}
          onSubmit={handleSubmit}
        />
      </AdminSurface>
    </AdminPageContainer>
  );
}
