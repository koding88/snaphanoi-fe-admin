import { UserEditPage } from "@/components/users/user-edit-page";

export default async function EditUserRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <UserEditPage id={id} />;
}
