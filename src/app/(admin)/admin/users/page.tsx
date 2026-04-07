import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { AdminModulePlaceholder } from "@/components/admin/admin-module-placeholder";
import { AdminPageContainer } from "@/components/admin/admin-page-container";
import { AdminSurface } from "@/components/admin/admin-surface";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { faUserPlus, faUserGroup } from "@/lib/icons/fa";

export default function UsersPage() {
  return (
    <AdminPageContainer tone="hero" className="space-y-8 pb-10">
      <PageHeader
        eyebrow="Users"
        title="People management shell is ready."
        description="This page now behaves like a real module landing surface: clear hierarchy, polished spacing, and room for upcoming user list/detail/form work without pre-building CRUD."
        meta={
          <span className="rounded-full border border-border/80 bg-white/70 px-3 py-1.5 text-xs font-semibold tracking-[0.16em] text-[--color-brand-muted] uppercase">
            Stage 4 pending
          </span>
        }
      />
      <AdminModulePlaceholder
        eyebrow="Users foundation"
        title="The shell supports list, detail, and account actions next."
        description="Route framing, module hierarchy, and placeholder states are in place so the actual users workflow can focus on backend integration instead of shell construction."
        icon={faUserGroup}
        statusLabel="Awaiting CRUD"
        bullets={[
          "List and filter surface will land here in Stage 4.",
          "Detail and edit pages can reuse the same page rhythm.",
          "Profile and password self-service remain intentionally untouched in this stage.",
          "No fake rows or fake query behavior were introduced.",
        ]}
      />
      <AdminSurface className="p-6 md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-semibold tracking-[0.24em] text-[--color-brand-muted] uppercase">
              Ready for product work
            </p>
            <h2 className="font-heading text-3xl tracking-[0.04em] text-foreground">
              Structure first, operations next
            </h2>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-white/70 px-4 py-2 text-sm text-muted-foreground">
            <FontAwesomeIcon icon={faUserPlus} className="text-[--color-brand]" />
            User creation UI intentionally deferred
          </div>
        </div>
      </AdminSurface>
      <EmptyState
        eyebrow="Deferred"
        title="Users CRUD is intentionally not started here."
        description="List, detail, create, update, delete, restore, profile update, and password change remain reserved for the dedicated users stage."
      />
    </AdminPageContainer>
  );
}
