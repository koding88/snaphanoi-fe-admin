import { AdminPageContainer } from "@/components/admin/admin-page-container";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";

export default function UsersPage() {
  return (
    <AdminPageContainer className="space-y-8 pb-10">
      <PageHeader
        eyebrow="Users"
        title="Users module is reserved for Stage 4."
        description="The route exists now so the admin navigation, layout spacing, and responsive shell can be verified in Stage 1 without implementing user management behavior."
      />
      <EmptyState
        title="Users CRUD is intentionally deferred."
        description="List, detail, create, update, delete, restore, profile update, and password change will be implemented only in the dedicated users stage."
      />
    </AdminPageContainer>
  );
}
