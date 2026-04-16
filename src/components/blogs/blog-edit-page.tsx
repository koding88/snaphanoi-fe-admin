"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { AdminPageContainer } from "@/components/admin/admin-page-container";
import { AdminSurface } from "@/components/admin/admin-surface";
import { BlogForm, getBlogFormInitialValues } from "@/components/blogs/blog-form";
import { BackButton } from "@/components/shared/back-button";
import { ErrorState } from "@/components/shared/error-state";
import { LoadingState } from "@/components/shared/loading-state";
import { PageHeader } from "@/components/shared/page-header";
import { getBlog } from "@/features/blogs/api/get-blog";
import { updateBlog } from "@/features/blogs/api/update-blog";
import type { BlogDetailRecord } from "@/features/blogs/types/blogs.types";
import { getFriendlyBlogsError } from "@/features/blogs/utils/blogs-errors";
import { ROUTES } from "@/lib/constants/routes";
import { queueNavigationToast } from "@/lib/toast";

export function BlogEditPage({ id }: { id: string }) {
  const t = useTranslations("blogs.edit");
  const router = useRouter();
  const [blog, setBlog] = useState<BlogDetailRecord | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

  async function handleSubmit(payload: Parameters<typeof updateBlog>[1]) {
    const response = await updateBlog(id, payload);
    queueNavigationToast({
      intent: "success",
      title: response.message ?? t("toasts.updated"),
    });
    router.replace(ROUTES.admin.blogs.detail(response.data.id));
  }

  return (
    <AdminPageContainer tone="hero" className="space-y-8 pb-10">
      <PageHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("description")}
        meta={
          <BackButton
            href={ROUTES.admin.blogs.detail(id)}
            confirm
            confirmTitle={t("confirm.title")}
            confirmDescription={t("confirm.description")}
            confirmLabel={t("confirm.confirmLabel")}
          />
        }
      />
      {isLoading ? (
        <LoadingState title={t("loading.title")} description={t("loading.description")} />
      ) : error || !blog ? (
        <ErrorState title={t("errorTitle")} description={error ?? t("notFound")} />
      ) : (
        <AdminSurface className="overflow-hidden border-white/60 bg-white/84 p-6 shadow-[0_30px_100px_-70px_rgba(15,23,42,0.5)] md:p-8">
          <BlogForm
            mode="edit"
            initialValues={getBlogFormInitialValues(blog)}
            existingCoverImage={blog.coverImage}
            submitLabel={t("submitLabel")}
            description={t("formDescription")}
            onSubmit={handleSubmit}
          />
        </AdminSurface>
      )}
    </AdminPageContainer>
  );
}
