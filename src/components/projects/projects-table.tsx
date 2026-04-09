"use client";

import Link from "next/link";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { ProjectPublishBadge } from "@/components/projects/project-publish-badge";
import { ProjectStatusBadge } from "@/components/projects/project-status-badge";
import type { ProjectRecord } from "@/features/projects/types/projects.types";
import { formatDateTime } from "@/features/users/utils/users-format";
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
  const [pendingAction, setPendingAction] = useState<{
    type: "delete" | "restore";
    project: ProjectRecord;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        <div className="border-b border-border/70 bg-white/56 px-5 py-4">
          <p className="text-xs font-semibold tracking-[0.22em] text-[--color-brand-muted] uppercase">
            Project records
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Review story titles, gallery placement, cover assets, and lifecycle state from one table.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-[1080px] w-full text-left">
            <thead className="border-b border-border/80 bg-white/55">
              <tr className="text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                <th className="px-5 py-4">Project</th>
                <th className="px-5 py-4">Cover</th>
                <th className="px-5 py-4">Localized names</th>
                <th className="px-5 py-4">Gallery</th>
                <th className="px-5 py-4">Publish</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Updated</th>
                <th className="px-5 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr
                  key={project.id}
                  className="border-b border-border/60 transition-colors hover:bg-white/46 last:border-b-0"
                >
                  <td className="px-5 py-4">
                    <div className="space-y-1">
                      <Link
                        href={ROUTES.admin.projects.detail(project.id)}
                        className="font-medium text-foreground transition-opacity hover:opacity-75"
                      >
                        {project.name.en}
                      </Link>
                      <p className="text-sm text-muted-foreground">{project.id}</p>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="overflow-hidden rounded-2xl border border-border/80 bg-muted/40">
                      {/* Table thumbnails use backend storage URLs directly and stay intentionally unoptimized here. */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={project.coverImage.url}
                        alt={project.name.en}
                        className="block h-20 w-28 object-cover"
                      />
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-muted-foreground">
                    <p>vi: {project.name.vi}</p>
                    <p>cn: {project.name.cn}</p>
                  </td>
                  <td className="px-5 py-4 text-sm text-muted-foreground">{project.gallery.name}</td>
                  <td className="px-5 py-4">
                    <ProjectPublishBadge isPublished={project.isPublished} />
                  </td>
                  <td className="px-5 py-4">
                    <ProjectStatusBadge isActive={project.isActive} deletedAt={project.deletedAt} />
                  </td>
                  <td className="px-5 py-4 text-sm text-muted-foreground">{formatDateTime(project.updatedAt)}</td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={ROUTES.admin.projects.edit(project.id)}
                        className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
                      >
                        <FontAwesomeIcon icon={faUserPen} />
                        Edit
                      </Link>
                      {project.deletedAt ? (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          disabled={isBusy}
                          onClick={() => setPendingAction({ type: "restore", project })}
                        >
                          <FontAwesomeIcon icon={faRotateLeft} />
                          Restore
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          disabled={isBusy}
                          onClick={() => setPendingAction({ type: "delete", project })}
                        >
                          <FontAwesomeIcon icon={faTrashCan} />
                          Delete
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <ConfirmDialog
        open={Boolean(pendingAction)}
        title={
          pendingAction?.type === "delete"
            ? `Delete ${pendingAction.project.name.en}?`
            : `Restore ${pendingAction?.project.name.en}?`
        }
        description={
          pendingAction?.type === "delete"
            ? "This archives the project for now. You can restore it later if needed."
            : "This restores the archived project to the active studio library."
        }
        confirmLabel={pendingAction?.type === "delete" ? "Delete project" : "Restore project"}
        confirmVariant={pendingAction?.type === "delete" ? "destructive" : "default"}
        isSubmitting={isSubmitting}
        onCancel={() => setPendingAction(null)}
        onConfirm={handleConfirm}
        extra={
          pendingAction ? (
            <div className="space-y-1">
              <p className="text-xs font-semibold tracking-[0.16em] text-[--color-brand-muted] uppercase">
                Selected project
              </p>
              <p className="text-sm font-medium text-foreground">{pendingAction.project.name.en}</p>
              <p className="text-sm text-muted-foreground">{pendingAction.project.gallery.name}</p>
            </div>
          ) : null
        }
      />
    </>
  );
}
