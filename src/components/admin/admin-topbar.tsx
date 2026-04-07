"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { AppLogo } from "@/components/shared/app-logo";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { faBarsStaggered, faBell, faSearch } from "@/lib/icons/fa";

type AdminTopbarProps = {
  onMenuClick: () => void;
};

export function AdminTopbar({ onMenuClick }: AdminTopbarProps) {
  const user = useAuthStore((state) => state.user);
  const status = useAuthStore((state) => state.status);

  return (
    <header className="sticky top-0 z-20 border-b border-border/80 bg-background/84 backdrop-blur">
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
        <div className="hidden min-w-0 flex-1 items-center gap-3 rounded-full border border-border/80 bg-card/85 px-4 py-3 lg:flex">
          <FontAwesomeIcon icon={faSearch} className="text-muted-foreground" />
          <span className="truncate text-sm text-muted-foreground">
            {status === "authenticated" && user
              ? `Authenticated as ${user.name} (${user.roleName ?? "Unknown role"})`
              : "Bootstrapping authenticated session"}
          </span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" size="icon" className="rounded-full">
            <FontAwesomeIcon icon={faBell} />
          </Button>
          <div className="hidden rounded-full border border-border/80 bg-card px-4 py-2.5 text-sm md:block">
            {user?.email ?? "Studio admin"}
          </div>
        </div>
      </div>
    </header>
  );
}
