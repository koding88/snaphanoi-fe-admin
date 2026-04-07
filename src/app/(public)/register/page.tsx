import { AuthStagePlaceholder } from "@/components/auth/auth-stage-placeholder";

export default function RegisterPage() {
  return (
    <AuthStagePlaceholder
      eyebrow="Registration"
      title="Registration page shell is staged."
      description="This route is intentionally kept at layout and messaging level. No registration request flow is implemented before Stage 2."
    />
  );
}
