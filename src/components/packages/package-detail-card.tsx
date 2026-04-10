import { AdminSurface } from "@/components/admin/admin-surface";
import { PackageStatusBadge } from "@/components/packages/package-status-badge";
import { ProjectCoverPreview } from "@/components/projects/project-cover-preview";
import type { PackageDetailRecord } from "@/features/packages/types/packages.types";
import {
  formatPackageDuration,
  formatPackagePrice,
} from "@/features/packages/utils/package-format";
import { formatDateTime } from "@/features/users/utils/users-format";

export function PackageDetailCard({ pkg }: { pkg: PackageDetailRecord }) {
  const coverSizeKb = Math.max(1, Math.round(pkg.coverImage.size / 1024));

  return (
    <AdminSurface className="overflow-hidden">
      <div className="grid gap-0 xl:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
        <div className="border-b border-border/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.28),rgba(245,239,230,0.82))] p-5 md:p-6 xl:border-r xl:border-b-0 xl:p-7">
          <ProjectCoverPreview
            src={pkg.coverImage.url}
            alt={pkg.name.en}
            imageClassName="rounded-[1.35rem]"
          />
          <div className="mt-4 flex items-center justify-between gap-3 rounded-[1.3rem] border border-border/70 bg-white/72 px-4 py-3">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.22em] text-[--color-brand-muted] uppercase">
                Cover asset
              </p>
              <p className="mt-1 text-base font-medium text-foreground">
                {pkg.coverImage.originalName}
              </p>
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
              <p className="mt-3 text-base font-medium text-foreground">
                {pkg.coverImage.mimeType}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Backend-managed cover asset ready for package cards and customer-facing package surfaces.
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-border/80 bg-white/78 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)]">
              <p className="text-[11px] font-semibold tracking-[0.22em] text-[--color-brand-muted] uppercase">
                Offer snapshot
              </p>
              <p className="mt-3 text-base font-medium text-foreground">
                {formatPackagePrice(pkg.pricing)}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {pkg.photoCount} photos · {formatPackageDuration(pkg.duration)}
              </p>
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
                English package name
              </p>
              <h2 className="font-heading text-4xl leading-[0.95] tracking-[0.03em] text-foreground md:text-5xl xl:text-[4.25rem]">
                {pkg.name.en}
              </h2>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
              <span>Created by {pkg.createdBy.name}</span>
              <span>Updated {formatDateTime(pkg.updatedAt)}</span>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-[1.6rem] border border-border/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.78),rgba(248,244,237,0.94))] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.78)]">
              <p className="text-[11px] font-semibold tracking-[0.22em] text-[--color-brand-muted] uppercase">
                Vietnamese package name
              </p>
              <p className="mt-4 text-2xl leading-tight text-foreground">
                {pkg.name.vi}
              </p>
            </div>
            <div className="rounded-[1.6rem] border border-border/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.78),rgba(248,244,237,0.94))] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.78)]">
              <p className="text-[11px] font-semibold tracking-[0.22em] text-[--color-brand-muted] uppercase">
                Chinese package name
              </p>
              <p className="mt-4 text-2xl leading-tight text-foreground">
                {pkg.name.cn}
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-[1.6rem] border border-border/80 bg-white/76 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.74)]">
              <p className="text-[11px] font-semibold tracking-[0.22em] text-[--color-brand-muted] uppercase">
                Best for (English)
              </p>
              <p className="mt-4 text-lg leading-8 text-foreground">{pkg.bestFor.en}</p>
            </div>
            <div className="rounded-[1.6rem] border border-border/80 bg-white/76 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.74)]">
              <p className="text-[11px] font-semibold tracking-[0.22em] text-[--color-brand-muted] uppercase">
                Best for (Vietnamese)
              </p>
              <p className="mt-4 text-lg leading-8 text-foreground">{pkg.bestFor.vi}</p>
            </div>
            <div className="rounded-[1.6rem] border border-border/80 bg-white/76 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.74)] md:col-span-2">
              <p className="text-[11px] font-semibold tracking-[0.22em] text-[--color-brand-muted] uppercase">
                Best for (Chinese)
              </p>
              <p className="mt-4 text-lg leading-8 text-foreground">{pkg.bestFor.cn}</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-[1.5rem] border border-border/80 bg-white/76 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.74)]">
              <p className="text-[11px] font-semibold tracking-[0.22em] text-[--color-brand-muted] uppercase">
                Duration
              </p>
              <p className="mt-3 text-xl font-medium text-foreground">
                {formatPackageDuration(pkg.duration)}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Stored as {pkg.duration} seconds in the backend payload.
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-border/80 bg-white/76 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.74)]">
              <p className="text-[11px] font-semibold tracking-[0.22em] text-[--color-brand-muted] uppercase">
                Photo count
              </p>
              <p className="mt-3 text-xl font-medium text-foreground">
                {pkg.photoCount}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Raw count kept intact for package comparisons and public package cards.
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-border/80 bg-white/76 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.74)]">
              <p className="text-[11px] font-semibold tracking-[0.22em] text-[--color-brand-muted] uppercase">
                Pricing
              </p>
              <p className="mt-3 text-xl font-medium text-foreground">
                {formatPackagePrice(pkg.pricing)}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Raw payload: {pkg.pricing.amount} {pkg.pricing.currency}
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-border/80 bg-white/76 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.74)]">
              <p className="text-[11px] font-semibold tracking-[0.22em] text-[--color-brand-muted] uppercase">
                Created by
              </p>
              <p className="mt-3 text-xl font-medium text-foreground">
                {pkg.createdBy.name}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Ownership stays visible here without exposing internal identifiers.
              </p>
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-border/80 bg-white/76 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.74)]">
            <p className="text-[11px] font-semibold tracking-[0.22em] text-[--color-brand-muted] uppercase">
              Timeline
            </p>
            <div className="mt-3 grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-xs font-medium tracking-[0.16em] text-muted-foreground uppercase">
                  Created
                </p>
                <p className="mt-1 text-base text-foreground">
                  {formatDateTime(pkg.createdAt)}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium tracking-[0.16em] text-muted-foreground uppercase">
                  Updated
                </p>
                <p className="mt-1 text-base text-foreground">
                  {formatDateTime(pkg.updatedAt)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminSurface>
  );
}
