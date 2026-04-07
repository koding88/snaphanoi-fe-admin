"use client";

import type { ReactNode } from "react";

import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminTopbar } from "@/components/admin/admin-topbar";
import { useAppShellStore } from "@/features/ui/store/app-shell.store";

type AdminShellProps = {
  children: ReactNode;
};

export function AdminShell({ children }: AdminShellProps) {
  const isMobileSidebarOpen = useAppShellStore((state) => state.isMobileSidebarOpen);
  const openMobileSidebar = useAppShellStore((state) => state.openMobileSidebar);
  const closeMobileSidebar = useAppShellStore((state) => state.closeMobileSidebar);

  return (
    <div className="min-h-screen bg-background">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(205,174,111,0.12),transparent_24%),radial-gradient(circle_at_85%_18%,rgba(15,23,42,0.07),transparent_18%),linear-gradient(180deg,rgba(248,244,237,0.82),rgba(245,240,232,0.36),rgba(255,255,255,1))]" />
      <div className="lg:hidden">
        <div
          className={`fixed inset-0 z-40 bg-slate-950/45 transition-opacity ${
            isMobileSidebarOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
          }`}
          onClick={closeMobileSidebar}
          aria-hidden="true"
        />
        <div
          className={`fixed inset-y-0 left-0 z-50 w-[86vw] max-w-sm p-4 transition-transform ${
            isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <AdminSidebar mobile onNavigate={closeMobileSidebar} />
        </div>
      </div>
      <div className="mx-auto grid min-h-screen max-w-[1600px] grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)] lg:gap-5 lg:px-5 lg:py-4">
        <div className="hidden lg:block">
          <AdminSidebar />
        </div>
        <div className="min-w-0">
          <AdminTopbar onMenuClick={openMobileSidebar} />
          <div>{children}</div>
        </div>
      </div>
    </div>
  );
}
