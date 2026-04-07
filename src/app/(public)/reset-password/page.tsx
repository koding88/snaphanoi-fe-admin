import { AuthStagePlaceholder } from "@/components/auth/auth-stage-placeholder";

export default function ResetPasswordPage() {
  return (
    <AuthStagePlaceholder
      eyebrow="Credential reset"
      title="Reset password route is scaffolded."
      description="This page currently demonstrates the shared auth surface only. The token and password reset flow is intentionally deferred to Stage 2."
    />
  );
}
