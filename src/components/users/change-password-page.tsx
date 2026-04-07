"use client";

import { useState } from "react";

import { AdminPageContainer } from "@/components/admin/admin-page-container";
import { AdminSurface } from "@/components/admin/admin-surface";
import { PageHeader } from "@/components/shared/page-header";
import { ChangePasswordForm } from "@/components/users/change-password-form";
import { changeMyPassword } from "@/features/users/api/change-my-password";

export function ChangePasswordPage() {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  async function handleSubmit(payload: {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
  }) {
    await changeMyPassword(payload);
    setSuccessMessage("Password changed successfully.");
  }

  return (
    <AdminPageContainer tone="hero" className="space-y-8 pb-10">
      <PageHeader
        eyebrow="Password"
        title="Change your password."
        description="This page uses the dedicated self-service password endpoint and keeps credential UX separate from general profile updates."
      />
      <AdminSurface className="p-6 md:p-8">
        <ChangePasswordForm onSubmit={handleSubmit} successMessage={successMessage} />
      </AdminSurface>
    </AdminPageContainer>
  );
}
