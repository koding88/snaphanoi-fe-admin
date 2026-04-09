"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { ADMIN_NAV_ITEMS, isAdminNavItemActive } from "@/lib/constants/nav";
import { AppLogo } from "@/components/shared/app-logo";
import { faChevronRight, faWandMagicSparkles } from "@/lib/icons/fa";
import { cn } from "@/lib/utils";

type AdminSidebarProps = {
  mobile?: boolean;
  onNavigate?: () => void;
  collapsed?: boolean;
  onToggle?: () => void;
};

export function AdminSidebar({ mobile = false, onNavigate, collapsed = false, onToggle }: AdminSidebarProps) {
  const pathname = usePathname();

  if (mobile) {
    return (
      <aside
        className={cn(
          "surface-enter flex h-full flex-col overflow-hidden rounded-[2rem] border border-border/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,244,237,0.92))] p-4 shadow-soft",
          "min-h-full",
        )}
      >
        <div className="border-b border-border/80 pb-4">
          <AppLogo compact collapsed={false} />
        </div>
        <MobileNavContent pathname={pathname} onNavigate={onNavigate} />
      </aside>
    );
  }

  return (
    <aside
      className={cn(
        "surface-enter flex h-full flex-col overflow-hidden rounded-[2rem] border border-border/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,244,237,0.92))] shadow-soft transition-all duration-300",
        collapsed ? "w-[88px] p-3" : "w-[280px] p-4",
        "sticky top-4 max-h-[calc(100vh-2rem)]",
      )}
    >
      {/* Header Section */}
      <div className={cn("flex items-center", collapsed ? "justify-center pb-3" : "pb-4")}>
        <AppLogo compact collapsed={collapsed} />
      </div>

      {/* Toggle button at bottom */}
      {onToggle && (
        <button
          type="button"
          onClick={onToggle}
          className={cn(
            "group mb-3 flex items-center justify-center rounded-xl border border-border/80 bg-background/60 text-muted-foreground transition-all hover:border-[--color-brand]/25 hover:bg-[--color-brand-soft] hover:text-[--color-brand]",
            collapsed ? "py-2" : "py-2 px-3",
          )}
        >
          <FontAwesomeIcon
            icon={faChevronRight}
            className={cn("size-4 transition-transform", collapsed ? "" : "rotate-180")}
          />
          {!collapsed && (
            <span className="ml-2 text-xs font-medium">Collapse</span>
          )}
        </button>
      )}

      {/* Navigation label */}
      <div className={cn("flex items-center gap-2", collapsed ? "justify-center pb-2" : "mb-3 px-1")}>
        {!collapsed && (
          <>
            <FontAwesomeIcon icon={faWandMagicSparkles} className="text-[--color-brand-muted]" />
            <span className="text-xs font-semibold tracking-[0.22em] text-[--color-brand-muted] uppercase">
              Navigation
            </span>
          </>
        )}
        {collapsed && (
          <FontAwesomeIcon icon={faWandMagicSparkles} className="text-[--color-brand-muted]" />
        )}
      </div>

      {/* Nav items - Rail style */}
      <nav className={cn("flex flex-1 flex-col gap-1.5 overflow-y-auto", collapsed ? "px-1" : "pr-1")}>
        {ADMIN_NAV_ITEMS.map((item) => {
          const isActive = isAdminNavItemActive(item.href, pathname);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "group relative flex items-center rounded-xl border text-sm transition-all duration-200",
                isActive
                  ? "border-[--color-brand]/30 bg-[--color-brand-soft] text-foreground shadow-[0_4px_12px_rgba(205,174,111,0.15)]"
                  : "border-transparent text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                collapsed ? "justify-center p-2.5" : "gap-3 px-3 py-2.5",
              )}
              title={collapsed ? item.label : undefined}
            >
              {/* Active indicator bar */}
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r-full bg-[--color-brand]" />
              )}
              <span
                className={cn(
                  "flex items-center justify-center rounded-lg transition-colors",
                  collapsed ? "size-7" : "size-9",
                  isActive
                    ? "bg-white text-[--color-brand] shadow-sm"
                    : "bg-background text-muted-foreground group-hover:text-foreground",
                )}
              >
                <FontAwesomeIcon icon={item.icon} className={collapsed ? "text-xs" : "text-sm"} />
              </span>
              {!collapsed && (
                <span className="flex flex-1 flex-col">
                  <span className="font-medium">{item.label}</span>
                  <span className="text-xs text-muted-foreground">{item.description}</span>
                </span>
              )}
              {!collapsed && !isActive && (
                <span className="text-[10px] text-muted-foreground">
                  <FontAwesomeIcon icon={faChevronRight} />
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

function MobileNavContent({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <>
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
    </>
  );
}