"use client";

import type { ReactNode } from "react";

import { useAuthBootstrap } from "@/features/auth/hooks/use-auth-bootstrap";

type AuthBootstrapProps = {
  children: ReactNode;
};

export function AuthBootstrap({ children }: AuthBootstrapProps) {
  useAuthBootstrap();

  return <>{children}</>;
}
