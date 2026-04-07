import { RoleEditPage } from "@/components/roles/role-edit-page";

export default async function EditRoleRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <RoleEditPage id={id} />;
}
