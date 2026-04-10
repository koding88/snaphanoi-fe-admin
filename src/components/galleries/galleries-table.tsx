"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type KeyboardEvent, type MouseEvent, useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { GalleryStatusBadge } from "@/components/galleries/gallery-status-badge";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import type { GalleryRecord } from "@/features/galleries/types/galleries.types";
import { formatDateOnly } from "@/features/users/utils/users-format";
import { ROUTES } from "@/lib/constants/routes";
import { faRotateLeft, faTrashCan, faUserPen } from "@/lib/icons/fa";
import { cn } from "@/lib/utils";

type GalleriesTableProps = {
  galleries: GalleryRecord[];
  isBusy?: boolean;
  onDelete: (gallery: GalleryRecord) => Promise<void>;
  onRestore: (gallery: GalleryRecord) => Promise<void>;
};

export function GalleriesTable({ galleries, isBusy = false, onDelete, onRestore }: GalleriesTableProps) {
  const router = useRouter();
  const [pendingAction, setPendingAction] = useState<{
    type: "delete" | "restore";
    gallery: GalleryRecord;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleRowActionClick = (event: MouseEvent | KeyboardEvent) => {
    event.stopPropagation();
  };

  function navigateToGallery(galleryId: string) {
    router.push(ROUTES.admin.galleries.detail(galleryId));
  }

  async function handleConfirm() {
    if (!pendingAction) {
      return;
    }

    setIsSubmitting(true);
    try {
      if (pendingAction.type === "delete") {
        await onDelete(pendingAction.gallery);
      } else {
        await onRestore(pendingAction.gallery);
      }
      setPendingAction(null);
    } catch {
      // Parent page shows mutation errors.
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <div className="surface-enter overflow-hidden rounded-[2rem] border border-border/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(248,244,237,0.88))] shadow-soft">
        <div className="border-b border-border/70 bg-white/56 px-5 py-4">
          <p className="text-xs font-semibold tracking-[0.22em] text-[--color-brand-muted] uppercase">
            Gallery records
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Keep multilingual naming and lifecycle actions visible in one admin table.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-[860px] w-full table-fixed text-left">
            <thead className="border-b border-border/80 bg-white/55">
              <tr className="text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                <th className="w-[42%] px-5 py-4">Gallery</th>
                <th className="w-[18%] px-5 py-4">Created by</th>
                <th className="w-[14%] px-5 py-4">Updated</th>
                <th className="w-[12%] px-5 py-4">Status</th>
                <th className="w-[14%] px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {galleries.map((gallery) => (
                <tr
                  key={gallery.id}
                  role="link"
                  tabIndex={0}
                  onClick={() => navigateToGallery(gallery.id)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      navigateToGallery(gallery.id);
                    }
                  }}
                  className="cursor-pointer border-b border-border/60 transition-[background-color,box-shadow] hover:bg-white/60 focus-visible:bg-white/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-brand]/30 last:border-b-0"
                >
                  <td className="align-middle px-5 py-5">
                    <p className="font-medium text-foreground">{gallery.name.en}</p>
                    <div className="space-y-0.5 text-xs text-muted-foreground">
                      <p className="truncate">VI: {gallery.name.vi}</p>
                      <p className="truncate">CN: {gallery.name.cn}</p>
                    </div>
                  </td>
                  <td className="align-middle px-5 py-5 text-sm text-muted-foreground">{gallery.createdBy.name}</td>
                  <td className="align-middle px-5 py-5 text-sm text-muted-foreground">{formatDateOnly(gallery.updatedAt)}</td>
                  <td className="align-middle px-5 py-5">
                    <GalleryStatusBadge isActive={gallery.isActive} deletedAt={gallery.deletedAt} />
                  </td>
                  <td className="align-middle px-5 py-5">
                    <div
                      className="flex flex-wrap justify-end gap-2"
                      onClick={handleRowActionClick}
                      onKeyDown={handleRowActionClick}
                    >
                      <Link
                        href={ROUTES.admin.galleries.edit(gallery.id)}
                        className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
                        onClick={handleRowActionClick}
                      >
                        <FontAwesomeIcon icon={faUserPen} />
                        Edit
                      </Link>
                      {gallery.deletedAt ? (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          disabled={isBusy}
                          onClick={(event) => {
                            handleRowActionClick(event);
                            setPendingAction({ type: "restore", gallery });
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
                          disabled={isBusy}
                          onClick={(event) => {
                            handleRowActionClick(event);
                            setPendingAction({ type: "delete", gallery });
                          }}
                        >
                          <FontAwesomeIcon icon={faTrashCan} />
                          Delete
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <ConfirmDialog
        open={Boolean(pendingAction)}
        title={
          pendingAction?.type === "delete"
            ? `Delete ${pendingAction.gallery.name.en}?`
            : `Restore ${pendingAction?.gallery.name.en}?`
        }
        description={
          pendingAction?.type === "delete"
            ? "This archives the gallery. You can restore it later if needed."
            : "This restores the archived gallery into the active collection."
        }
        confirmLabel={pendingAction?.type === "delete" ? "Delete gallery" : "Restore gallery"}
        confirmVariant={pendingAction?.type === "delete" ? "destructive" : "default"}
        isSubmitting={isSubmitting}
        onCancel={() => setPendingAction(null)}
        onConfirm={handleConfirm}
        extra={
          pendingAction ? (
            <div className="space-y-1">
              <p className="text-xs font-semibold tracking-[0.16em] text-[--color-brand-muted] uppercase">
                Selected gallery
              </p>
              <p className="text-sm font-medium text-foreground">{pendingAction.gallery.name.en}</p>
              <p className="text-sm text-muted-foreground">{pendingAction.gallery.createdBy.name}</p>
            </div>
          ) : null
        }
      />
    </>
  );
}
