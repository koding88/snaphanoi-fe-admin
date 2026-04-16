"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { AdminPageContainer } from "@/components/admin/admin-page-container";
import { AdminSurface } from "@/components/admin/admin-surface";
import { PageHeader } from "@/components/shared/page-header";
import { ChangePasswordForm } from "@/components/users/change-password-form";
import { logout } from "@/features/auth/api/logout";
import { clearAuthClientState } from "@/features/auth/utils/auth-client-state";
import { changeMyPassword } from "@/features/users/api/change-my-password";
import { ROUTES } from "@/lib/constants/routes";
import { notifySuccess } from "@/lib/toast";

export function ChangePasswordPage() {
  const t = useTranslations("users.changePassword.page");
  const router = useRouter();
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    if (!shouldRedirect) {
      return;
    }

    const timeoutId = window.setTimeout(async () => {
      try {
        await logout();
      } catch {
        // Local cleanup still guarantees a fresh login.
      } finally {
        clearAuthClientState({ reason: "logout_after_password_change" });
        router.replace(`${ROUTES.login}?passwordChanged=1`);
      }
    }, 1800);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [router, shouldRedirect]);

  async function handleSubmit(payload: {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
  }) {
    const response = await changeMyPassword(payload);
    notifySuccess(
      response.message,
      t("toasts.success"),
      t("toasts.description"),
    );
    setShouldRedirect(true);
  }

  return (
    <AdminPageContainer tone="hero" className="space-y-8 pb-10">
      <PageHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("description")}
      />
      <AdminSurface className="p-6 md:p-8">
        <ChangePasswordForm onSubmit={handleSubmit} />
      </AdminSurface>
    </AdminPageContainer>
  );
}
