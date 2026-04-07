"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { ADMIN_NAV_ITEMS } from "@/lib/constants/nav";
import { AppLogo } from "@/components/shared/app-logo";
import { cn } from "@/lib/utils";

type AdminSidebarProps = {
  mobile?: boolean;
  onNavigate?: () => void;
};

export function AdminSidebar({ mobile = false, onNavigate }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "flex h-full flex-col rounded-[2rem] border border-border/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,244,237,0.92))] p-4 shadow-soft",
        mobile ? "min-h-full" : "sticky top-4",
      )}
    >
      <div className="border-b border-border/80 pb-4">
        <AppLogo compact />
      </div>
      <nav className="mt-5 flex flex-1 flex-col gap-1.5">
        {ADMIN_NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "group flex items-center gap-3 rounded-2xl px-3 py-3 text-sm transition-colors",
                isActive
                  ? "bg-[--color-brand-soft] text-foreground"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
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
            </Link>
          );
        })}
      </nav>
      <div className="mt-5 rounded-2xl border border-border/80 bg-background/90 p-4">
        <p className="text-xs font-semibold tracking-[0.26em] text-[--color-brand-muted] uppercase">
          Stage 1
        </p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Shell, theme, providers and integration primitives are ready for the next stages.
        </p>
      </div>
    </aside>
  );
}
