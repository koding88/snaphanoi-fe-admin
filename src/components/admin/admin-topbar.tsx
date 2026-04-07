"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { AppLogo } from "@/components/shared/app-logo";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { ADMIN_NAV_ITEMS } from "@/lib/constants/nav";
import { faBarsStaggered, faBell, faSearch } from "@/lib/icons/fa";

type AdminTopbarProps = {
  onMenuClick: () => void;
};

export function AdminTopbar({ onMenuClick }: AdminTopbarProps) {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const status = useAuthStore((state) => state.status);
  const activeItem = useMemo(
    () =>
      ADMIN_NAV_ITEMS.find((item) => pathname === item.href || pathname.startsWith(`${item.href}/`)),
    [pathname],
  );

  return (
    <header className="sticky top-0 z-20 border-b border-border/70 bg-[color:rgba(252,249,244,0.82)] backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center gap-3 px-4 py-4 md:px-6 lg:px-8">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="rounded-full lg:hidden"
          onClick={onMenuClick}
        >
          <FontAwesomeIcon icon={faBarsStaggered} />
        </Button>
        <div className="lg:hidden">
          <AppLogo compact />
        </div>
        <div className="hidden min-w-0 flex-1 items-center gap-4 lg:flex">
          <div className="min-w-0">
            <p className="text-xs font-semibold tracking-[0.24em] text-[--color-brand-muted] uppercase">
              {activeItem?.label ?? "Admin"}
            </p>
            <p className="truncate text-sm text-muted-foreground">
              {activeItem?.description ??
                (status === "authenticated" && user
                  ? `Authenticated as ${user.name} (${user.roleName ?? "Unknown role"})`
                  : "Bootstrapping authenticated session")}
            </p>
          </div>
          <div className="hidden min-w-0 flex-1 items-center gap-3 rounded-full border border-border/80 bg-white/72 px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] xl:flex">
            <FontAwesomeIcon icon={faSearch} className="text-muted-foreground" />
            <span className="truncate text-sm text-muted-foreground">
              Consistent controls, calmer motion, and better mobile reading across auth and admin.
            </span>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" size="icon" className="rounded-full">
            <FontAwesomeIcon icon={faBell} />
          </Button>
          <div className="hidden rounded-full border border-border/80 bg-white/76 px-4 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.82)] md:block">
            <p className="text-[11px] font-semibold tracking-[0.22em] text-[--color-brand-muted] uppercase">
              Session
            </p>
            <p className="text-sm text-foreground">{user?.email ?? "Studio admin"}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
