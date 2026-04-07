import type { ReactNode } from "react";

import { AuthShell } from "@/components/auth/auth-shell";
import { PublicRouteGuard } from "@/components/auth/public-route-guard";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <AuthShell>
      <PublicRouteGuard>{children}</PublicRouteGuard>
    </AuthShell>
  );
}
