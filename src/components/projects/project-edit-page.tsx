"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { AdminPageContainer } from "@/components/admin/admin-page-container";
import { AdminSurface } from "@/components/admin/admin-surface";
import { ProjectForm, getProjectFormInitialValues } from "@/components/projects/project-form";
import type { ProjectGalleryOption } from "@/components/projects/project-gallery-select";
import { BackButton } from "@/components/shared/back-button";
import { ErrorState } from "@/components/shared/error-state";
import { LoadingState } from "@/components/shared/loading-state";
import { PageHeader } from "@/components/shared/page-header";
import { listGalleries } from "@/features/galleries/api/list-galleries";
import { getProject } from "@/features/projects/api/get-project";
import { updateProject } from "@/features/projects/api/update-project";
import type { ProjectDetailRecord } from "@/features/projects/types/projects.types";
import { getFriendlyProjectsError } from "@/features/projects/utils/projects-errors";
import { ROUTES } from "@/lib/constants/routes";
import { queueNavigationToast } from "@/lib/toast";

export function ProjectEditPage({ id }: { id: string }) {
  const t = useTranslations("projects.edit");
  const router = useRouter();
  const [project, setProject] = useState<ProjectDetailRecord | null>(null);
  const [galleries, setGalleries] = useState<ProjectGalleryOption[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function bootstrap() {
      setIsLoading(true);

      try {
        const [projectResult, galleryResult] = await Promise.all([
          getProject(id),
          listGalleries({
            page: 1,
            limit: 100,
            keyword: "",
            isActive: true,
          }),
        ]);

        setProject(projectResult);
        setGalleries(galleryResult.items.map((gallery) => ({ id: gallery.id, name: gallery.name.en })));
      } catch (loadError) {
        setError(getFriendlyProjectsError(loadError));
      } finally {
        setIsLoading(false);
      }
    }

    void bootstrap();
  }, [id]);

  async function handleSubmit(payload: Parameters<typeof updateProject>[1]) {
    const response = await updateProject(id, payload);
    queueNavigationToast({
      intent: "success",
      title: response.message ?? t("toasts.updated"),
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
            href={ROUTES.admin.projects.detail(id)}
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
      ) : error || !project ? (
        <ErrorState title={t("errorTitle")} description={error ?? t("notFound")} />
      ) : (
        <AdminSurface className="overflow-hidden border-white/60 bg-white/84 p-6 shadow-[0_30px_100px_-70px_rgba(15,23,42,0.5)] md:p-8">
          <ProjectForm
            mode="edit"
            galleries={galleries}
            initialValues={getProjectFormInitialValues(project)}
            existingCoverImage={project.coverImage}
            submitLabel={t("submitLabel")}
            description={t("formDescription")}
            onSubmit={handleSubmit}
          />
        </AdminSurface>
      )}
    </AdminPageContainer>
  );
}
