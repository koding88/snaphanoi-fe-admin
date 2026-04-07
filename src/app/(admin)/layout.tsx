import type { ReactNode } from "react";

import { AdminShell } from "@/components/admin/admin-shell";
import { AdminRouteGuard } from "@/components/auth/admin-route-guard";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AdminRouteGuard>
      <AdminShell>{children}</AdminShell>
    </AdminRouteGuard>
  );
}
