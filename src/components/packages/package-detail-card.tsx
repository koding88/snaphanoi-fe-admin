import { useTranslations } from "next-intl";

import { AdminSurface } from "@/components/admin/admin-surface";
import { PackageStatusBadge } from "@/components/packages/package-status-badge";
import { ProjectCoverPreview } from "@/components/projects/project-cover-preview";
import type { PackageDetailRecord } from "@/features/packages/types/packages.types";
import {
  formatPackageDuration,
  formatPackagePrice,
} from "@/features/packages/utils/package-format";
import { formatCreatorDisplayName, formatDateTime } from "@/features/users/utils/users-format";

export function PackageDetailCard({ pkg }: { pkg: PackageDetailRecord }) {
  const t = useTranslations("packages.detailCard");
  const coverSizeKb = Math.max(1, Math.round(pkg.coverImage.size / 1024));
  const creatorName = formatCreatorDisplayName(pkg.createdBy.name);

  return (
    <AdminSurface className="overflow-hidden">
      <div className="grid gap-0 xl:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
        <div className="border-b border-border/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.28),rgba(245,239,230,0.82))] p-5 md:p-6 xl:border-r xl:border-b-0 xl:p-7">
          <ProjectCoverPreview
            src={pkg.coverImage.url}
            alt={pkg.name.en}
            className="shadow-[0_28px_58px_-38px_rgba(19,17,14,0.55)]"
            imageClassName="rounded-[1.35rem]"
          />
          <div className="mt-5 rounded-[1.5rem] border border-border/80 bg-white/78 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)]">
              <p className="text-[11px] font-semibold tracking-[0.22em] text-[--color-brand-muted] uppercase">
                {t("assetInfo")}
              </p>
            <p className="mt-3 text-base font-medium text-foreground">
              {pkg.coverImage.originalName}
            </p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div>
                  <p className="text-[11px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
                    {t("fileFormat")}
                  </p>
                <p className="mt-1 text-sm text-foreground">
                  {pkg.coverImage.mimeType}
                </p>
              </div>
              <div>
                  <p className="text-[11px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
                    {t("fileSize")}
                  </p>
                <p className="mt-1 text-sm text-foreground">{coverSizeKb} KB</p>
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-8 p-6 md:p-8 xl:p-10">
          <div className="flex flex-wrap items-center gap-2">
            <PackageStatusBadge isActive={pkg.isActive} deletedAt={pkg.deletedAt} />
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-[11px] font-semibold tracking-[0.24em] text-[--color-brand-muted] uppercase">
                {t("englishName")}
              </p>
              <h2 className="font-heading text-4xl leading-[0.95] tracking-[0.03em] text-foreground md:text-5xl xl:text-[4.25rem]">
                {pkg.name.en}
              </h2>
            </div>
          </div>

          <section className="space-y-4">
            <p className="text-[11px] font-semibold tracking-[0.24em] text-[--color-brand-muted] uppercase">
              {t("coreOfferInfo")}
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-[1.6rem] border border-border/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.78),rgba(248,244,237,0.94))] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.78)]">
                <p className="text-[11px] font-semibold tracking-[0.22em] text-[--color-brand-muted] uppercase">
                  {t("vietnameseName")}
                </p>
                <p className="mt-4 text-2xl leading-tight text-foreground">
                  {pkg.name.vi}
                </p>
              </div>
              <div className="rounded-[1.6rem] border border-border/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.78),rgba(248,244,237,0.94))] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.78)]">
                <p className="text-[11px] font-semibold tracking-[0.22em] text-[--color-brand-muted] uppercase">
                  {t("chineseName")}
                </p>
                <p className="mt-4 text-2xl leading-tight text-foreground">
                  {pkg.name.cn}
                </p>
              </div>
            </div>
            <div className="rounded-[1.6rem] border border-border/80 bg-white/76 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.74)]">
              <p className="text-[11px] font-semibold tracking-[0.22em] text-[--color-brand-muted] uppercase">
                {t("bestFor")}
              </p>
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                <div>
                    <p className="text-xs font-medium tracking-[0.16em] text-muted-foreground uppercase">
                      {t("english")}
                    </p>
                  <p className="mt-1 text-base leading-7 text-foreground">{pkg.bestFor.en}</p>
                </div>
                <div>
                    <p className="text-xs font-medium tracking-[0.16em] text-muted-foreground uppercase">
                      {t("vietnamese")}
                    </p>
                  <p className="mt-1 text-base leading-7 text-foreground">{pkg.bestFor.vi}</p>
                </div>
                <div>
                    <p className="text-xs font-medium tracking-[0.16em] text-muted-foreground uppercase">
                      {t("chinese")}
                    </p>
                  <p className="mt-1 text-base leading-7 text-foreground">{pkg.bestFor.cn}</p>
                </div>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <div className="rounded-[1.5rem] border border-border/80 bg-white/76 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.74)]">
                <p className="text-[11px] font-semibold tracking-[0.22em] text-[--color-brand-muted] uppercase">
                  {t("duration")}
                </p>
                <p className="mt-3 text-xl font-medium text-foreground">
                  {formatPackageDuration(pkg.duration)}
                </p>
              </div>
              <div className="rounded-[1.5rem] border border-border/80 bg-white/76 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.74)]">
                <p className="text-[11px] font-semibold tracking-[0.22em] text-[--color-brand-muted] uppercase">
                  {t("photoCount")}
                </p>
                <p className="mt-3 text-xl font-medium text-foreground">
                  {pkg.photoCount}
                </p>
              </div>
              <div className="rounded-[1.5rem] border border-border/80 bg-white/76 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.74)] md:col-span-2 xl:col-span-1">
                <p className="text-[11px] font-semibold tracking-[0.22em] text-[--color-brand-muted] uppercase">
                  {t("pricing")}
                </p>
                <p className="mt-3 text-xl font-medium text-foreground">
                  {formatPackagePrice(pkg.pricing)}
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <p className="text-[11px] font-semibold tracking-[0.24em] text-[--color-brand-muted] uppercase">
              {t("metaInfo")}
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-[1.5rem] border border-border/70 bg-white/60 p-5">
                <p className="text-[11px] font-semibold tracking-[0.22em] text-[--color-brand-muted] uppercase">
                  {t("createdBy")}
                </p>
                <p className="mt-3 text-xl font-medium text-foreground">
                  {creatorName}
                </p>
              </div>
              <div className="rounded-[1.5rem] border border-border/70 bg-white/60 p-5">
                <p className="text-[11px] font-semibold tracking-[0.22em] text-[--color-brand-muted] uppercase">
                  {t("timeline")}
                </p>
                <div className="mt-3 space-y-3">
                  <div>
                    <p className="text-xs font-medium tracking-[0.16em] text-muted-foreground uppercase">
                      {t("created")}
                    </p>
                    <p className="mt-1 text-base text-foreground">
                      {formatDateTime(pkg.createdAt)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium tracking-[0.16em] text-muted-foreground uppercase">
                      {t("updated")}
                    </p>
                    <p className="mt-1 text-base text-foreground">
                      {formatDateTime(pkg.updatedAt)}
                    </p>
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
