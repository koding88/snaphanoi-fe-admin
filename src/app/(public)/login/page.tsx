import { AuthStagePlaceholder } from "@/components/auth/auth-stage-placeholder";

export default function LoginPage() {
  return (
    <AuthStagePlaceholder
      eyebrow="Public access"
      title="Login foundation is ready."
      description="Stage 1 only establishes the public shell, typography, spacing system, and API/state groundwork. The actual login flow starts in Stage 2."
      ctaLabel="Go to admin shell preview"
      ctaHref="/admin"
    />
  );
}
