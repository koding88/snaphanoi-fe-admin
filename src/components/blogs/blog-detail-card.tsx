import { useTranslations } from "next-intl";

import { AdminSurface } from "@/components/admin/admin-surface";
import { BlogPinBadge } from "@/components/blogs/blog-pin-badge";
import { BlogPublishBadge } from "@/components/blogs/blog-publish-badge";
import { BlogStatusBadge } from "@/components/blogs/blog-status-badge";
import type { BlogDetailRecord } from "@/features/blogs/types/blogs.types";
import { formatCreatorDisplayName, formatDateTime } from "@/features/users/utils/users-format";

export function BlogDetailCard({ blog }: { blog: BlogDetailRecord }) {
  const t = useTranslations("blogs.detailCard");
  const coverSizeKb = Math.max(1, Math.round(blog.coverImage.size / 1024));
  const creatorName = formatCreatorDisplayName(blog.createdBy.name);
  const lifecycleState = blog.deletedAt
    ? t("lifecycle.archivedOn", { date: formatDateTime(blog.deletedAt) })
    : blog.isActive
      ? t("lifecycle.active")
      : t("lifecycle.inactive");
  const deletedAtLabel = blog.deletedAt ? formatDateTime(blog.deletedAt) : t("lifecycle.notDeleted");

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
                {t("coverAsset")}
              </p>
            <p className="mt-3 text-base font-medium text-foreground">{blog.coverImage.originalName}</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              <div>
                  <p className="text-[11px] font-medium tracking-[0.16em] text-muted-foreground uppercase">
                    {t("fileFormat")}
                  </p>
                <p className="mt-1 text-sm text-foreground">{blog.coverImage.mimeType}</p>
              </div>
              <div>
                  <p className="text-[11px] font-medium tracking-[0.16em] text-muted-foreground uppercase">
                    {t("fileSize")}
                  </p>
                <p className="mt-1 text-sm text-foreground">{coverSizeKb} KB</p>
              </div>
            </div>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              {t("coverDescription")}
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
                {t("editorialIdentity")}
              </p>
              <h2 className="font-heading text-4xl leading-tight tracking-[0.03em] text-foreground md:text-5xl xl:text-[3.4rem]">
                {blog.name}
              </h2>
              <p className="text-sm text-muted-foreground">{t("id", { id: blog.id })}</p>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <span className="rounded-full border border-border/70 bg-white/76 px-3 py-1.5">
                  {t("owner", { name: creatorName })}
                </span>
                <span className="rounded-full border border-border/70 bg-white/76 px-3 py-1.5">
                  {t("updated", { date: formatDateTime(blog.updatedAt) })}
                </span>
              </div>
            </section>

          <section className="rounded-[1.6rem] border border-border/80 bg-white/76 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.76)] md:p-6">
              <p className="text-[11px] font-semibold tracking-[0.22em] text-[--color-brand-muted] uppercase">
                {t("editorialState")}
              </p>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div className="rounded-[1.2rem] border border-border/70 bg-white/82 p-4">
                <p className="text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">{t("placement.title")}</p>
                <p className="mt-2 text-base font-medium text-foreground">
                  {blog.isPinned ? t("placement.pinned") : t("placement.standard")}
                </p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {blog.isPinned
                    ? t("placement.pinnedDescription")
                    : t("placement.standardDescription")}
                </p>
              </div>
              <div className="rounded-[1.2rem] border border-border/70 bg-white/82 p-4">
                <p className="text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">{t("publication.title")}</p>
                <p className="mt-2 text-base font-medium text-foreground">
                  {blog.isPublished ? t("publication.published") : t("publication.draft")}
                </p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {blog.isPublished
                    ? t("publication.publishedDescription")
                    : t("publication.draftDescription")}
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-[1.6rem] border border-border/80 bg-white/70 p-5 md:p-6">
              <p className="text-[11px] font-semibold tracking-[0.22em] text-[--color-brand-muted] uppercase">
                {t("adminMetadata")}
              </p>
            <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <div className="rounded-[1.2rem] border border-border/70 bg-white/78 p-4">
                <p className="text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">{t("createdBy")}</p>
                <p className="mt-2 text-base font-medium text-foreground">{creatorName}</p>
              </div>
              <div className="rounded-[1.2rem] border border-border/70 bg-white/78 p-4">
                <p className="text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">{t("lifecycle.title")}</p>
                <p className="mt-2 text-base font-medium text-foreground">{deletedAtLabel}</p>
              </div>
              <div className="rounded-[1.2rem] border border-border/70 bg-white/78 p-4 md:col-span-2 xl:col-span-1">
                <p className="text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">{t("recordState.title")}</p>
                <p className="mt-2 text-base font-medium text-foreground">{blog.isActive ? t("recordState.active") : t("recordState.inactive")}</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {t("recordState.description")}
                </p>
              </div>
              <div className="rounded-[1.2rem] border border-border/70 bg-white/78 p-4 md:col-span-2 xl:col-span-3">
                <p className="text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">{t("timeline")}</p>
                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  <div>
                    <p className="text-xs text-muted-foreground">{t("createdAt")}</p>
                    <p className="mt-1 text-sm text-foreground">{formatDateTime(blog.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{t("updatedAt")}</p>
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
