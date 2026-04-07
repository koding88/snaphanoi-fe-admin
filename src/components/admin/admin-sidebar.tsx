"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useAuthStore } from "@/features/auth/store/auth.store";
import { ADMIN_NAV_ITEMS, isAdminNavItemActive } from "@/lib/constants/nav";
import { AppLogo } from "@/components/shared/app-logo";
import { faChevronRight, faUserLarge, faWandMagicSparkles } from "@/lib/icons/fa";
import { cn } from "@/lib/utils";

type AdminSidebarProps = {
  mobile?: boolean;
  onNavigate?: () => void;
};

export function AdminSidebar({ mobile = false, onNavigate }: AdminSidebarProps) {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);

  return (
    <aside
      className={cn(
        "surface-enter flex h-full flex-col overflow-hidden rounded-[2rem] border border-border/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,244,237,0.92))] p-4 shadow-soft",
        mobile ? "min-h-full" : "sticky top-4 max-h-[calc(100vh-2rem)]",
      )}
    >
      <div className="border-b border-border/80 pb-4">
        <AppLogo compact />
      </div>
      <div className="mt-5 rounded-[1.6rem] border border-slate-900/10 bg-[linear-gradient(135deg,rgba(20,27,39,0.97),rgba(13,18,28,0.94),rgba(49,39,25,0.88))] p-4 text-white">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold tracking-[0.24em] text-[--color-brand-muted] uppercase">
              Signed in
            </p>
            <h3 className="mt-2 text-base font-semibold">{user?.name ?? "Authenticated user"}</h3>
            <p className="mt-1 text-sm text-white/65">{user?.email ?? "Studio account"}</p>
          </div>
          <div className="flex size-10 items-center justify-center rounded-2xl border border-white/10 bg-white/6 text-[--color-brand]">
            <FontAwesomeIcon icon={faUserLarge} />
          </div>
        </div>
      </div>
      <div className="mt-5 flex items-center gap-2 px-1 text-xs font-semibold tracking-[0.22em] text-[--color-brand-muted] uppercase">
        <FontAwesomeIcon icon={faWandMagicSparkles} />
        Navigation
      </div>
      <nav className="mt-3 flex flex-1 flex-col gap-2 overflow-y-auto pr-1">
        {ADMIN_NAV_ITEMS.map((item) => {
          const isActive = isAdminNavItemActive(item.href, pathname);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "group flex items-center gap-3 rounded-2xl border px-3 py-3 text-sm transition-colors",
                isActive
                  ? "border border-[--color-brand]/15 bg-[--color-brand-soft] text-foreground shadow-[0_14px_30px_rgba(205,174,111,0.12)]"
                  : "border-transparent text-muted-foreground hover:border-border/70 hover:bg-muted/60 hover:text-foreground",
              )}
            >
              <span
                className={cn(
                  "flex size-9 items-center justify-center rounded-xl border transition-colors",
                  isActive
                    ? "border-[--color-brand]/25 bg-white text-[--color-brand]"
                    : "border-border/80 bg-background text-muted-foreground group-hover:text-foreground",
                )}
              >
                <FontAwesomeIcon icon={item.icon} />
              </span>
              <span className="flex flex-col">
                <span className="font-medium">{item.label}</span>
                <span className="text-xs text-muted-foreground">{item.description}</span>
              </span>
              <span className="ml-auto text-[10px] text-muted-foreground">
                <FontAwesomeIcon icon={faChevronRight} />
              </span>
            </Link>
          );
        })}
      </nav>
      <div className="mt-5 rounded-2xl border border-border/80 bg-background/90 p-4">
        <p className="text-xs font-semibold tracking-[0.26em] text-[--color-brand-muted] uppercase">
          Account
        </p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Personal settings and password now live in the top-right account menu, separate from user administration.
        </p>
      </div>
    </aside>
  );
}
