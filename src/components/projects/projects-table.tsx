"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type KeyboardEvent, type MouseEvent, useState } from "react";
import { useTranslations } from "next-intl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { ProjectPublishBadge } from "@/components/projects/project-publish-badge";
import { ProjectStatusBadge } from "@/components/projects/project-status-badge";
import type { ProjectRecord } from "@/features/projects/types/projects.types";
import { formatDateOnly, formatGalleryDisplayName } from "@/features/users/utils/users-format";
import { ROUTES } from "@/lib/constants/routes";
import { faRotateLeft, faTrashCan, faUserPen } from "@/lib/icons/fa";
import { cn } from "@/lib/utils";

type ProjectsTableProps = {
  projects: ProjectRecord[];
  isBusy?: boolean;
  onDelete: (project: ProjectRecord) => Promise<void>;
  onRestore: (project: ProjectRecord) => Promise<void>;
};

export function ProjectsTable({ projects, isBusy = false, onDelete, onRestore }: ProjectsTableProps) {
  const t = useTranslations("projects.table");
  const router = useRouter();
  const columnLayout =
    "grid-cols-[minmax(0,1fr)_auto] md:grid-cols-[minmax(230px,1.25fr)_minmax(170px,1fr)_104px_104px_112px] xl:grid-cols-[minmax(230px,1.25fr)_112px_minmax(170px,1fr)_104px_104px_112px_112px]";
  const [pendingAction, setPendingAction] = useState<{
    type: "delete" | "restore";
    project: ProjectRecord;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleRowActionClick = (event: MouseEvent | KeyboardEvent) => {
    event.stopPropagation();
  };

  function navigateToProject(projectId: string) {
    router.push(ROUTES.admin.projects.detail(projectId));
  }

  async function handleConfirm() {
    if (!pendingAction) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (pendingAction.type === "delete") {
        await onDelete(pendingAction.project);
      } else {
        await onRestore(pendingAction.project);
      }

      setPendingAction(null);
    } catch {
      // Parent page owns the mutation toast.
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <div className="surface-enter overflow-hidden rounded-[2rem] border border-border/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(248,244,237,0.88))] shadow-soft">
        <div className="border-b border-border/70 bg-white/56 px-5 py-3">
          <p className="text-xs font-semibold tracking-[0.22em] text-[--color-brand-muted] uppercase">
            {t("title")}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {t("description")}
          </p>
        </div>
        <div className="border-t border-border/10">
          <div
            className={cn(
              "hidden items-center gap-x-3 border-b border-border/80 bg-white/55 px-5 py-3.5 text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase md:grid md:min-w-[760px] xl:min-w-[1040px]",
              columnLayout,
            )}
          >
            <div>{t("columns.project")}</div>
            <div className="hidden text-center xl:block">{t("columns.cover")}</div>
            <div className="text-center">{t("columns.gallery")}</div>
            <div className="text-center">{t("columns.publish")}</div>
            <div className="text-center">{t("columns.status")}</div>
            <div className="hidden text-center xl:block">{t("columns.updated")}</div>
            <div className="text-center">{t("columns.actions")}</div>
          </div>
          <div>
            {projects.map((project) => (
              <div
                key={project.id}
                role="link"
                tabIndex={0}
                onClick={() => navigateToProject(project.id)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    navigateToProject(project.id);
                  }
                }}
                className={cn(
                  "grid cursor-pointer items-center gap-x-3 border-b border-border/60 px-4 py-3 transition-[background-color,box-shadow] hover:bg-white/60 focus-visible:bg-white/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-brand]/30 last:border-b-0 md:min-w-[760px] md:px-5 md:py-4 xl:min-w-[1040px]",
                  columnLayout,
                )}
              >
                <div>
                  <p className="truncate font-medium text-foreground">{project.name.en}</p>
                  <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
                    <p className="truncate"><span className="font-semibold tracking-[0.14em] uppercase">VI</span> {project.name.vi}</p>
                    <p className="truncate"><span className="font-semibold tracking-[0.14em] uppercase">CN</span> {project.name.cn}</p>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground md:hidden">
                    {formatGalleryDisplayName(project.gallery?.name)} · {formatDateOnly(project.updatedAt)}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-1.5 md:hidden">
                    <ProjectPublishBadge isPublished={project.isPublished} />
                    <ProjectStatusBadge isActive={project.isActive} deletedAt={project.deletedAt} />
                  </div>
                  </div>
                <div className="hidden justify-center xl:flex">
                  <div className="overflow-hidden rounded-2xl border border-border/80 bg-muted/40 shadow-[0_12px_30px_-24px_rgba(32,24,18,0.45)]">
                    {/* Table thumbnails use backend storage URLs directly and stay intentionally unoptimized here. */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={project.coverImage.url}
                      alt={project.name.en}
                      className="block h-16 w-24 object-cover"
                    />
                  </div>
                </div>
                <div className="hidden text-center text-sm text-muted-foreground md:block">
                  <p className="truncate">{formatGalleryDisplayName(project.gallery?.name)}</p>
                </div>
                <div className="hidden justify-center md:flex">
                  <ProjectPublishBadge isPublished={project.isPublished} />
                </div>
                <div className="hidden justify-center md:flex">
                  <ProjectStatusBadge isActive={project.isActive} deletedAt={project.deletedAt} />
                </div>
                <div className="hidden text-center text-sm text-muted-foreground xl:block">
                  <p className="leading-relaxed">{formatDateOnly(project.updatedAt)}</p>
                </div>
                <div className="text-center">
                  <div
                    className="grid justify-items-center gap-2"
                    onClick={handleRowActionClick}
                    onKeyDown={handleRowActionClick}
                  >
                    <Link
                      href={ROUTES.admin.projects.edit(project.id)}
                       className={cn(buttonVariants({ variant: "outline", size: "sm" }), "h-8 w-[86px] px-2 text-xs md:w-[96px]")}
                      onClick={handleRowActionClick}
                    >
                      <FontAwesomeIcon icon={faUserPen} />
                      {t("actions.edit")}
                    </Link>
                    {project.deletedAt ? (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                         className="h-8 w-[86px] px-2 text-xs md:w-[96px]"
                        disabled={isBusy}
                        onClick={(event) => {
                          handleRowActionClick(event);
                          setPendingAction({ type: "restore", project });
                        }}
                      >
                        <FontAwesomeIcon icon={faRotateLeft} />
                        {t("actions.restore")}
                      </Button>
                    ) : (
                      <Button
                        type="button"
                         variant="outline"
                         size="sm"
                         className="h-8 w-[86px] border-red-200 px-2 text-xs text-red-700 hover:bg-red-50 hover:text-red-800 md:w-[96px]"
                         disabled={isBusy}
                        onClick={(event) => {
                          handleRowActionClick(event);
                          setPendingAction({ type: "delete", project });
                        }}
                      >
                        <FontAwesomeIcon icon={faTrashCan} />
                        {t("actions.delete")}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <ConfirmDialog
        open={Boolean(pendingAction)}
        title={
          pendingAction?.type === "delete"
            ? t("dialogs.deleteTitle", { name: pendingAction.project.name.en })
            : t("dialogs.restoreTitle", { name: pendingAction?.project.name.en ?? "" })
        }
        description={
          pendingAction?.type === "delete"
            ? t("dialogs.deleteDescription")
            : t("dialogs.restoreDescription")
        }
        confirmLabel={
          pendingAction?.type === "delete"
            ? t("dialogs.deleteConfirm")
            : t("dialogs.restoreConfirm")
        }
        confirmVariant={pendingAction?.type === "delete" ? "destructive" : "default"}
        isSubmitting={isSubmitting}
        onCancel={() => setPendingAction(null)}
        onConfirm={handleConfirm}
        extra={
          pendingAction ? (
            <div className="space-y-1">
              <p className="text-xs font-semibold tracking-[0.16em] text-[--color-brand-muted] uppercase">
                {t("dialogs.selected")}
              </p>
              <p className="text-sm font-medium text-foreground">{pendingAction.project.name.en}</p>
              <p className="text-sm text-muted-foreground">
                {formatGalleryDisplayName(pendingAction.project.gallery?.name)}
              </p>
            </div>
          ) : null
        }
      />
    </>
  );
}
