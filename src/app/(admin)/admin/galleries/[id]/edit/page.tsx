import { GalleryEditPage } from "@/components/galleries/gallery-edit-page";

export default async function EditGalleryRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <GalleryEditPage id={id} />;
}
