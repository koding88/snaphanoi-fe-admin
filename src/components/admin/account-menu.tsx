"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { useTranslations } from "next-intl";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { logout } from "@/features/auth/api/logout";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { clearAuthClientState } from "@/features/auth/utils/auth-client-state";
import { ROUTES } from "@/lib/constants/routes";
import { faArrowRightFromBracket, faLock, faUserGear } from "@/lib/icons/fa";
import { cn } from "@/lib/utils";

export function AccountMenu() {
  const t = useTranslations("admin.account");
  const router = useRouter();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const closeTimeoutRef = useRef<number | null>(null);
  const user = useAuthStore((state) => state.user);
  const [open, setOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    function handlePointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        window.clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  function handleHoverOpen() {
    if (closeTimeoutRef.current) {
      window.clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }

    setOpen(true);
  }

  function handleHoverClose() {
    if (closeTimeoutRef.current) {
      window.clearTimeout(closeTimeoutRef.current);
    }

    closeTimeoutRef.current = window.setTimeout(() => {
      setOpen(false);
      closeTimeoutRef.current = null;
    }, 120);
  }

  async function handleLogout() {
    setIsLoggingOut(true);

    try {
      await logout();
    } catch {
      // Local session must still be cleared if the backend already invalidated the cookie.
    } finally {
      clearAuthClientState({ reason: "logout" });
      setOpen(false);
      setIsLoggingOut(false);
      router.replace(ROUTES.login);
    }
  }

  return (
    <div
      ref={rootRef}
      className="relative"
      onMouseEnter={handleHoverOpen}
      onMouseLeave={handleHoverClose}
    >
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        onFocus={handleHoverOpen}
        className="flex items-center gap-3 rounded-full border border-border/80 bg-white/76 px-3 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.82)] outline-none transition duration-200 hover:border-[--color-brand]/25 hover:bg-white active:scale-[0.99] focus-visible:border-[--color-brand]/35 focus-visible:ring-3 focus-visible:ring-[--color-brand]/12"
        aria-expanded={open}
      >
        <span className="hidden text-left md:block">
            <span className="block text-[11px] font-semibold tracking-[0.22em] text-[--color-brand-muted] uppercase">
              {t("triggerLabel")}
            </span>
            <span className="block max-w-44 truncate text-sm text-foreground">
              {user?.email ?? t("fallbackEmail")}
            </span>
        </span>
        <span className="flex size-10 items-center justify-center rounded-full bg-[linear-gradient(135deg,rgba(20,27,39,0.98),rgba(49,39,25,0.88))] text-sm font-semibold text-white">
          {(user?.name ?? "A").charAt(0).toUpperCase()}
        </span>
      </button>
      {open ? (
        <div className="dialog-enter absolute right-0 top-[calc(100%+0.7rem)] z-[90] w-72 overflow-hidden rounded-[1.5rem] border border-border/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,244,237,0.96))] p-2 shadow-[0_24px_64px_rgba(15,23,42,0.18)]">
          <div className="rounded-[1.2rem] border border-border/70 bg-white/70 px-4 py-3">
            <p className="text-xs font-semibold tracking-[0.22em] text-[--color-brand-muted] uppercase">
              {t("signedIn")}
            </p>
            <p className="mt-2 text-sm font-medium text-foreground">
              {user?.name ?? t("fallbackName")}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {user?.email ?? t("fallbackWorkspace")}
            </p>
          </div>
          <div className="mt-2 space-y-1">
            <AccountMenuLink
              href={ROUTES.admin.users.me}
              label={t("profileLabel")}
              description={t("profileDescription")}
              icon={faUserGear}
              onSelect={() => setOpen(false)}
            />
            <AccountMenuLink
              href={ROUTES.admin.users.changePassword}
              label={t("securityLabel")}
              description={t("securityDescription")}
              icon={faLock}
              onSelect={() => setOpen(false)}
            />
            <button
              type="button"
              onClick={() => void handleLogout()}
              disabled={isLoggingOut}
              className="group flex w-full items-center gap-3 rounded-[1rem] border border-transparent px-3 py-3 text-left text-sm text-foreground outline-none transition-all duration-200 hover:border-red-500/14 hover:bg-[linear-gradient(180deg,rgba(239,68,68,0.08),rgba(239,68,68,0.03))] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] focus-visible:border-red-500/20 focus-visible:bg-[linear-gradient(180deg,rgba(239,68,68,0.08),rgba(239,68,68,0.03))] disabled:opacity-60"
            >
              <span className="flex size-9 items-center justify-center rounded-xl border border-red-500/18 bg-red-500/8 text-red-700 transition-all duration-200 group-hover:scale-[1.03] group-hover:border-red-500/28 group-hover:bg-red-500/12 group-hover:text-red-800">
                <FontAwesomeIcon icon={faArrowRightFromBracket} />
              </span>
              <span className="min-w-0">
                <span className="block font-medium transition-transform duration-200 group-hover:translate-x-0.5">
                  {isLoggingOut ? t("signingOut") : t("signOut")}
                </span>
                <span className="block text-xs text-muted-foreground transition-colors duration-200 group-hover:text-foreground/72">
                  {t("signOutDescription")}
                </span>
              </span>
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function AccountMenuLink({
  href,
  label,
  description,
  icon,
  onSelect,
}: {
  href: string;
  label: string;
  description: string;
  icon: IconDefinition;
  onSelect: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onSelect}
      className={cn(
        "group flex items-center gap-3 rounded-[1rem] border border-transparent px-3 py-3 text-sm text-foreground outline-none transition-all duration-200 hover:border-[--color-brand]/14 hover:bg-[linear-gradient(180deg,rgba(185,125,70,0.14),rgba(185,125,70,0.08))] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.54)] focus-visible:border-[--color-brand]/16 focus-visible:bg-[linear-gradient(180deg,rgba(185,125,70,0.14),rgba(185,125,70,0.08))]",
      )}
    >
      <span className="flex size-9 items-center justify-center rounded-xl border border-border/80 bg-white/80 text-[--color-brand] transition-all duration-200 group-hover:scale-[1.03] group-hover:border-[--color-brand]/18 group-hover:bg-white">
        <FontAwesomeIcon icon={icon} />
      </span>
      <span className="min-w-0">
        <span className="block font-medium transition-transform duration-200 group-hover:translate-x-0.5">
          {label}
        </span>
        <span className="block text-xs text-muted-foreground transition-colors duration-200 group-hover:text-foreground/72">
          {description}
        </span>
      </span>
    </Link>
  );
}
