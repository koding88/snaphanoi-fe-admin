"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { AdminPageContainer } from "@/components/admin/admin-page-container";
import { AdminSurface } from "@/components/admin/admin-surface";
import { ProjectForm, getProjectFormInitialValues } from "@/components/projects/project-form";
import type { ProjectGalleryOption } from "@/components/projects/project-gallery-select";
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
      title: response.message ?? "Project updated successfully.",
    });
    router.replace(ROUTES.admin.projects.detail(response.data.id));
  }

  return (
    <AdminPageContainer tone="hero" className="space-y-8 pb-10">
      <PageHeader
        eyebrow="Edit project"
        title="Update project story and assets."
        description="Refine content, swap the cover when needed, and keep the same project record intact."
      />
      {isLoading ? (
        <LoadingState title="Loading project" description="Fetching the project record and active gallery options." />
      ) : error || !project ? (
        <ErrorState title="Unable to load this project" description={error ?? "Project not found."} />
      ) : (
        <AdminSurface className="p-6 md:p-8">
          <ProjectForm
            mode="edit"
            galleries={galleries}
            initialValues={getProjectFormInitialValues(project)}
            existingCoverImage={project.coverImage}
            submitLabel="Save changes"
            description="Edit sends the full practical payload back to the backend, while keeping the current cover unless you replace it."
            onSubmit={handleSubmit}
          />
        </AdminSurface>
      )}
    </AdminPageContainer>
  );
}
