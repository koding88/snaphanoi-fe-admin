import { PackageDetailPage } from "@/components/packages/package-detail-page";

export default async function AdminPackageDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <PackageDetailPage id={id} />;
}
