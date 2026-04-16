"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { AdminPageContainer } from "@/components/admin/admin-page-container";
import { AdminSurface } from "@/components/admin/admin-surface";
import { ProjectForm } from "@/components/projects/project-form";
import type { ProjectGalleryOption } from "@/components/projects/project-gallery-select";
import { BackButton } from "@/components/shared/back-button";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { LoadingState } from "@/components/shared/loading-state";
import { PageHeader } from "@/components/shared/page-header";
import { createProject } from "@/features/projects/api/create-project";
import { getFriendlyProjectsError } from "@/features/projects/utils/projects-errors";
import { listGalleries } from "@/features/galleries/api/list-galleries";
import { ROUTES } from "@/lib/constants/routes";
import { queueNavigationToast } from "@/lib/toast";

export function ProjectCreatePage() {
  const t = useTranslations("projects.create");
  const router = useRouter();
  const [galleries, setGalleries] = useState<ProjectGalleryOption[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function bootstrap() {
      setIsLoading(true);

      try {
        const result = await listGalleries({
          page: 1,
          limit: 100,
          keyword: "",
          isActive: true,
        });

        setGalleries(result.items.map((gallery) => ({ id: gallery.id, name: gallery.name.en })));
      } catch (loadError) {
        setError(getFriendlyProjectsError(loadError));
      } finally {
        setIsLoading(false);
      }
    }

    void bootstrap();
  }, []);

  async function handleSubmit(payload: Parameters<typeof createProject>[0]) {
    const response = await createProject(payload);
    queueNavigationToast({
      intent: "success",
      title: response.message ?? t("toasts.created"),
    });
    router.replace(ROUTES.admin.projects.detail(response.data.id));
  }

  return (
    <AdminPageContainer tone="hero" className="space-y-8 pb-10">
      <PageHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("description")}
        meta={
          <BackButton
            href={ROUTES.admin.projects.root}
            confirm
            confirmTitle={t("confirm.title")}
            confirmDescription={t("confirm.description")}
            confirmLabel={t("confirm.confirmLabel")}
          />
        }
      />
      {isLoading ? (
        <LoadingState
          title={t("loading.title")}
          description={t("loading.description")}
        />
      ) : error ? (
        <ErrorState title={t("errorTitle")} description={error} />
      ) : galleries.length === 0 ? (
        <EmptyState
          eyebrow={t("empty.eyebrow")}
          title={t("empty.title")}
          description={t("empty.description")}
        />
      ) : (
        <AdminSurface className="overflow-hidden border-white/60 bg-white/84 p-6 shadow-[0_30px_100px_-70px_rgba(15,23,42,0.5)] md:p-8">
          <ProjectForm
            mode="create"
            galleries={galleries}
            submitLabel={t("submitLabel")}
            description={t("formDescription")}
            onSubmit={handleSubmit}
          />
        </AdminSurface>
      )}
    </AdminPageContainer>
  );
}
