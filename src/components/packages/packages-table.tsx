"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type KeyboardEvent, type MouseEvent, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { PackageStatusBadge } from "@/components/packages/package-status-badge";
import type { PackageRecord } from "@/features/packages/types/packages.types";
import {
  formatPackageDuration,
  formatPackagePrice,
  getPackageBestForSummary,
} from "@/features/packages/utils/package-format";
import { ROUTES } from "@/lib/constants/routes";
import { faRotateLeft, faTrashCan, faUserPen } from "@/lib/icons/fa";
import { cn } from "@/lib/utils";

type PackagesTableProps = {
  packages: PackageRecord[];
  isBusy?: boolean;
  onDelete: (pkg: PackageRecord) => Promise<void>;
  onRestore: (pkg: PackageRecord) => Promise<void>;
};

export function PackagesTable({
  packages,
  isBusy = false,
  onDelete,
  onRestore,
}: PackagesTableProps) {
  const router = useRouter();
  const columnLayout =
    "grid-cols-[minmax(210px,1.2fr)_92px_minmax(165px,1fr)_minmax(170px,0.9fr)_114px_116px_116px]";
  const [pendingAction, setPendingAction] = useState<{
    type: "delete" | "restore";
    pkg: PackageRecord;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatUpdatedAt = (value: string) => {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "N/A";
    }

    const now = new Date();
    const isSameYear = now.getFullYear() === date.getFullYear();

    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      ...(isSameYear ? {} : { year: "numeric" }),
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  function navigateToPackage(packageId: string) {
    router.push(ROUTES.admin.packages.detail(packageId));
  }

  const stopRowAction = (event: MouseEvent | KeyboardEvent) => {
    event.stopPropagation();
  };

  async function handleConfirm() {
    if (!pendingAction) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (pendingAction.type === "delete") {
        await onDelete(pendingAction.pkg);
      } else {
        await onRestore(pendingAction.pkg);
      }

      setPendingAction(null);
    } catch {
      // Parent page owns mutation feedback.
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <div className="surface-enter overflow-hidden rounded-[2rem] border border-border/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(248,244,237,0.88))] shadow-soft">
        <div className="border-b border-border/70 bg-white/56 px-5 py-4">
          <p className="text-xs font-semibold tracking-[0.22em] text-[--color-brand-muted] uppercase">
            Package records
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Review package positioning, pricing, and lifecycle from one place.
          </p>
        </div>
        <div className="overflow-x-auto border-t border-border/10">
          <div
            className={cn(
              "grid min-w-[1030px] items-center gap-x-3 border-b border-border/80 bg-white/55 px-5 py-4 text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase",
              columnLayout,
            )}
          >
            <div>Package</div>
            <div className="text-center">Cover</div>
            <div>Best for</div>
            <div>Offer</div>
            <div className="text-center">Status</div>
            <div className="text-center">Updated</div>
            <div className="sticky right-0 z-20 -mr-5 bg-[linear-gradient(90deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.7)_40%,rgba(255,255,255,0.9)_100%)] py-4 pr-5 text-center">
              Actions
            </div>
          </div>
          <div>
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                role="link"
                tabIndex={0}
                onClick={() => navigateToPackage(pkg.id)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    navigateToPackage(pkg.id);
                  }
                }}
                className={cn(
                  "grid min-w-[1030px] cursor-pointer items-center gap-x-3 border-b border-border/60 px-5 py-4.5 transition-[background-color,box-shadow] hover:bg-white/60 focus-visible:bg-white/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-brand]/30 last:border-b-0",
                  columnLayout,
                )}
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-foreground">
                    {pkg.name.en}
                  </p>
                  <div className="mt-1 space-y-0.5 text-xs text-muted-foreground">
                    <p className="truncate">VI: {pkg.name.vi}</p>
                    <p className="truncate">CN: {pkg.name.cn}</p>
                  </div>
                </div>
                <div className="flex justify-center">
                  <div className="overflow-hidden rounded-2xl border border-border/80 bg-muted/40 shadow-[0_12px_30px_-24px_rgba(32,24,18,0.45)]">
                    {/* Package list thumbnails use backend storage URLs directly and stay intentionally unoptimized here. */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={pkg.coverImage.url}
                      alt={pkg.name.en}
                      className="block h-[70px] w-[92px] object-cover"
                    />
                  </div>
                </div>
                <div className="min-w-0 text-sm text-muted-foreground">
                  <p className="truncate" title={getPackageBestForSummary(pkg.bestFor)}>
                    {getPackageBestForSummary(pkg.bestFor)}
                  </p>
                </div>
                <div className="min-w-0">
                  <p className="text-[13px] font-medium text-muted-foreground">
                    {formatPackageDuration(pkg.duration)} · {pkg.photoCount} photos
                  </p>
                  <p className="mt-1.5 truncate text-lg font-semibold tracking-tight text-foreground">
                    {formatPackagePrice(pkg.pricing)}
                  </p>
                </div>
                <div className="flex justify-center">
                  <PackageStatusBadge
                    isActive={pkg.isActive}
                    deletedAt={pkg.deletedAt}
                  />
                </div>
                <div className="text-center text-[13px] text-muted-foreground">
                  <p className="leading-relaxed">{formatUpdatedAt(pkg.updatedAt)}</p>
                </div>
                <div className="sticky right-0 z-10 -mr-5 self-stretch bg-[linear-gradient(90deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.7)_40%,rgba(255,255,255,0.9)_100%)] py-2 pr-5 text-center">
                  <div
                    className="grid h-full content-center justify-items-center gap-1.5"
                    onClick={stopRowAction}
                    onKeyDown={stopRowAction}
                  >
                    <Link
                      href={ROUTES.admin.packages.edit(pkg.id)}
                      className={cn(
                        buttonVariants({ variant: "outline", size: "sm" }),
                        "h-8 px-2.5 text-xs",
                      )}
                      onClick={stopRowAction}
                    >
                      <FontAwesomeIcon icon={faUserPen} />
                      Edit
                    </Link>
                    {pkg.deletedAt ? (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-8 px-2.5 text-xs"
                        disabled={isBusy}
                        onClick={(event) => {
                          stopRowAction(event);
                          setPendingAction({ type: "restore", pkg });
                        }}
                      >
                        <FontAwesomeIcon icon={faRotateLeft} />
                        Restore
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="h-8 px-2.5 text-xs"
                        disabled={isBusy}
                        onClick={(event) => {
                          stopRowAction(event);
                          setPendingAction({ type: "delete", pkg });
                        }}
                      >
                        <FontAwesomeIcon icon={faTrashCan} />
                        Delete
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <ConfirmDialog
        open={Boolean(pendingAction)}
        title={
          pendingAction?.type === "delete"
            ? `Delete ${pendingAction.pkg.name.en}?`
            : `Restore ${pendingAction?.pkg.name.en}?`
        }
        description={
          pendingAction?.type === "delete"
            ? "This archives the package for now. You can restore it later if needed."
            : "This restores the archived package to the active offer library."
        }
        confirmLabel={
          pendingAction?.type === "delete"
            ? "Delete package"
            : "Restore package"
        }
        confirmVariant={
          pendingAction?.type === "delete" ? "destructive" : "default"
        }
        isSubmitting={isSubmitting}
        onCancel={() => setPendingAction(null)}
        onConfirm={handleConfirm}
        extra={
          pendingAction ? (
            <div className="space-y-1">
              <p className="text-xs font-semibold tracking-[0.16em] text-[--color-brand-muted] uppercase">
                Selected package
              </p>
              <p className="text-sm font-medium text-foreground">
                {pendingAction.pkg.name.en}
              </p>
              <p className="text-sm text-muted-foreground">
                {formatPackagePrice(pendingAction.pkg.pricing)}
              </p>
            </div>
          ) : null
        }
      />
    </>
  );
}
