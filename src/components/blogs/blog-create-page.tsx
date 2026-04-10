"use client";

import { useRouter } from "next/navigation";

import { AdminPageContainer } from "@/components/admin/admin-page-container";
import { AdminSurface } from "@/components/admin/admin-surface";
import { BlogForm } from "@/components/blogs/blog-form";
import { BackButton } from "@/components/shared/back-button";
import { PageHeader } from "@/components/shared/page-header";
import { createBlog } from "@/features/blogs/api/create-blog";
import { ROUTES } from "@/lib/constants/routes";
import { queueNavigationToast } from "@/lib/toast";

export function BlogCreatePage() {
  const router = useRouter();

  async function handleSubmit(payload: Parameters<typeof createBlog>[0]) {
    const response = await createBlog(payload);
    queueNavigationToast({
      intent: "success",
      title: response.message ?? "Blog created successfully.",
    });
    router.replace(ROUTES.admin.blogs.detail(response.data.id));
  }

  return (
    <AdminPageContainer tone="hero" className="space-y-8 pb-10">
      <PageHeader
        eyebrow="Create blog"
        title="Create a new editorial entry"
        description="Set the core metadata first, then shape the full journal piece in the editor workspace below."
        meta={
          <BackButton
            href={ROUTES.admin.blogs.root}
            confirm
            confirmTitle="Discard this new blog?"
            confirmDescription="The form will be cleared and you will return to the blog list."
            confirmLabel="Discard"
          />
        }
      />
      <AdminSurface className="overflow-hidden border-white/60 bg-white/84 p-6 shadow-[0_30px_100px_-70px_rgba(15,23,42,0.5)] md:p-8">
        <BlogForm
          mode="create"
          submitLabel="Create blog"
          description="Create keeps the same backend contract while giving the editorial editor a full-width workspace."
          onSubmit={handleSubmit}
        />
      </AdminSurface>
    </AdminPageContainer>
  );
}
