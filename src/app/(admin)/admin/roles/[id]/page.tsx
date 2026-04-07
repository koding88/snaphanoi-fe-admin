import { RoleDetailPage } from "@/components/roles/role-detail-page";

export default async function RoleDetailRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <RoleDetailPage id={id} />;
}
