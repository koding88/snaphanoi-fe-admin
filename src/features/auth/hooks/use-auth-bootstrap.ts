"use client";

import { useEffect, useRef } from "react";

import { me } from "@/features/auth/api/me";
import { refresh } from "@/features/auth/api/refresh";
import { useAuthStore } from "@/features/auth/store/auth.store";
import {
  clearClientSession,
  readAuthHintCookie,
  readStoredAccessToken,
  persistClientSession,
} from "@/features/auth/utils/auth-storage";

export function useAuthBootstrap() {
  const hasStartedRef = useRef(false);
  const beginBootstrap = useAuthStore((state) => state.beginBootstrap);
  const setAuthenticated = useAuthStore((state) => state.setAuthenticated);
  const setGuest = useAuthStore((state) => state.setGuest);

  useEffect(() => {
    if (hasStartedRef.current) {
      return;
    }

    hasStartedRef.current = true;
    let isMounted = true;

    async function bootstrap() {
      beginBootstrap();

      const accessToken = readStoredAccessToken();
      const hasSessionHint = readAuthHintCookie();

      if (!accessToken && !hasSessionHint) {
        clearClientSession();
        if (isMounted) {
          setGuest();
        }
        return;
      }

      try {
        if (accessToken) {
          const user = await me(accessToken);
          if (!isMounted) {
            return;
          }

          setAuthenticated({ accessToken, user });
          persistClientSession(accessToken);
          return;
        }
      } catch {
        // Fall through to refresh attempt.
      }

      try {
        const refreshed = await refresh();
        if (!isMounted) {
          return;
        }

        persistClientSession(refreshed.accessToken);
        setAuthenticated(refreshed);
      } catch {
        clearClientSession();
        if (isMounted) {
          setGuest();
        }
      }
    }

    void bootstrap();

    return () => {
      isMounted = false;
    };
  }, [beginBootstrap, setAuthenticated, setGuest]);
}
