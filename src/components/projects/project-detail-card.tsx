import { AdminSurface } from "@/components/admin/admin-surface";
import { ProjectPublishBadge } from "@/components/projects/project-publish-badge";
import { ProjectStatusBadge } from "@/components/projects/project-status-badge";
import type { ProjectDetailRecord } from "@/features/projects/types/projects.types";
import { formatDateTime } from "@/features/users/utils/users-format";

export function ProjectDetailCard({ project }: { project: ProjectDetailRecord }) {
  const coverSizeKb = Math.max(1, Math.round(project.coverImage.size / 1024));

  return (
    <AdminSurface className="overflow-hidden">
      <div className="grid gap-0 xl:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
        <div className="border-b border-border/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.28),rgba(245,239,230,0.82))] p-5 md:p-6 xl:border-b-0 xl:border-r xl:p-7">
          <div className="relative overflow-hidden rounded-[2rem] border border-border/80 bg-muted/40 shadow-[0_28px_60px_-36px_rgba(19,17,14,0.45)]">
            {/* Project cover URLs are backend-managed file assets, so plain img keeps the detail view flexible. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={project.coverImage.url}
              alt={project.name.en}
              className="block aspect-[4/3] w-full object-cover"
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-[linear-gradient(180deg,rgba(15,12,9,0),rgba(15,12,9,0.7))]" />
            <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-4 text-white">
              <div>
                <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-white/72">
                  Cover asset
                </p>
                <p className="mt-2 text-lg font-medium tracking-[0.02em]">{project.coverImage.originalName}</p>
              </div>
              <div className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[11px] font-semibold tracking-[0.18em] uppercase backdrop-blur-sm">
                {coverSizeKb} KB
              </div>
            </div>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            <div className="rounded-[1.5rem] border border-border/80 bg-white/78 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)]">
              <p className="text-[11px] font-semibold tracking-[0.22em] text-[--color-brand-muted] uppercase">
                File format
              </p>
              <p className="mt-3 text-base font-medium text-foreground">{project.coverImage.mimeType}</p>
              <p className="mt-1 text-sm text-muted-foreground">Backend-managed asset, ready for public-facing delivery.</p>
            </div>
            <div className="rounded-[1.5rem] border border-border/80 bg-white/78 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)]">
              <p className="text-[11px] font-semibold tracking-[0.22em] text-[--color-brand-muted] uppercase">
                Visual ratio
              </p>
              <p className="mt-3 text-base font-medium text-foreground">Landscape cover</p>
              <p className="mt-1 text-sm text-muted-foreground">Presented as the primary story image across admin and customer surfaces.</p>
            </div>
          </div>
        </div>
        <div className="space-y-8 p-6 md:p-8 xl:p-10">
          <div className="flex flex-wrap items-center gap-2">
            <ProjectPublishBadge isPublished={project.isPublished} />
            <ProjectStatusBadge isActive={project.isActive} deletedAt={project.deletedAt} />
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-[11px] font-semibold tracking-[0.24em] text-[--color-brand-muted] uppercase">
                English title
              </p>
              <h2 className="font-heading text-4xl leading-[0.95] tracking-[0.03em] text-foreground md:text-5xl xl:text-[4.25rem]">
                {project.name.en}
              </h2>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
              <span className="rounded-full border border-border/70 bg-white/76 px-3 py-1.5">
                Gallery: {project.gallery.name}
              </span>
              <span>Created by {project.createdBy.name}</span>
              <span>Updated {formatDateTime(project.updatedAt)}</span>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-[1.6rem] border border-border/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.78),rgba(248,244,237,0.94))] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.78)]">
              <p className="text-[11px] font-semibold tracking-[0.22em] text-[--color-brand-muted] uppercase">
                Vietnamese title
              </p>
              <p className="mt-4 text-2xl leading-tight text-foreground">
                {project.name.vi}
              </p>
            </div>
            <div className="rounded-[1.6rem] border border-border/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.78),rgba(248,244,237,0.94))] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.78)]">
              <p className="text-[11px] font-semibold tracking-[0.22em] text-[--color-brand-muted] uppercase">
                Chinese title
              </p>
              <p className="mt-4 text-2xl leading-tight text-foreground">
                {project.name.cn}
              </p>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <div className="rounded-[1.5rem] border border-border/80 bg-white/76 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.74)]">
              <p className="text-[11px] font-semibold tracking-[0.22em] text-[--color-brand-muted] uppercase">
                Gallery
              </p>
              <p className="mt-3 text-xl font-medium text-foreground">{project.gallery.name}</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                The story is currently grouped under this portfolio collection.
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-border/80 bg-white/76 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.74)]">
              <p className="text-[11px] font-semibold tracking-[0.22em] text-[--color-brand-muted] uppercase">
                Created by
              </p>
              <p className="mt-3 text-xl font-medium text-foreground">{project.createdBy.name}</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Ownership stays visible here without exposing raw internal identifiers.
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-border/80 bg-white/76 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.74)] md:col-span-2 xl:col-span-1">
              <p className="text-[11px] font-semibold tracking-[0.22em] text-[--color-brand-muted] uppercase">
                Timeline
              </p>
              <div className="mt-3 space-y-3">
                <div>
                  <p className="text-xs font-medium tracking-[0.16em] text-muted-foreground uppercase">Created</p>
                  <p className="mt-1 text-base text-foreground">{formatDateTime(project.createdAt)}</p>
                </div>
                <div>
                  <p className="text-xs font-medium tracking-[0.16em] text-muted-foreground uppercase">Updated</p>
                  <p className="mt-1 text-base text-foreground">{formatDateTime(project.updatedAt)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminSurface>
  );
}
