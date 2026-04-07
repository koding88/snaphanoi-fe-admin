import { AuthCard } from "@/components/auth/auth-card";
import { FoundationPlaceholder } from "@/components/shared/foundation-placeholder";

type AuthStagePlaceholderProps = {
  eyebrow: string;
  title: string;
  description: string;
  ctaLabel?: string;
  ctaHref?: string;
};

export function AuthStagePlaceholder({
  eyebrow,
  title,
  description,
  ctaLabel,
  ctaHref,
}: AuthStagePlaceholderProps) {
  return (
    <AuthCard>
      <div className="mb-6">
        <p className="text-xs font-semibold tracking-[0.3em] text-[--color-brand-muted] uppercase">
          {eyebrow}
        </p>
      </div>
      <FoundationPlaceholder
        title={title}
        description={description}
        ctaLabel={ctaLabel}
        ctaHref={ctaHref}
      />
    </AuthCard>
  );
}
