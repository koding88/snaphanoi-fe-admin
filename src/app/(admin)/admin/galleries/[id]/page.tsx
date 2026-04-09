import { GalleryDetailPage } from "@/components/galleries/gallery-detail-page";

export default async function GalleryDetailRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <GalleryDetailPage id={id} />;
}
