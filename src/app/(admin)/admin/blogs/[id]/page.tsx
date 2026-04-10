import { BlogDetailPage } from "@/components/blogs/blog-detail-page";

export default async function AdminBlogDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <BlogDetailPage id={id} />;
}
