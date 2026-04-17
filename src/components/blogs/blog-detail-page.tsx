"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { AdminPageContainer } from "@/components/admin/admin-page-container";
import { AdminSurface } from "@/components/admin/admin-surface";
import { BlogDetailCard } from "@/components/blogs/blog-detail-card";
import { BlogLocaleSwitch } from "@/components/blogs/blog-locale-switch";
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
import {
  getBlogPrimaryName,
  type BlogLocale,
} from "@/features/blogs/utils/blog-localization";
import { getFriendlyBlogsError } from "@/features/blogs/utils/blogs-errors";
import { formatDateTime } from "@/features/users/utils/users-format";
import { ROUTES } from "@/lib/constants/routes";
import { faRotateLeft, faTrashCan, faUserPen } from "@/lib/icons/fa";
import {
  consumeNavigationToast,
  notifyError,
  notifySuccess,
} from "@/lib/toast";
import { cn } from "@/lib/utils";

export function BlogDetailPage({ id }: { id: string }) {
  const t = useTranslations("blogs.detail");
  const router = useRouter();
  const [blog, setBlog] = useState<BlogDetailRecord | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogMode, setDialogMode] = useState<"delete" | "restore" | null>(
    null,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activePreviewLocale, setActivePreviewLocale] =
    useState<BlogLocale>("en");

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
        notifySuccess(
          response.message ?? response.data.message,
          t("toasts.archived"),
        );
        router.replace(ROUTES.admin.blogs.root);
        return;
      }

      const response = await restoreBlog(blog.id);
      setBlog(response.data);
      notifySuccess(response.message, t("toasts.restored"));
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
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("description")}
        meta={<BackButton href={ROUTES.admin.blogs.root} />}
        actions={
          blog ? (
            <div className="flex flex-wrap gap-2">
              <Link
                href={ROUTES.admin.blogs.edit(blog.id)}
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "rounded-full px-5",
                )}
              >
                <FontAwesomeIcon icon={faUserPen} />
                {t("actions.edit")}
              </Link>
              {blog.deletedAt ? (
                <button
                  type="button"
                  onClick={() => setDialogMode("restore")}
                  className={cn(buttonVariants(), "rounded-full px-5")}
                >
                  <FontAwesomeIcon icon={faRotateLeft} />
                  {t("actions.restore")}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setDialogMode("delete")}
                  className={cn(
                    buttonVariants({ variant: "destructive" }),
                    "rounded-full px-5",
                  )}
                >
                  <FontAwesomeIcon icon={faTrashCan} />
                  {t("actions.delete")}
                </button>
              )}
            </div>
          ) : null
        }
      />
      {isLoading ? (
        <LoadingState
          title={t("loading.title")}
          description={t("loading.description")}
        />
      ) : error || !blog ? (
        <ErrorState
          title={t("errorTitle")}
          description={error ?? t("notFound")}
        />
      ) : (
        <>
          <BlogDetailCard blog={blog} />
          <AdminSurface className="p-6 md:p-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="space-y-3">
                <p className="text-xs font-semibold tracking-[0.22em] text-[--color-brand-muted] uppercase">
                  {t("document.eyebrow")}
                </p>
                <h2 className="font-heading text-3xl tracking-[0.04em] text-foreground md:text-[2.35rem]">
                  {t("document.title")}
                </h2>
                <p className="max-w-3xl text-sm leading-7 text-muted-foreground">
                  {t("document.description")}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-border/80 bg-white/70 px-4 py-2 text-[11px] font-semibold tracking-[0.18em] text-[--color-brand-muted] uppercase">
                  {t("document.readonly")}
                </span>
                <span className="rounded-full border border-border/80 bg-white/70 px-4 py-2 text-[11px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                  {t("document.blocks", {
                    count: blog.content.blocks?.length ?? 0,
                  })}
                </span>
                <span className="rounded-full border border-border/80 bg-white/70 px-4 py-2 text-[11px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                  {t("document.updated", {
                    date: formatDateTime(blog.updatedAt),
                  })}
                </span>
              </div>
            </div>
            <div className="mt-5 rounded-[1.4rem] border border-border/70 bg-white/70 px-4 py-3 text-sm text-muted-foreground">
              {t("document.state", {
                state: blog.deletedAt
                  ? t("document.stateArchived")
                  : t("document.stateActive"),
              })}
            </div>
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-[1.35rem] border border-border/70 bg-white/72 px-4 py-3">
              <p className="text-sm text-muted-foreground">
                {t("document.localeHint", {
                  locale: activePreviewLocale.toUpperCase(),
                })}
              </p>
              <BlogLocaleSwitch
                activeLocale={activePreviewLocale}
                onChange={setActivePreviewLocale}
              />
            </div>
            <div className="mt-6 rounded-[2rem] border border-border/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.88),rgba(249,245,238,0.92))] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.78)] md:p-8">
              <BlogEditorPreview
                content={blog.content}
                locale={activePreviewLocale}
              />
            </div>
          </AdminSurface>
        </>
      )}
      <ConfirmDialog
        open={Boolean(dialogMode && blog)}
        title={
          dialogMode === "delete"
            ? t("dialogs.deleteTitle", {
                name: blog ? getBlogPrimaryName(blog.name) : "",
              })
            : t("dialogs.restoreTitle", {
                name: blog ? getBlogPrimaryName(blog.name) : "",
              })
        }
        description={
          dialogMode === "delete"
            ? t("dialogs.deleteDescription")
            : t("dialogs.restoreDescription")
        }
        confirmLabel={
          dialogMode === "delete"
            ? t("dialogs.deleteConfirm")
            : t("dialogs.restoreConfirm")
        }
        confirmVariant={dialogMode === "delete" ? "destructive" : "default"}
        isSubmitting={isSubmitting}
        onCancel={() => setDialogMode(null)}
        onConfirm={handleAction}
      />
    </AdminPageContainer>
  );
}
