"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import { LoadingState } from "@/components/shared/loading-state";
import { useAuthStore } from "@/features/auth/store/auth.store";

export function AdminRouteGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const status = useAuthStore((state) => state.status);
  const hasBootstrapped = useAuthStore((state) => state.hasBootstrapped);

  useEffect(() => {
    if (hasBootstrapped && status === "guest") {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [hasBootstrapped, pathname, router, status]);

  if (!hasBootstrapped || status === "loading") {
    return <LoadingState />;
  }

  if (status !== "authenticated") {
    return <LoadingState />;
  }

  return <>{children}</>;
}
