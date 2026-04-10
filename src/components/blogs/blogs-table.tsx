"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type KeyboardEvent, type MouseEvent, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { BlogPinBadge } from "@/components/blogs/blog-pin-badge";
import { BlogPublishBadge } from "@/components/blogs/blog-publish-badge";
import { BlogStatusBadge } from "@/components/blogs/blog-status-badge";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import type { BlogRecord } from "@/features/blogs/types/blogs.types";
import { formatDateOnly } from "@/features/users/utils/users-format";
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
  const router = useRouter();
  const columnLayout =
    "grid-cols-[minmax(220px,1.2fr)_112px_96px_104px_104px_112px_112px]";
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
        <div className="border-b border-border/70 bg-white/56 px-5 py-4">
          <p className="text-xs font-semibold tracking-[0.22em] text-[--color-brand-muted] uppercase">
            Blog records
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Review article titles, publishing priority, cover assets, and lifecycle state from one table.
          </p>
        </div>
        <div className="border-t border-border/10">
          <div
            className={cn(
              "grid min-w-[980px] items-center gap-x-3 border-b border-border/80 bg-white/55 px-5 py-4 text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase",
              columnLayout,
            )}
          >
            <div>Blog</div>
            <div className="text-center">Cover</div>
            <div className="text-center">Pin</div>
            <div className="text-center">Publish</div>
            <div className="text-center">Status</div>
            <div className="text-center">Updated</div>
            <div className="text-center">Actions</div>
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
                  "grid min-w-[980px] cursor-pointer items-center gap-x-3 border-b border-border/60 px-5 py-5 transition-[background-color,box-shadow] hover:bg-white/60 focus-visible:bg-white/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-brand]/30 last:border-b-0",
                  columnLayout,
                )}
              >
                <div className="space-y-1">
                  <p className="truncate font-medium text-foreground">{blog.name}</p>
                  <p className="text-sm text-muted-foreground">By {blog.createdBy.name}</p>
                </div>
                <div className="flex justify-center">
                  <div className="overflow-hidden rounded-2xl border border-border/80 bg-muted/40 shadow-[0_12px_30px_-24px_rgba(32,24,18,0.45)]">
                    {/* Table thumbnails use backend storage URLs directly and stay intentionally unoptimized here. */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={blog.coverImage.url} alt={blog.name} className="block h-20 w-28 object-cover" />
                  </div>
                </div>
                <div className="flex justify-center">
                  <BlogPinBadge isPinned={blog.isPinned} />
                </div>
                <div className="flex justify-center">
                  <BlogPublishBadge isPublished={blog.isPublished} />
                </div>
                <div className="flex justify-center">
                  <BlogStatusBadge isActive={blog.isActive} deletedAt={blog.deletedAt} />
                </div>
                <div className="text-center text-sm text-muted-foreground">
                  <p className="leading-relaxed">{formatDateOnly(blog.updatedAt)}</p>
                </div>
                <div className="text-center">
                  <div className="grid justify-items-center gap-2" onClick={handleRowActionClick} onKeyDown={handleRowActionClick}>
                    <Link
                      href={ROUTES.admin.blogs.edit(blog.id)}
                      className={cn(
                        buttonVariants({ variant: "outline", size: "sm" }),
                        "h-8 w-[100px] px-2.5 text-xs",
                      )}
                      onClick={handleRowActionClick}
                    >
                      <FontAwesomeIcon icon={faUserPen} />
                      Edit
                    </Link>
                    {blog.deletedAt ? (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-8 w-[100px] px-2.5 text-xs"
                        disabled={isBusy}
                        onClick={(event) => {
                          handleRowActionClick(event);
                          setPendingAction({ type: "restore", blog });
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
                        className="h-8 w-[100px] px-2.5 text-xs"
                        disabled={isBusy}
                        onClick={(event) => {
                          handleRowActionClick(event);
                          setPendingAction({ type: "delete", blog });
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
            ? `Delete ${pendingAction?.blog.name}?`
            : `Restore ${pendingAction?.blog.name}?`
        }
        description={
          pendingAction?.type === "delete"
            ? "This archives the blog for now. You can restore it later if needed."
            : "This restores the archived blog to the active editorial library."
        }
        confirmLabel={pendingAction?.type === "delete" ? "Delete blog" : "Restore blog"}
        confirmVariant={pendingAction?.type === "delete" ? "destructive" : "default"}
        isSubmitting={isSubmitting}
        onCancel={() => setPendingAction(null)}
        onConfirm={handleConfirm}
        extra={
          pendingAction ? (
            <div className="space-y-1">
              <p className="text-xs font-semibold tracking-[0.16em] text-[--color-brand-muted] uppercase">
                Selected blog
              </p>
              <p className="text-sm font-medium text-foreground">{pendingAction.blog.name}</p>
              <p className="text-sm text-muted-foreground">{pendingAction.blog.createdBy.name}</p>
            </div>
          ) : null
        }
      />
    </>
  );
}
