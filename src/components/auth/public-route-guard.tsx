"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import { LoadingState } from "@/components/shared/loading-state";
import { useAuthStore } from "@/features/auth/store/auth.store";

const REDIRECT_WHEN_AUTHENTICATED = new Set(["/login", "/register", "/forgot-password"]);

export function PublicRouteGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const status = useAuthStore((state) => state.status);
  const hasBootstrapped = useAuthStore((state) => state.hasBootstrapped);

  useEffect(() => {
    if (
      hasBootstrapped &&
      status === "authenticated" &&
      REDIRECT_WHEN_AUTHENTICATED.has(pathname)
    ) {
      router.replace("/admin");
    }
  }, [hasBootstrapped, pathname, router, status]);

  if (!hasBootstrapped || status === "loading") {
    return <LoadingState />;
  }

  if (status === "authenticated" && REDIRECT_WHEN_AUTHENTICATED.has(pathname)) {
    return <LoadingState />;
  }

  return <>{children}</>;
}
