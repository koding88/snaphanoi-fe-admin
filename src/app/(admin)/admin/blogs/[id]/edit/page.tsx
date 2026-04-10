import { BlogEditPage } from "@/components/blogs/blog-edit-page";

export default async function AdminBlogEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <BlogEditPage id={id} />;
}
