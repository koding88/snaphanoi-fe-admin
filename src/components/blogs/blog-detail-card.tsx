import { AdminSurface } from "@/components/admin/admin-surface";
import { BlogPinBadge } from "@/components/blogs/blog-pin-badge";
import { BlogPublishBadge } from "@/components/blogs/blog-publish-badge";
import { BlogStatusBadge } from "@/components/blogs/blog-status-badge";
import type { BlogDetailRecord } from "@/features/blogs/types/blogs.types";
import { formatCreatorDisplayName, formatDateTime } from "@/features/users/utils/users-format";

export function BlogDetailCard({ blog }: { blog: BlogDetailRecord }) {
  const coverSizeKb = Math.max(1, Math.round(blog.coverImage.size / 1024));
  const creatorName = formatCreatorDisplayName(blog.createdBy.name);
  const lifecycleState = blog.deletedAt
    ? `Archived on ${formatDateTime(blog.deletedAt)}`
    : blog.isActive
      ? "Active record"
      : "Inactive record";
  const deletedAtLabel = blog.deletedAt ? formatDateTime(blog.deletedAt) : "Not deleted";

  return (
    <AdminSurface className="overflow-hidden">
      <div className="grid gap-0 xl:grid-cols-[minmax(0,360px)_minmax(0,1fr)]">
        <div className="border-b border-border/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.32),rgba(245,239,230,0.82))] p-5 md:p-6 xl:border-r xl:border-b-0 xl:p-7">
          <div className="overflow-hidden rounded-[1.45rem] border border-border/70 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.94),rgba(233,227,217,0.9))] shadow-[0_24px_54px_-36px_rgba(19,17,14,0.42)]">
            <div className="flex aspect-[4/3] items-center justify-center p-4 md:p-5">
              {/* Blog cover URLs are backend-managed file assets, so plain img keeps the preview flexible. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={blog.coverImage.url} alt={blog.name} className="h-full w-full rounded-[1.2rem] object-contain" />
            </div>
          </div>
          <div className="mt-5 rounded-[1.5rem] border border-border/80 bg-white/78 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)]">
            <p className="text-[11px] font-semibold tracking-[0.22em] text-[--color-brand-muted] uppercase">
              Cover asset context
            </p>
            <p className="mt-3 text-base font-medium text-foreground">{blog.coverImage.originalName}</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              <div>
                <p className="text-[11px] font-medium tracking-[0.16em] text-muted-foreground uppercase">
                  File format
                </p>
                <p className="mt-1 text-sm text-foreground">{blog.coverImage.mimeType}</p>
              </div>
              <div>
                <p className="text-[11px] font-medium tracking-[0.16em] text-muted-foreground uppercase">
                  File size
                </p>
                <p className="mt-1 text-sm text-foreground">{coverSizeKb} KB</p>
              </div>
            </div>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Cover asset is backend-managed and reused for editorial list/detail rendering.
            </p>
          </div>
        </div>

        <div className="space-y-6 p-6 md:p-8 xl:p-10">
          <section className="rounded-[1.7rem] border border-border/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.9),rgba(248,244,237,0.92))] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.78)] md:p-6">
            <div className="flex flex-wrap items-center gap-2">
              <BlogPinBadge isPinned={blog.isPinned} />
              <BlogPublishBadge isPublished={blog.isPublished} />
              <BlogStatusBadge isActive={blog.isActive} deletedAt={blog.deletedAt} />
              <span className="rounded-full border border-border/75 bg-white/80 px-3 py-1 text-[11px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                {lifecycleState}
              </span>
            </div>
            <div className="mt-4 space-y-2">
              <p className="text-[11px] font-semibold tracking-[0.22em] text-[--color-brand-muted] uppercase">
                Editorial identity
              </p>
              <h2 className="font-heading text-4xl leading-tight tracking-[0.03em] text-foreground md:text-5xl xl:text-[3.4rem]">
                {blog.name}
              </h2>
              <p className="text-sm text-muted-foreground">ID: {blog.id}</p>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <span className="rounded-full border border-border/70 bg-white/76 px-3 py-1.5">
                Owner: {creatorName}
              </span>
              <span className="rounded-full border border-border/70 bg-white/76 px-3 py-1.5">
                Updated {formatDateTime(blog.updatedAt)}
              </span>
            </div>
          </section>

          <section className="rounded-[1.6rem] border border-border/80 bg-white/76 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.76)] md:p-6">
            <p className="text-[11px] font-semibold tracking-[0.22em] text-[--color-brand-muted] uppercase">
              Editorial state
            </p>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div className="rounded-[1.2rem] border border-border/70 bg-white/82 p-4">
                <p className="text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">Placement</p>
                <p className="mt-2 text-base font-medium text-foreground">
                  {blog.isPinned ? "Pinned feature" : "Standard placement"}
                </p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {blog.isPinned
                    ? "Pinned entries stay highlighted above regular chronology."
                    : "Follows default chronology ordering in editorial feeds."}
                </p>
              </div>
              <div className="rounded-[1.2rem] border border-border/70 bg-white/82 p-4">
                <p className="text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">Publication</p>
                <p className="mt-2 text-base font-medium text-foreground">
                  {blog.isPublished ? "Published" : "Draft"}
                </p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {blog.isPublished
                    ? "Visible to public blog surfaces."
                    : "Visible only in admin until publication."}
                </p>
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
                <p className="text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">Record state</p>
                <p className="mt-2 text-base font-medium text-foreground">{blog.isActive ? "Active" : "Inactive"}</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Lifecycle controls in this view archive and restore the record.
                </p>
              </div>
              <div className="rounded-[1.2rem] border border-border/70 bg-white/78 p-4 md:col-span-2 xl:col-span-3">
                <p className="text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">Timeline</p>
                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  <div>
                    <p className="text-xs text-muted-foreground">Created at</p>
                    <p className="mt-1 text-sm text-foreground">{formatDateTime(blog.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Updated at</p>
                    <p className="mt-1 text-sm text-foreground">{formatDateTime(blog.updatedAt)}</p>
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
