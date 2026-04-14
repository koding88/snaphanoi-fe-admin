import { AdminSurface } from "@/components/admin/admin-surface";
import { ProjectCoverPreview } from "@/components/projects/project-cover-preview";
import { ProjectPublishBadge } from "@/components/projects/project-publish-badge";
import { ProjectStatusBadge } from "@/components/projects/project-status-badge";
import type { ProjectDetailRecord } from "@/features/projects/types/projects.types";
import {
  formatCreatorDisplayName,
  formatDateTime,
  formatGalleryDisplayName,
} from "@/features/users/utils/users-format";

export function ProjectDetailCard({ project }: { project: ProjectDetailRecord }) {
  const coverSizeKb = Math.max(1, Math.round(project.coverImage.size / 1024));
  const creatorName = formatCreatorDisplayName(project.createdBy.name);
  const galleryName = formatGalleryDisplayName(project.gallery?.name);
  const hasGalleryReference = Boolean(project.gallery?.name && project.gallery.name.trim().length > 0);
  const lifecycleState = project.deletedAt
    ? `Archived on ${formatDateTime(project.deletedAt)}`
    : project.isActive
      ? "Active record"
      : "Inactive record";
  const deletedAtLabel = project.deletedAt ? formatDateTime(project.deletedAt) : "Not deleted";

  return (
    <AdminSurface className="overflow-hidden">
      <div className="grid gap-0 xl:grid-cols-[minmax(0,360px)_minmax(0,1fr)]">
        <div className="border-b border-border/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.32),rgba(245,239,230,0.82))] p-5 md:p-6 xl:border-r xl:border-b-0 xl:p-7">
          <ProjectCoverPreview
            src={project.coverImage.url}
            alt={project.name.en}
            imageClassName="rounded-[1.35rem]"
          />
          <div className="mt-5 rounded-[1.5rem] border border-border/80 bg-white/78 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)]">
            <p className="text-[11px] font-semibold tracking-[0.22em] text-[--color-brand-muted] uppercase">
              Asset context
            </p>
            <p className="mt-3 text-base font-medium text-foreground">{project.coverImage.originalName}</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              <div>
                <p className="text-[11px] font-medium tracking-[0.16em] text-muted-foreground uppercase">
                  File format
                </p>
                <p className="mt-1 text-sm text-foreground">{project.coverImage.mimeType}</p>
              </div>
              <div>
                <p className="text-[11px] font-medium tracking-[0.16em] text-muted-foreground uppercase">
                  File size
                </p>
                <p className="mt-1 text-sm text-foreground">{coverSizeKb} KB</p>
              </div>
            </div>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Cover media is stored as a backend-managed file and reused across project surfaces.
            </p>
          </div>
        </div>

        <div className="space-y-6 p-6 md:p-8 xl:p-10">
          <section className="rounded-[1.7rem] border border-border/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.9),rgba(248,244,237,0.92))] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.78)] md:p-6">
            <div className="flex flex-wrap items-center gap-2">
              <ProjectPublishBadge isPublished={project.isPublished} />
              <ProjectStatusBadge isActive={project.isActive} deletedAt={project.deletedAt} />
              <span className="rounded-full border border-border/75 bg-white/80 px-3 py-1 text-[11px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                {lifecycleState}
              </span>
            </div>
            <div className="mt-4 space-y-2">
              <p className="text-[11px] font-semibold tracking-[0.22em] text-[--color-brand-muted] uppercase">
                Story identity
              </p>
              <h2 className="font-heading text-4xl leading-tight tracking-[0.03em] text-foreground md:text-5xl xl:text-[3.5rem]">
                {project.name.en}
              </h2>
              <p className="text-sm text-muted-foreground">ID: {project.id}</p>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <span className="rounded-full border border-border/70 bg-white/76 px-3 py-1.5">
                Gallery: {galleryName}
              </span>
              <span className="rounded-full border border-border/70 bg-white/76 px-3 py-1.5">
                Owner: {creatorName}
              </span>
              <span className="rounded-full border border-border/70 bg-white/76 px-3 py-1.5">
                Updated {formatDateTime(project.updatedAt)}
              </span>
            </div>
          </section>

          <section className="rounded-[1.6rem] border border-border/80 bg-white/76 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.76)] md:p-6">
            <p className="text-[11px] font-semibold tracking-[0.22em] text-[--color-brand-muted] uppercase">
              Multilingual titles
            </p>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <div className="rounded-[1.2rem] border border-border/70 bg-white/82 p-4">
                <p className="text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">English</p>
                <p className="mt-2 text-lg font-medium text-foreground">{project.name.en}</p>
              </div>
              <div className="rounded-[1.2rem] border border-border/70 bg-white/82 p-4">
                <p className="text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">Vietnamese</p>
                <p className="mt-2 text-lg font-medium text-foreground">{project.name.vi}</p>
              </div>
              <div className="rounded-[1.2rem] border border-border/70 bg-white/82 p-4">
                <p className="text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">Chinese</p>
                <p className="mt-2 text-lg font-medium text-foreground">{project.name.cn}</p>
              </div>
            </div>
          </section>

          <section className="rounded-[1.6rem] border border-border/80 bg-white/70 p-5 md:p-6">
            <p className="text-[11px] font-semibold tracking-[0.22em] text-[--color-brand-muted] uppercase">
              Admin metadata
            </p>
            <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <div className="rounded-[1.2rem] border border-border/70 bg-white/78 p-4">
                <p className="text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">Created by</p>
                <p className="mt-2 text-base font-medium text-foreground">{creatorName}</p>
              </div>
              <div className="rounded-[1.2rem] border border-border/70 bg-white/78 p-4">
                <p className="text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">Lifecycle</p>
                <p className="mt-2 text-base font-medium text-foreground">{deletedAtLabel}</p>
              </div>
              <div className="rounded-[1.2rem] border border-border/70 bg-white/78 p-4 md:col-span-2 xl:col-span-1">
                <p className="text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">Gallery context</p>
                <p className="mt-2 text-base font-medium text-foreground">{galleryName}</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {hasGalleryReference
                    ? "Story is grouped under this gallery."
                    : "Original gallery reference is no longer available after retention cleanup."}
                </p>
              </div>
              <div className="rounded-[1.2rem] border border-border/70 bg-white/78 p-4 md:col-span-2 xl:col-span-3">
                <p className="text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">Timeline</p>
                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  <div>
                    <p className="text-xs text-muted-foreground">Created at</p>
                    <p className="mt-1 text-sm text-foreground">{formatDateTime(project.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Updated at</p>
                    <p className="mt-1 text-sm text-foreground">{formatDateTime(project.updatedAt)}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </AdminSurface>
  );
}
