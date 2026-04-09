"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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
      title: response.message ?? "Project created successfully.",
    });
    router.replace(ROUTES.admin.projects.detail(response.data.id));
  }

  return (
    <AdminPageContainer tone="hero" className="space-y-8 pb-10">
      <PageHeader
        eyebrow="Create project"
        title="Create a new project story"
        description="Set the core metadata first, then shape the full story in the editor workspace below."
        meta={
          <BackButton
            href={ROUTES.admin.projects.root}
            confirm
            confirmTitle="Discard this new project?"
            confirmDescription="The form will be cleared and you will return to the project list."
            confirmLabel="Discard"
          />
        }
      />
      {isLoading ? (
        <LoadingState title="Loading project form" description="Preparing galleries and editor dependencies." />
      ) : error ? (
        <ErrorState title="Unable to prepare this form" description={error} />
      ) : galleries.length === 0 ? (
        <EmptyState
          eyebrow="Projects"
          title="Create a gallery first."
          description="Projects must belong to an active gallery. Add at least one gallery before creating a project."
        />
      ) : (
        <AdminSurface className="overflow-hidden border-white/60 bg-white/84 p-6 shadow-[0_30px_100px_-70px_rgba(15,23,42,0.5)] md:p-8">
          <ProjectForm
            mode="create"
            galleries={galleries}
            submitLabel="Create project"
            description="Create keeps the same backend contract while giving the story editor a clearer, full-width workspace."
            onSubmit={handleSubmit}
          />
        </AdminSurface>
      )}
    </AdminPageContainer>
  );
}
