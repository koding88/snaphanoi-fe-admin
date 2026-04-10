import { AdminSurface } from "@/components/admin/admin-surface";
import { BlogPinBadge } from "@/components/blogs/blog-pin-badge";
import { BlogPublishBadge } from "@/components/blogs/blog-publish-badge";
import { BlogStatusBadge } from "@/components/blogs/blog-status-badge";
import type { BlogDetailRecord } from "@/features/blogs/types/blogs.types";
import { formatDateTime } from "@/features/users/utils/users-format";

export function BlogDetailCard({ blog }: { blog: BlogDetailRecord }) {
  const coverSizeKb = Math.max(1, Math.round(blog.coverImage.size / 1024));

  return (
    <AdminSurface className="overflow-hidden">
      <div className="grid gap-0 xl:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
        <div className="border-b border-border/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.28),rgba(245,239,230,0.82))] p-5 md:p-6 xl:border-r xl:border-b-0 xl:p-7">
          <div className="overflow-hidden rounded-[1.45rem] border border-border/70 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.94),rgba(233,227,217,0.9))] shadow-[0_24px_54px_-36px_rgba(19,17,14,0.42)]">
            <div className="flex aspect-[4/3] items-center justify-center p-4 md:p-5">
              {/* Blog cover URLs are backend-managed file assets, so plain img keeps the preview flexible. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={blog.coverImage.url} alt={blog.name} className="h-full w-full rounded-[1.2rem] object-contain" />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between gap-3 rounded-[1.3rem] border border-border/70 bg-white/72 px-4 py-3">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.22em] text-[--color-brand-muted] uppercase">
                Cover asset
              </p>
              <p className="mt-1 text-base font-medium text-foreground">{blog.coverImage.originalName}</p>
            </div>
            <div className="rounded-full border border-border/70 bg-white/78 px-3 py-1.5 text-[11px] font-semibold tracking-[0.18em] text-[--color-brand-muted] uppercase">
              {coverSizeKb} KB
            </div>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            <div className="rounded-[1.5rem] border border-border/80 bg-white/78 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)]">
              <p className="text-[11px] font-semibold tracking-[0.22em] text-[--color-brand-muted] uppercase">
                File format
              </p>
              <p className="mt-3 text-base font-medium text-foreground">{blog.coverImage.mimeType}</p>
              <p className="mt-1 text-sm text-muted-foreground">Backend-managed blog cover asset, ready for published delivery.</p>
            </div>
            <div className="rounded-[1.5rem] border border-border/80 bg-white/78 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)]">
              <p className="text-[11px] font-semibold tracking-[0.22em] text-[--color-brand-muted] uppercase">
                Editorial usage
              </p>
              <p className="mt-3 text-base font-medium text-foreground">
                {blog.isPinned ? "Pinned feature" : "Standard placement"}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">Pinned entries rise above the standard published chronology on public feeds.</p>
            </div>
          </div>
        </div>
        <div className="space-y-8 p-6 md:p-8 xl:p-10">
          <div className="flex flex-wrap items-center gap-2">
            <BlogPinBadge isPinned={blog.isPinned} />
            <BlogPublishBadge isPublished={blog.isPublished} />
            <BlogStatusBadge isActive={blog.isActive} deletedAt={blog.deletedAt} />
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-[11px] font-semibold tracking-[0.24em] text-[--color-brand-muted] uppercase">
                Blog title
              </p>
              <h2 className="font-heading text-4xl leading-[0.95] tracking-[0.03em] text-foreground md:text-5xl xl:text-[4.1rem]">
                {blog.name}
              </h2>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
              <span>Created by {blog.createdBy.name}</span>
              <span>Updated {formatDateTime(blog.updatedAt)}</span>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <div className="rounded-[1.5rem] border border-border/80 bg-white/76 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.74)]">
              <p className="text-[11px] font-semibold tracking-[0.22em] text-[--color-brand-muted] uppercase">
                Created by
              </p>
              <p className="mt-3 text-xl font-medium text-foreground">{blog.createdBy.name}</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Ownership stays visible here without exposing internal identifiers.
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-border/80 bg-white/76 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.74)]">
              <p className="text-[11px] font-semibold tracking-[0.22em] text-[--color-brand-muted] uppercase">
                Publication
              </p>
              <p className="mt-3 text-xl font-medium text-foreground">
                {blog.isPublished ? "Published" : "Draft"}
              </p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {blog.isPublished
                  ? "Ready for public blog surfaces and curated placements."
                  : "Kept inside admin until the article is ready to publish."}
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-border/80 bg-white/76 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.74)] md:col-span-2 xl:col-span-1">
              <p className="text-[11px] font-semibold tracking-[0.22em] text-[--color-brand-muted] uppercase">
                Timeline
              </p>
              <div className="mt-3 space-y-3">
                <div>
                  <p className="text-xs font-medium tracking-[0.16em] text-muted-foreground uppercase">Created</p>
                  <p className="mt-1 text-base text-foreground">{formatDateTime(blog.createdAt)}</p>
                </div>
                <div>
                  <p className="text-xs font-medium tracking-[0.16em] text-muted-foreground uppercase">Updated</p>
                  <p className="mt-1 text-base text-foreground">{formatDateTime(blog.updatedAt)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminSurface>
  );
}
