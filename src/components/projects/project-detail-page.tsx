"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { AdminPageContainer } from "@/components/admin/admin-page-container";
import { AdminSurface } from "@/components/admin/admin-surface";
import { ProjectDetailCard } from "@/components/projects/project-detail-card";
import { ProjectEditorPreview } from "@/components/projects/editor/project-editor-preview";
import { BackButton } from "@/components/shared/back-button";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { ErrorState } from "@/components/shared/error-state";
import { LoadingState } from "@/components/shared/loading-state";
import { PageHeader } from "@/components/shared/page-header";
import { buttonVariants } from "@/components/ui/button";
import { deleteProject } from "@/features/projects/api/delete-project";
import { getProject } from "@/features/projects/api/get-project";
import { restoreProject } from "@/features/projects/api/restore-project";
import type { ProjectDetailRecord } from "@/features/projects/types/projects.types";
import { getFriendlyProjectsError } from "@/features/projects/utils/projects-errors";
import { ROUTES } from "@/lib/constants/routes";
import { faRotateLeft, faTrashCan, faUserPen } from "@/lib/icons/fa";
import { consumeNavigationToast, notifyError, notifySuccess } from "@/lib/toast";
import { cn } from "@/lib/utils";

export function ProjectDetailPage({ id }: { id: string }) {
  const router = useRouter();
  const [project, setProject] = useState<ProjectDetailRecord | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogMode, setDialogMode] = useState<"delete" | "restore" | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    consumeNavigationToast();
  }, []);

  useEffect(() => {
    async function bootstrap() {
      setIsLoading(true);

      try {
        const projectResult = await getProject(id);
        setProject(projectResult);
      } catch (loadError) {
        setError(getFriendlyProjectsError(loadError));
      } finally {
        setIsLoading(false);
      }
    }

    void bootstrap();
  }, [id]);

  async function handleAction() {
    if (!project || !dialogMode) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (dialogMode === "delete") {
        const response = await deleteProject(project.id);
        notifySuccess(response.message ?? response.data.message, "Project archived.");
        router.replace(ROUTES.admin.projects.root);
        return;
      }

      const response = await restoreProject(project.id);
      setProject(response.data);
      notifySuccess(response.message, "Project restored successfully.");
      setDialogMode(null);
    } catch (actionError) {
      notifyError(getFriendlyProjectsError(actionError));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AdminPageContainer tone="hero" className="space-y-8 pb-10">
      <PageHeader
        eyebrow="Project detail"
        title="Review this project story."
        description="Inspect the studio-facing cover, multilingual naming, publication state, and saved story document before making changes."
        meta={<BackButton href={ROUTES.admin.projects.root} />}
        actions={
          project ? (
            <div className="flex flex-wrap gap-2">
              <Link
                href={ROUTES.admin.projects.edit(project.id)}
                className={cn(buttonVariants({ variant: "outline" }), "rounded-full px-5")}
              >
                <FontAwesomeIcon icon={faUserPen} />
                Edit
              </Link>
              {project.deletedAt ? (
                <button
                  type="button"
                  onClick={() => setDialogMode("restore")}
                  className={cn(buttonVariants(), "rounded-full px-5")}
                >
                  <FontAwesomeIcon icon={faRotateLeft} />
                  Restore
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setDialogMode("delete")}
                  className={cn(buttonVariants({ variant: "destructive" }), "rounded-full px-5")}
                >
                  <FontAwesomeIcon icon={faTrashCan} />
                  Delete
                </button>
              )}
            </div>
          ) : null
        }
      />
      {isLoading ? (
        <LoadingState title="Loading project" description="Fetching the selected project record." />
      ) : error || !project ? (
        <ErrorState title="Unable to load this project" description={error ?? "Project not found."} />
      ) : (
        <>
          <ProjectDetailCard project={project} />
          <AdminSurface className="p-6 md:p-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="space-y-3">
                <p className="text-xs font-semibold tracking-[0.22em] text-[--color-brand-muted] uppercase">
                  Story document
                </p>
                <h2 className="font-heading text-3xl tracking-[0.04em] text-foreground md:text-[2.35rem]">
                  Saved editorial content
                </h2>
                <p className="max-w-3xl text-sm leading-7 text-muted-foreground">
                  This preview uses the same document model as the editor and renders the currently saved story exactly as the admin system holds it.
                </p>
              </div>
              <div className="rounded-full border border-border/80 bg-white/70 px-4 py-2 text-[11px] font-semibold tracking-[0.18em] text-[--color-brand-muted] uppercase">
                Readonly preview
              </div>
            </div>
            <div className="mt-8 rounded-[2rem] border border-border/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.88),rgba(249,245,238,0.92))] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.78)] md:p-8">
              <ProjectEditorPreview content={project.content} />
            </div>
          </AdminSurface>
        </>
      )}
      <ConfirmDialog
        open={Boolean(dialogMode && project)}
        title={
          dialogMode === "delete"
            ? `Delete ${project?.name.en}?`
            : `Restore ${project?.name.en}?`
        }
        description={
          dialogMode === "delete"
            ? "This archives the project for now. You can restore it later if needed."
            : "This will bring the archived project back into the active collection."
        }
        confirmLabel={dialogMode === "delete" ? "Delete project" : "Restore project"}
        confirmVariant={dialogMode === "delete" ? "destructive" : "default"}
        isSubmitting={isSubmitting}
        onCancel={() => setDialogMode(null)}
        onConfirm={handleAction}
      />
    </AdminPageContainer>
  );
}
