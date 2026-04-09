import { AdminSurface } from "@/components/admin/admin-surface";
import { ProjectPublishBadge } from "@/components/projects/project-publish-badge";
import { ProjectStatusBadge } from "@/components/projects/project-status-badge";
import type { ProjectDetailRecord } from "@/features/projects/types/projects.types";
import { formatDateTime } from "@/features/users/utils/users-format";

export function ProjectDetailCard({ project }: { project: ProjectDetailRecord }) {
  return (
    <AdminSurface className="overflow-hidden">
      <div className="grid gap-0 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)]">
        <div className="border-b border-border/70 bg-white/50 p-5 lg:border-b-0 lg:border-r">
          <div className="overflow-hidden rounded-[1.75rem] border border-border/80 bg-muted/40">
            {/* Project cover URLs are backend-managed file assets, so plain img keeps the detail view flexible. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={project.coverImage.url}
              alt={project.name.en}
              className="block aspect-[4/3] w-full object-cover"
            />
          </div>
          <div className="mt-4 space-y-3">
            <p className="text-xs font-semibold tracking-[0.22em] text-[--color-brand-muted] uppercase">
              Cover asset
            </p>
            <div className="rounded-[1.35rem] border border-border/80 bg-white/70 p-4">
              <p className="font-medium text-foreground">{project.coverImage.originalName}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {project.coverImage.mimeType} · {Math.round(project.coverImage.size / 1024)} KB
              </p>
            </div>
          </div>
        </div>
        <div className="space-y-6 p-6 md:p-8">
          <div className="flex flex-wrap gap-2">
            <ProjectPublishBadge isPublished={project.isPublished} />
            <ProjectStatusBadge isActive={project.isActive} deletedAt={project.deletedAt} />
          </div>
          <div>
            <p className="text-xs font-semibold tracking-[0.22em] text-[--color-brand-muted] uppercase">
              English title
            </p>
            <h2 className="mt-3 font-heading text-4xl tracking-[0.04em] text-foreground">
              {project.name.en}
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-[1.35rem] border border-border/80 bg-white/70 p-4">
              <p className="text-xs font-semibold tracking-[0.22em] text-[--color-brand-muted] uppercase">
                Vietnamese
              </p>
              <p className="mt-3 text-base text-foreground">{project.name.vi}</p>
            </div>
            <div className="rounded-[1.35rem] border border-border/80 bg-white/70 p-4">
              <p className="text-xs font-semibold tracking-[0.22em] text-[--color-brand-muted] uppercase">
                Chinese
              </p>
              <p className="mt-3 text-base text-foreground">{project.name.cn}</p>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-[1.35rem] border border-border/80 bg-white/70 p-4">
              <p className="text-xs font-semibold tracking-[0.22em] text-[--color-brand-muted] uppercase">
                Gallery
              </p>
              <p className="mt-3 text-base font-medium text-foreground">{project.gallery.name}</p>
              <p className="mt-1 text-sm text-muted-foreground">{project.gallery.id}</p>
            </div>
            <div className="rounded-[1.35rem] border border-border/80 bg-white/70 p-4">
              <p className="text-xs font-semibold tracking-[0.22em] text-[--color-brand-muted] uppercase">
                Created by
              </p>
              <p className="mt-3 text-base font-medium text-foreground">{project.createdBy.name}</p>
              <p className="mt-1 text-sm text-muted-foreground">{project.createdBy.id}</p>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-[1.35rem] border border-border/80 bg-white/70 p-4">
              <p className="text-xs font-semibold tracking-[0.22em] text-[--color-brand-muted] uppercase">
                Created
              </p>
              <p className="mt-3 text-base text-foreground">{formatDateTime(project.createdAt)}</p>
            </div>
            <div className="rounded-[1.35rem] border border-border/80 bg-white/70 p-4">
              <p className="text-xs font-semibold tracking-[0.22em] text-[--color-brand-muted] uppercase">
                Updated
              </p>
              <p className="mt-3 text-base text-foreground">{formatDateTime(project.updatedAt)}</p>
            </div>
          </div>
        </div>
      </div>
    </AdminSurface>
  );
}
