import { useTranslations } from "next-intl";

import { AdminSurface } from "@/components/admin/admin-surface";
import { GalleryStatusBadge } from "@/components/galleries/gallery-status-badge";
import type { GalleryRecord } from "@/features/galleries/types/galleries.types";
import { formatCreatorDisplayName, formatDateTime } from "@/features/users/utils/users-format";

export function GalleryDetailCard({ gallery }: { gallery: GalleryRecord }) {
  const t = useTranslations("galleries.detailCard");
  const lifecycleState = gallery.deletedAt
    ? t("lifecycle.archivedOn", { date: formatDateTime(gallery.deletedAt) })
    : gallery.isActive
      ? t("lifecycle.active")
      : t("lifecycle.inactive");
  const deletedAtLabel = gallery.deletedAt ? formatDateTime(gallery.deletedAt) : t("lifecycle.notDeleted");

  return (
    <AdminSurface className="p-6 md:p-8 xl:p-10">
      <div className="space-y-8">
        <section className="rounded-[1.7rem] border border-border/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.86),rgba(248,244,237,0.92))] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.78)] md:p-6">
          <div className="flex flex-wrap items-center gap-2">
            <GalleryStatusBadge
              isActive={gallery.isActive}
              deletedAt={gallery.deletedAt}
            />
            <span className="rounded-full border border-border/75 bg-white/80 px-3 py-1 text-[11px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
              {lifecycleState}
            </span>
          </div>
          <div className="mt-4 space-y-2">
            <p className="text-[11px] font-semibold tracking-[0.22em] text-[--color-brand-muted] uppercase">
              {t("sections.record")}
            </p>
            <h2 className="font-heading text-4xl leading-tight tracking-[0.04em] text-foreground md:text-5xl">
              {gallery.name.en}
            </h2>
            <p className="text-sm text-muted-foreground">{t("id", { id: gallery.id })}</p>
          </div>
        </section>

        <section className="rounded-[1.6rem] border border-border/80 bg-white/76 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.76)] md:p-6">
          <p className="text-[11px] font-semibold tracking-[0.22em] text-[--color-brand-muted] uppercase">
            {t("sections.names")}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {t("namesDescription")}
          </p>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <div className="rounded-[1.2rem] border border-border/70 bg-white/82 p-4">
              <p className="text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">{t("fields.english")}</p>
              <p className="mt-2 text-lg font-medium text-foreground">{gallery.name.en}</p>
            </div>
            <div className="rounded-[1.2rem] border border-border/70 bg-white/82 p-4">
              <p className="text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">{t("fields.vietnamese")}</p>
              <p className="mt-2 text-lg font-medium text-foreground">{gallery.name.vi}</p>
            </div>
            <div className="rounded-[1.2rem] border border-border/70 bg-white/82 p-4">
              <p className="text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">{t("fields.chinese")}</p>
              <p className="mt-2 text-lg font-medium text-foreground">{gallery.name.cn}</p>
            </div>
          </div>
        </section>

        <section className="rounded-[1.6rem] border border-border/80 bg-white/70 p-5 md:p-6">
          <p className="text-[11px] font-semibold tracking-[0.22em] text-[--color-brand-muted] uppercase">
            {t("sections.metadata")}
          </p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="rounded-[1.2rem] border border-border/70 bg-white/78 p-4">
              <p className="text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">{t("fields.createdBy")}</p>
              <p className="mt-2 text-base font-medium text-foreground">{formatCreatorDisplayName(gallery.createdBy.name)}</p>
            </div>
            <div className="rounded-[1.2rem] border border-border/70 bg-white/78 p-4">
              <p className="text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">{t("fields.lifecycle")}</p>
              <p className="mt-2 text-base font-medium text-foreground">{deletedAtLabel}</p>
            </div>
            <div className="rounded-[1.2rem] border border-border/70 bg-white/78 p-4 md:col-span-2">
              <p className="text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">{t("fields.timeline")}</p>
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                <div>
                  <p className="text-xs text-muted-foreground">{t("fields.createdAt")}</p>
                  <p className="mt-1 text-sm text-foreground">{formatDateTime(gallery.createdAt)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{t("fields.updatedAt")}</p>
                  <p className="mt-1 text-sm text-foreground">{formatDateTime(gallery.updatedAt)}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </AdminSurface>
  );
}
