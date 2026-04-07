"use client";

import { useState } from "react";

import { AdminPageContainer } from "@/components/admin/admin-page-container";
import { AdminSurface } from "@/components/admin/admin-surface";
import { PageHeader } from "@/components/shared/page-header";
import { ProfileForm } from "@/components/users/profile-form";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { updateMyProfile } from "@/features/users/api/update-my-profile";

export function MyProfilePage() {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!user) {
    return (
      <AdminPageContainer className="pb-10">
        <AdminSurface className="p-6 md:p-8">
          <p className="text-sm text-muted-foreground">Current user profile is unavailable.</p>
        </AdminSurface>
      </AdminPageContainer>
    );
  }

  const currentUser = user;

  async function handleSubmit(payload: { name: string; email: string; countryCode: string }) {
    const updated = await updateMyProfile(payload);
    setUser({
      ...currentUser,
      ...updated,
      roleKey: currentUser.roleKey ?? null,
    });
    setSuccessMessage("Profile updated successfully.");
  }

  return (
    <AdminPageContainer tone="hero" className="space-y-8 pb-10">
      <PageHeader
        eyebrow="My profile"
        title="Update your own profile."
        description="This page maps to the dedicated self-service endpoint rather than the generic admin update-user action."
      />
      <AdminSurface className="p-6 md:p-8">
        <ProfileForm user={currentUser} onSubmit={handleSubmit} successMessage={successMessage} />
      </AdminSurface>
    </AdminPageContainer>
  );
}
