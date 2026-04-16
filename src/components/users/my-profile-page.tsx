"use client";

import { useTranslations } from "next-intl";

import { AdminPageContainer } from "@/components/admin/admin-page-container";
import { AdminSurface } from "@/components/admin/admin-surface";
import { BackButton } from "@/components/shared/back-button";
import { PageHeader } from "@/components/shared/page-header";
import { ProfileForm } from "@/components/users/profile-form";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { requestMyEmailChangeOtp } from "@/features/users/api/request-my-email-change-otp";
import { updateMyProfile } from "@/features/users/api/update-my-profile";
import { verifyMyEmailChangeOtp } from "@/features/users/api/verify-my-email-change-otp";
import { ROUTES } from "@/lib/constants/routes";
import { notifySuccess } from "@/lib/toast";

export function MyProfilePage() {
  const t = useTranslations("users.profilePage");
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  if (!user) {
    return (
      <AdminPageContainer className="pb-10">
        <AdminSurface className="p-6 md:p-8">
          <p className="text-sm text-muted-foreground">{t("unavailable")}</p>
        </AdminSurface>
      </AdminPageContainer>
    );
  }

  const currentUser = user;

  async function handleSubmit(payload: { name: string; countryCode: string }) {
    const response = await updateMyProfile(payload);
    const updated = response.data;
    setUser({
      ...currentUser,
      ...updated,
      roleKey: currentUser.roleKey ?? null,
    });
    notifySuccess(response.message, t("toasts.updated"));
  }

  async function handleRequestEmailOtp(payload: { email: string }) {
    return requestMyEmailChangeOtp(payload);
  }

  async function handleVerifyEmailOtp(payload: { email: string; otp: string }) {
    const response = await verifyMyEmailChangeOtp(payload);
    const updated = response.data;

    setUser({
      ...currentUser,
      ...updated,
      roleKey: currentUser.roleKey ?? null,
    });

    return updated;
  }

  return (
    <AdminPageContainer tone="hero" className="space-y-8 pb-10">
      <PageHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("description")}
        meta={<BackButton href={ROUTES.admin.dashboard} />}
      />
      <AdminSurface className="p-6 md:p-8">
        <ProfileForm
          user={currentUser}
          onSubmit={handleSubmit}
          onRequestEmailOtp={handleRequestEmailOtp}
          onVerifyEmailOtp={handleVerifyEmailOtp}
        />
      </AdminSurface>
    </AdminPageContainer>
  );
}
