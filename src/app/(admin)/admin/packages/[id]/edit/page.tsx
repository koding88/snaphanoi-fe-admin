import { PackageEditPage } from "@/components/packages/package-edit-page";

export default async function AdminPackageEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <PackageEditPage id={id} />;
}
