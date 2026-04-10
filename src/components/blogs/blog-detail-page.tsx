"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { AdminPageContainer } from "@/components/admin/admin-page-container";
import { AdminSurface } from "@/components/admin/admin-surface";
import { BlogDetailCard } from "@/components/blogs/blog-detail-card";
import { BlogEditorPreview } from "@/components/blogs/editor/blog-editor-preview";
import { BackButton } from "@/components/shared/back-button";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { ErrorState } from "@/components/shared/error-state";
import { LoadingState } from "@/components/shared/loading-state";
import { PageHeader } from "@/components/shared/page-header";
import { buttonVariants } from "@/components/ui/button";
import { deleteBlog } from "@/features/blogs/api/delete-blog";
import { getBlog } from "@/features/blogs/api/get-blog";
import { restoreBlog } from "@/features/blogs/api/restore-blog";
import type { BlogDetailRecord } from "@/features/blogs/types/blogs.types";
import { getFriendlyBlogsError } from "@/features/blogs/utils/blogs-errors";
import { ROUTES } from "@/lib/constants/routes";
import { faRotateLeft, faTrashCan, faUserPen } from "@/lib/icons/fa";
import { consumeNavigationToast, notifyError, notifySuccess } from "@/lib/toast";
import { cn } from "@/lib/utils";

export function BlogDetailPage({ id }: { id: string }) {
  const router = useRouter();
  const [blog, setBlog] = useState<BlogDetailRecord | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogMode, setDialogMode] = useState<"delete" | "restore" | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    consumeNavigationToast();
  }, []);

  useEffect(() => {
    async function bootstrap() {
      setIsLoading(true);

      try {
        const blogResult = await getBlog(id);
        setBlog(blogResult);
      } catch (loadError) {
        setError(getFriendlyBlogsError(loadError));
      } finally {
        setIsLoading(false);
      }
    }

    void bootstrap();
  }, [id]);

  async function handleAction() {
    if (!blog || !dialogMode) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (dialogMode === "delete") {
        const response = await deleteBlog(blog.id);
        notifySuccess(response.message ?? response.data.message, "Blog archived.");
        router.replace(ROUTES.admin.blogs.root);
        return;
      }

      const response = await restoreBlog(blog.id);
      setBlog(response.data);
      notifySuccess(response.message, "Blog restored successfully.");
      setDialogMode(null);
    } catch (actionError) {
      notifyError(getFriendlyBlogsError(actionError));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AdminPageContainer tone="hero" className="space-y-8 pb-10">
      <PageHeader
        eyebrow="Blog detail"
        title="Review this editorial entry."
        description="Inspect the lead cover, publishing priority, and saved content document before making changes."
        meta={<BackButton href={ROUTES.admin.blogs.root} />}
        actions={
          blog ? (
            <div className="flex flex-wrap gap-2">
              <Link href={ROUTES.admin.blogs.edit(blog.id)} className={cn(buttonVariants({ variant: "outline" }), "rounded-full px-5")}>
                <FontAwesomeIcon icon={faUserPen} />
                Edit
              </Link>
              {blog.deletedAt ? (
                <button type="button" onClick={() => setDialogMode("restore")} className={cn(buttonVariants(), "rounded-full px-5")}>
                  <FontAwesomeIcon icon={faRotateLeft} />
                  Restore
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setDialogMode("delete")}
                  className={cn(buttonVariants({ variant: "destructive" }), "rounded-full px-5")}
                >
                  <FontAwesomeIcon icon={faTrashCan} />
                  Delete
                </button>
              )}
            </div>
          ) : null
        }
      />
      {isLoading ? (
        <LoadingState title="Loading blog" description="Fetching the selected editorial entry." />
      ) : error || !blog ? (
        <ErrorState title="Unable to load this blog" description={error ?? "Blog not found."} />
      ) : (
        <>
          <BlogDetailCard blog={blog} />
          <AdminSurface className="p-6 md:p-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="space-y-3">
                <p className="text-xs font-semibold tracking-[0.22em] text-[--color-brand-muted] uppercase">
                  Editorial document
                </p>
                <h2 className="font-heading text-3xl tracking-[0.04em] text-foreground md:text-[2.35rem]">
                  Saved blog content
                </h2>
                <p className="max-w-3xl text-sm leading-7 text-muted-foreground">
                  This preview uses the same document model as the blog editor and renders the currently saved entry exactly as admin holds it.
                </p>
              </div>
              <div className="rounded-full border border-border/80 bg-white/70 px-4 py-2 text-[11px] font-semibold tracking-[0.18em] text-[--color-brand-muted] uppercase">
                Readonly preview
              </div>
            </div>
            <div className="mt-8 rounded-[2rem] border border-border/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.88),rgba(249,245,238,0.92))] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.78)] md:p-8">
              <BlogEditorPreview content={blog.content} />
            </div>
          </AdminSurface>
        </>
      )}
      <ConfirmDialog
        open={Boolean(dialogMode && blog)}
        title={dialogMode === "delete" ? `Delete ${blog?.name}?` : `Restore ${blog?.name}?`}
        description={
          dialogMode === "delete"
            ? "This archives the blog for now. You can restore it later if needed."
            : "This will bring the archived blog back into the active editorial library."
        }
        confirmLabel={dialogMode === "delete" ? "Delete blog" : "Restore blog"}
        confirmVariant={dialogMode === "delete" ? "destructive" : "default"}
        isSubmitting={isSubmitting}
        onCancel={() => setDialogMode(null)}
        onConfirm={handleAction}
      />
    </AdminPageContainer>
  );
}
