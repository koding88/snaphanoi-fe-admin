"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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
      title: response.message ?? "Blog updated successfully.",
    });
    router.replace(ROUTES.admin.blogs.detail(response.data.id));
  }

  return (
    <AdminPageContainer tone="hero" className="space-y-8 pb-10">
      <PageHeader
        eyebrow="Edit blog"
        title="Update the editorial entry"
        description="Review the metadata quickly, then continue editing the content in the full-width workspace."
        meta={
          <BackButton
            href={ROUTES.admin.blogs.detail(id)}
            confirm
            confirmTitle="Discard these changes?"
            confirmDescription="Any modifications will be lost."
            confirmLabel="Discard"
          />
        }
      />
      {isLoading ? (
        <LoadingState title="Loading blog" description="Fetching the current blog record and cover asset." />
      ) : error || !blog ? (
        <ErrorState title="Unable to load this blog" description={error ?? "Blog not found."} />
      ) : (
        <AdminSurface className="overflow-hidden border-white/60 bg-white/84 p-6 shadow-[0_30px_100px_-70px_rgba(15,23,42,0.5)] md:p-8">
          <BlogForm
            mode="edit"
            initialValues={getBlogFormInitialValues(blog)}
            existingCoverImage={blog.coverImage}
            submitLabel="Save changes"
            description="Edit keeps the current blog semantics intact while making the editorial workspace easier to scan and use."
            onSubmit={handleSubmit}
          />
        </AdminSurface>
      )}
    </AdminPageContainer>
  );
}
