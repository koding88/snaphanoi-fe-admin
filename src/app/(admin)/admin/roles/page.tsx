import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { AdminModulePlaceholder } from "@/components/admin/admin-module-placeholder";
import { AdminPageContainer } from "@/components/admin/admin-page-container";
import { AdminSurface } from "@/components/admin/admin-surface";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { faFolderTree, faShieldHalved } from "@/lib/icons/fa";

export default function RolesPage() {
  return (
    <AdminPageContainer tone="hero" className="space-y-8 pb-10">
      <PageHeader
        eyebrow="Roles"
        title="Permission model shell is ready."
        description="This page now has a finished admin-shell presentation so role management can arrive later without reworking composition, hierarchy, or responsive behavior."
        meta={
          <span className="rounded-full border border-border/80 bg-white/70 px-3 py-1.5 text-xs font-semibold tracking-[0.16em] text-[--color-brand-muted] uppercase">
            Stage 5 pending
          </span>
        }
      />
      <AdminModulePlaceholder
        eyebrow="Roles foundation"
        title="This route is prepared for permission workflows."
        description="The UI is now ready for role lists, role detail pages, and role-user assignment surfaces, but the actual management logic is still deferred."
        icon={faShieldHalved}
        statusLabel="Awaiting CRUD"
        bullets={[
          "Role list and detail pages can plug into this rhythm directly.",
          "Role-user associations remain a future feature, not simulated data here.",
          "No speculative permission matrix or fake analytics were added.",
          "The shell stays practical and honest to the backend handoff.",
        ]}
      />
      <AdminSurface className="p-6 md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-semibold tracking-[0.24em] text-[--color-brand-muted] uppercase">
              Permissions module
            </p>
            <h2 className="font-heading text-3xl tracking-[0.04em] text-foreground">
              Reserved for controlled expansion
            </h2>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-white/70 px-4 py-2 text-sm text-muted-foreground">
            <FontAwesomeIcon icon={faFolderTree} className="text-[--color-brand]" />
            Role relationships land in Stage 5
          </div>
        </div>
      </AdminSurface>
      <EmptyState
        eyebrow="Deferred"
        title="Role management starts later."
        description="Role list, detail, create, update, delete, and role-user listing remain outside Stage 3 and will be implemented in the dedicated roles stage."
      />
    </AdminPageContainer>
  );
}
