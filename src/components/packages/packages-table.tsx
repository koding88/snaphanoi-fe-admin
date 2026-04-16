"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type KeyboardEvent, type MouseEvent, useState } from "react";
import { useTranslations } from "next-intl";
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
import { formatDateOnly } from "@/features/users/utils/users-format";
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
  const t = useTranslations("packages.table");
  const router = useRouter();
  const columnLayout =
    "grid-cols-[minmax(0,1fr)_auto] md:grid-cols-[minmax(190px,1.15fr)_150px_104px_112px] xl:grid-cols-[minmax(190px,1.15fr)_108px_minmax(160px,0.95fr)_150px_104px_112px_112px]";
  const [pendingAction, setPendingAction] = useState<{
    type: "delete" | "restore";
    pkg: PackageRecord;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        <div className="border-b border-border/70 bg-white/56 px-5 py-3">
            <p className="text-xs font-semibold tracking-[0.22em] text-[--color-brand-muted] uppercase">
            {t("title")}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {t("description")}
          </p>
        </div>
        <div className="overflow-x-auto border-t border-border/10">
          <div
            className={cn(
              "hidden items-center gap-x-2.5 border-b border-border/80 bg-white/55 px-5 py-3.5 text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase md:grid md:min-w-[700px] xl:min-w-[940px]",
              columnLayout,
            )}
          >
            <div>{t("columns.package")}</div>
            <div className="hidden text-center xl:block">{t("columns.cover")}</div>
            <div className="hidden pl-4 xl:block">{t("columns.bestFor")}</div>
            <div>{t("columns.offer")}</div>
            <div className="text-center">{t("columns.status")}</div>
            <div className="hidden text-center xl:block">{t("columns.updated")}</div>
            <div className="bg-inherit py-4 text-center md:sticky md:right-0 md:z-20">
              {t("columns.actions")}
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
                  "group grid cursor-pointer items-center gap-x-2.5 border-b border-border/60 px-4 py-3 transition-[background-color,box-shadow] hover:bg-white/60 focus-visible:bg-white/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-brand]/30 last:border-b-0 md:min-w-[700px] md:px-5 md:py-4 xl:min-w-[940px]",
                  columnLayout,
                )}
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-foreground">
                    {pkg.name.en}
                  </p>
                  <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
                    <p className="truncate"><span className="font-semibold tracking-[0.14em] uppercase">VI</span> {pkg.name.vi}</p>
                    <p className="truncate"><span className="font-semibold tracking-[0.14em] uppercase">CN</span> {pkg.name.cn}</p>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground md:hidden">
                    {formatPackageDuration(pkg.duration)} · {t("offerPhotos", { count: pkg.photoCount })}
                  </p>
                  <p className="text-xs font-semibold text-foreground md:hidden">{formatPackagePrice(pkg.pricing)}</p>
                  <div className="mt-2 md:hidden">
                    <PackageStatusBadge
                      isActive={pkg.isActive}
                      deletedAt={pkg.deletedAt}
                    />
                  </div>
                </div>
                <div className="hidden justify-center xl:flex">
                  <div className="overflow-hidden rounded-2xl border border-border/80 bg-muted/40 shadow-[0_12px_30px_-24px_rgba(32,24,18,0.45)]">
                    {/* Package list thumbnails use backend storage URLs directly and stay intentionally unoptimized here. */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={pkg.coverImage.url}
                      alt={pkg.name.en}
                      className="block h-[64px] w-[84px] object-cover"
                    />
                  </div>
                </div>
                <div className="hidden min-w-0 pl-4 text-sm text-muted-foreground xl:block">
                  <p className="truncate" title={getPackageBestForSummary(pkg.bestFor)}>
                    {getPackageBestForSummary(pkg.bestFor)}
                  </p>
                </div>
                <div className="hidden min-w-0 md:block">
                  <p className="text-[13px] font-medium text-muted-foreground">
                    {formatPackageDuration(pkg.duration)} · {t("offerPhotos", { count: pkg.photoCount })}
                  </p>
                  <p className="mt-1.5 truncate text-lg font-semibold tracking-tight text-foreground">
                    {formatPackagePrice(pkg.pricing)}
                  </p>
                </div>
                <div className="hidden justify-center md:flex">
                  <PackageStatusBadge
                    isActive={pkg.isActive}
                    deletedAt={pkg.deletedAt}
                  />
                </div>
                <div className="hidden text-center text-[13px] text-muted-foreground xl:block">
                  <p className="leading-relaxed">{formatDateOnly(pkg.updatedAt)}</p>
                </div>
                <div className="self-stretch bg-inherit py-2 text-center md:sticky md:right-0 md:z-10">
                  <div
                    className="grid h-full content-center justify-items-center gap-1.5"
                    onClick={stopRowAction}
                    onKeyDown={stopRowAction}
                  >
                    <Link
                      href={ROUTES.admin.packages.edit(pkg.id)}
                      className={cn(
                        buttonVariants({ variant: "outline", size: "sm" }),
                         "h-8 w-[86px] px-2 text-xs md:w-[96px]",
                      )}
                      onClick={stopRowAction}
                    >
                        <FontAwesomeIcon icon={faUserPen} />
                        {t("actions.edit")}
                      </Link>
                    {pkg.deletedAt ? (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                         className="h-8 w-[86px] px-2 text-xs md:w-[96px]"
                        disabled={isBusy}
                        onClick={(event) => {
                          stopRowAction(event);
                          setPendingAction({ type: "restore", pkg });
                        }}
                      >
                        <FontAwesomeIcon icon={faRotateLeft} />
                        {t("actions.restore")}
                      </Button>
                    ) : (
                      <Button
                        type="button"
                         variant="outline"
                         size="sm"
                         className="h-8 w-[86px] border-red-200 px-2 text-xs text-red-700 hover:bg-red-50 hover:text-red-800 md:w-[96px]"
                         disabled={isBusy}
                        onClick={(event) => {
                          stopRowAction(event);
                          setPendingAction({ type: "delete", pkg });
                        }}
                      >
                        <FontAwesomeIcon icon={faTrashCan} />
                        {t("actions.delete")}
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
            ? t("dialogs.deleteTitle", { name: pendingAction.pkg.name.en })
            : t("dialogs.restoreTitle", { name: pendingAction?.pkg.name.en ?? "" })
        }
        description={
          pendingAction?.type === "delete"
            ? t("dialogs.deleteDescription")
            : t("dialogs.restoreDescription")
        }
        confirmLabel={
          pendingAction?.type === "delete"
            ? t("dialogs.deleteConfirm")
            : t("dialogs.restoreConfirm")
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
                {t("dialogs.selected")}
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
