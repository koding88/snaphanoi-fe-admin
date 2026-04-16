"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { AccountMenu } from "@/components/admin/account-menu";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { AppLogo } from "@/components/shared/app-logo";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { ADMIN_NAV_ITEMS, isAdminNavItemActive } from "@/lib/constants/nav";
import { faBarsStaggered } from "@/lib/icons/fa";

type AdminTopbarProps = {
  onMenuClick: () => void;
};

export function AdminTopbar({ onMenuClick }: AdminTopbarProps) {
  const t = useTranslations();
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const status = useAuthStore((state) => state.status);
  const activeItem = useMemo(
    () => ADMIN_NAV_ITEMS.find((item) => isAdminNavItemActive(item.href, pathname)),
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
              {activeItem ? t(`admin.nav.${activeItem.key}.label`) : t("admin.topbar.fallbackTitle")}
            </p>
            <p className="truncate text-sm text-muted-foreground">
              {(activeItem
                ? t(`admin.nav.${activeItem.key}.description`)
                : undefined) ??
                (status === "authenticated" && user
                  ? `${user.name} · ${user.roleName ?? t("admin.topbar.studioMember")}`
                  : t("admin.topbar.bootstrapping"))}
            </p>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <LanguageSwitcher />
          <AccountMenu />
        </div>
      </div>
    </header>
  );
}
