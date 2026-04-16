"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type KeyboardEvent, type MouseEvent, useState } from "react";
import { useTranslations } from "next-intl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { BlogPinBadge } from "@/components/blogs/blog-pin-badge";
import { BlogPublishBadge } from "@/components/blogs/blog-publish-badge";
import { BlogStatusBadge } from "@/components/blogs/blog-status-badge";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import type { BlogRecord } from "@/features/blogs/types/blogs.types";
import { formatCreatorDisplayName, formatDateOnly } from "@/features/users/utils/users-format";
import { ROUTES } from "@/lib/constants/routes";
import { faRotateLeft, faTrashCan, faUserPen } from "@/lib/icons/fa";
import { cn } from "@/lib/utils";

type BlogsTableProps = {
  blogs: BlogRecord[];
  isBusy?: boolean;
  onDelete: (blog: BlogRecord) => Promise<void>;
  onRestore: (blog: BlogRecord) => Promise<void>;
};

export function BlogsTable({ blogs, isBusy = false, onDelete, onRestore }: BlogsTableProps) {
  const t = useTranslations("blogs.table");
  const router = useRouter();
  const columnLayout =
    "grid-cols-[minmax(0,1fr)_auto] md:grid-cols-[minmax(220px,1.2fr)_104px_104px_112px_112px] xl:grid-cols-[minmax(220px,1.2fr)_112px_96px_104px_104px_112px_112px]";
  const [pendingAction, setPendingAction] = useState<{
    type: "delete" | "restore";
    blog: BlogRecord;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRowActionClick = (event: MouseEvent | KeyboardEvent) => {
    event.stopPropagation();
  };

  function navigateToBlog(blogId: string) {
    router.push(ROUTES.admin.blogs.detail(blogId));
  }

  async function handleConfirm() {
    if (!pendingAction) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (pendingAction.type === "delete") {
        await onDelete(pendingAction.blog);
      } else {
        await onRestore(pendingAction.blog);
      }

      setPendingAction(null);
    } catch {
      // Parent page owns the mutation toast.
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
        <div className="border-t border-border/10">
          <div
            className={cn(
              "hidden items-center gap-x-3 border-b border-border/80 bg-white/55 px-5 py-3.5 text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase md:grid md:min-w-[720px] xl:min-w-[980px]",
              columnLayout,
            )}
          >
            <div>{t("columns.blog")}</div>
            <div className="hidden text-center xl:block">{t("columns.cover")}</div>
            <div className="hidden text-center xl:block">{t("columns.pin")}</div>
            <div className="text-center">{t("columns.publish")}</div>
            <div className="text-center">{t("columns.status")}</div>
            <div className="text-center">{t("columns.updated")}</div>
            <div className="text-center">{t("columns.actions")}</div>
          </div>
          <div>
            {blogs.map((blog) => (
              <div
                key={blog.id}
                role="link"
                tabIndex={0}
                onClick={() => navigateToBlog(blog.id)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    navigateToBlog(blog.id);
                  }
                }}
                className={cn(
                  "grid cursor-pointer items-center gap-x-3 border-b border-border/60 px-4 py-3 transition-[background-color,box-shadow] hover:bg-white/60 focus-visible:bg-white/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-brand]/30 last:border-b-0 md:min-w-[720px] md:px-5 md:py-4 xl:min-w-[980px]",
                  columnLayout,
                )}
              >
                <div className="space-y-1">
                  <p className="truncate font-medium text-foreground">{blog.name}</p>
                  <p className="text-sm text-muted-foreground">{t("by", { name: formatCreatorDisplayName(blog.createdBy.name) })}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-1.5 md:hidden">
                    <BlogPinBadge isPinned={blog.isPinned} />
                    <BlogPublishBadge isPublished={blog.isPublished} />
                    <BlogStatusBadge isActive={blog.isActive} deletedAt={blog.deletedAt} />
                  </div>
                </div>
                <div className="hidden justify-center xl:flex">
                  <div className="overflow-hidden rounded-2xl border border-border/80 bg-muted/40 shadow-[0_12px_30px_-24px_rgba(32,24,18,0.45)]">
                    {/* Table thumbnails use backend storage URLs directly and stay intentionally unoptimized here. */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={blog.coverImage.url} alt={blog.name} className="block h-16 w-24 object-cover" />
                  </div>
                </div>
                <div className="hidden justify-center xl:flex">
                  <BlogPinBadge isPinned={blog.isPinned} />
                </div>
                <div className="hidden justify-center md:flex">
                  <BlogPublishBadge isPublished={blog.isPublished} />
                </div>
                <div className="hidden justify-center md:flex">
                  <BlogStatusBadge isActive={blog.isActive} deletedAt={blog.deletedAt} />
                </div>
                <div className="hidden text-center text-sm text-muted-foreground md:block">
                  <p className="leading-relaxed">{formatDateOnly(blog.updatedAt)}</p>
                </div>
                <div className="text-center">
                  <div className="grid justify-items-center gap-2" onClick={handleRowActionClick} onKeyDown={handleRowActionClick}>
                    <Link
                      href={ROUTES.admin.blogs.edit(blog.id)}
                      className={cn(
                        buttonVariants({ variant: "outline", size: "sm" }),
                         "h-8 w-[86px] px-2 text-xs md:w-[96px]",
                      )}
                      onClick={handleRowActionClick}
                    >
                      <FontAwesomeIcon icon={faUserPen} />
                      {t("actions.edit")}
                    </Link>
                    {blog.deletedAt ? (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                         className="h-8 w-[86px] px-2 text-xs md:w-[96px]"
                        disabled={isBusy}
                        onClick={(event) => {
                          handleRowActionClick(event);
                          setPendingAction({ type: "restore", blog });
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
                          handleRowActionClick(event);
                          setPendingAction({ type: "delete", blog });
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
            ? t("dialogs.deleteTitle", { name: pendingAction?.blog.name ?? "" })
            : t("dialogs.restoreTitle", { name: pendingAction?.blog.name ?? "" })
        }
        description={
          pendingAction?.type === "delete"
            ? t("dialogs.deleteDescription")
            : t("dialogs.restoreDescription")
        }
        confirmLabel={pendingAction?.type === "delete" ? t("dialogs.deleteConfirm") : t("dialogs.restoreConfirm")}
        confirmVariant={pendingAction?.type === "delete" ? "destructive" : "default"}
        isSubmitting={isSubmitting}
        onCancel={() => setPendingAction(null)}
        onConfirm={handleConfirm}
        extra={
          pendingAction ? (
            <div className="space-y-1">
              <p className="text-xs font-semibold tracking-[0.16em] text-[--color-brand-muted] uppercase">
                {t("dialogs.selected")}
              </p>
              <p className="text-sm font-medium text-foreground">{pendingAction.blog.name}</p>
              <p className="text-sm text-muted-foreground">{formatCreatorDisplayName(pendingAction.blog.createdBy.name)}</p>
            </div>
          ) : null
        }
      />
    </>
  );
}
