import { AdminPageContainer } from "@/components/admin/admin-page-container";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";

export default function RolesPage() {
  return (
    <AdminPageContainer className="space-y-8 pb-10">
      <PageHeader
        eyebrow="Roles"
        title="Roles module is reserved for Stage 5."
        description="The route is scaffolded now to complete the shell foundation and keep the navigation structure aligned with the approved folder plan."
      />
      <EmptyState
        title="Role management starts later."
        description="Role list, detail, create, update, delete, and role-user listing remain out of scope until the dedicated roles stage."
      />
    </AdminPageContainer>
  );
}
