"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import Link from "next/link";

import { AuthFeedback } from "@/components/auth/auth-feedback";
import { AuthField } from "@/components/auth/auth-field";
import { AuthFormShell } from "@/components/auth/auth-form-shell";
import { CountrySelect } from "@/components/shared/country-select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AppSelect } from "@/components/ui/select";
import { listPublicOrderGalleries } from "@/features/orders/api/list-public-order-galleries";
import { listPublicOrderPackages } from "@/features/orders/api/list-public-order-packages";
import { requestOrderPublic } from "@/features/orders/api/request-order-public";
import type { PublicOrderRequestPayload } from "@/features/orders/types/orders-api.types";
import type {
  PublicOrderGalleryOption,
  PublicOrderPackageOption,
} from "@/features/orders/types/orders.types";
import { getFriendlyOrdersError } from "@/features/orders/utils/orders-errors";
import { ROUTES } from "@/lib/constants/routes";
import { notifyError, notifySuccess } from "@/lib/toast";
import { cn } from "@/lib/utils";

type RequestMode = "package" | "custom";

type FormState = {
  mode: RequestMode;
  name: string;
  email: string;
  countryCode: string;
  galleryId: string;
  packageId: string;
  budgetAmount: string;
  budgetCurrency: string;
  discoverySource: string;
  personalStory: string;
};

const DEFAULT_FORM: FormState = {
  mode: "package",
  name: "",
  email: "",
  countryCode: "VN",
  galleryId: "",
  packageId: "",
  budgetAmount: "",
  budgetCurrency: "VND",
  discoverySource: "",
  personalStory: "",
};

export function PublicOrderRequestForm() {
  const [form, setForm] = useState<FormState>(DEFAULT_FORM);
  const [galleries, setGalleries] = useState<PublicOrderGalleryOption[]>([]);
  const [packages, setPackages] = useState<PublicOrderPackageOption[]>([]);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasRequested, setHasRequested] = useState(false);

  useEffect(() => {
    async function bootstrap() {
      setIsBootstrapping(true);

      try {
        const [galleryResult, packageResult] = await Promise.all([
          listPublicOrderGalleries(),
          listPublicOrderPackages(),
        ]);

        setGalleries(galleryResult);
        setPackages(packageResult);
      } catch (error) {
        notifyError(getFriendlyOrdersError(error));
      } finally {
        setIsBootstrapping(false);
      }
    }

    void bootstrap();
  }, []);

  const galleryOptions = useMemo(
    () =>
      galleries.map((gallery) => ({
        value: gallery.id,
        label: gallery.name,
      })),
    [galleries],
  );

  const packageOptions = useMemo(
    () =>
      packages.map((pkg) => ({
        value: pkg.id,
        label: pkg.name,
        description: `${pkg.photoCount} photos · ${Math.max(1, Math.round(pkg.duration / 60))} min`,
      })),
    [packages],
  );

  function setField<Value extends keyof FormState>(key: Value, value: FormState[Value]) {
    setForm((current) => ({ ...current, [key]: value }));
    setFieldErrors((current) => ({ ...current, [key]: "" }));
  }

  function validate() {
    const nextErrors: Record<string, string> = {};

    if (!form.name.trim()) {
      nextErrors.name = "Name is required.";
    }

    if (!form.email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!form.galleryId) {
      nextErrors.galleryId = "Gallery is required.";
    }

    if (!form.discoverySource.trim()) {
      nextErrors.discoverySource = "Discovery source is required.";
    }

    if (!form.personalStory.trim()) {
      nextErrors.personalStory = "Personal story is required.";
    }

    if (form.mode === "package") {
      if (!form.packageId) {
        nextErrors.packageId = "Package selection is required for package requests.";
      }
    } else {
      const parsedBudget = Number(form.budgetAmount.replace(/[^\d.]/g, ""));
      if (!Number.isFinite(parsedBudget) || parsedBudget <= 0) {
        nextErrors.budgetAmount = "Budget amount must be greater than zero.";
      }
      if (!form.budgetCurrency.trim()) {
        nextErrors.budgetCurrency = "Budget currency is required.";
      }
    }

    setFieldErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const sharedPayload = {
        name: form.name.trim(),
        email: form.email.trim(),
        countryCode: form.countryCode,
        galleryId: form.galleryId,
        discoverySource: form.discoverySource.trim(),
        personalStory: form.personalStory.trim(),
      };

      const payload: PublicOrderRequestPayload =
        form.mode === "package"
          ? {
              ...sharedPayload,
              packageId: form.packageId,
            }
          : {
              ...sharedPayload,
              budget: {
                amount: Number(form.budgetAmount.replace(/[^\d.]/g, "")),
                currency: form.budgetCurrency.trim().toUpperCase(),
              },
            };

      const response = await requestOrderPublic(payload);
      setHasRequested(true);
      notifySuccess(
        response.message,
        "Request submitted successfully.",
        "Please check your email and confirm from the link.",
      );
    } catch (error) {
      notifyError(getFriendlyOrdersError(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthFormShell
      eyebrow="Order request"
      title="Start your order request."
      description="Submit the request first, then confirm via the email link to create the actual order."
      footer={
        <div className="text-sm text-white/65">
          <Link href={ROUTES.publicOrders.confirm} className="transition-opacity hover:opacity-100">
            Already have a token? Confirm request
          </Link>
        </div>
      }
    >
      <form className="space-y-5" noValidate onSubmit={handleSubmit}>
        {hasRequested ? (
          <AuthFeedback variant="success">
            Confirmation email sent. Open the email and confirm to finish order creation.
          </AuthFeedback>
        ) : null}
        <div className="space-y-2">
          <p className="text-sm font-medium text-white/92">Request type</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setField("mode", "package")}
              className={cn(
                "h-10 flex-1 rounded-full border px-4 text-sm font-medium transition",
                form.mode === "package"
                  ? "border-[--color-brand]/45 bg-[--color-brand-soft] text-[--color-brand]"
                  : "border-white/20 bg-white/6 text-white/75 hover:border-white/30 hover:text-white",
              )}
            >
              Package request
            </button>
            <button
              type="button"
              onClick={() => setField("mode", "custom")}
              className={cn(
                "h-10 flex-1 rounded-full border px-4 text-sm font-medium transition",
                form.mode === "custom"
                  ? "border-[--color-brand]/45 bg-[--color-brand-soft] text-[--color-brand]"
                  : "border-white/20 bg-white/6 text-white/75 hover:border-white/30 hover:text-white",
              )}
            >
              Custom request
            </button>
          </div>
        </div>
        <AuthField label="Full name" htmlFor="order-name" error={fieldErrors.name}>
          <Input
            id="order-name"
            value={form.name}
            onChange={(event) => setField("name", event.target.value)}
            placeholder="Nguyen Van A"
            aria-invalid={Boolean(fieldErrors.name)}
          />
        </AuthField>
        <AuthField label="Email" htmlFor="order-email" error={fieldErrors.email}>
          <Input
            id="order-email"
            type="email"
            value={form.email}
            onChange={(event) => setField("email", event.target.value)}
            placeholder="customer@example.com"
            aria-invalid={Boolean(fieldErrors.email)}
          />
        </AuthField>
        <AuthField
          label="Country"
          htmlFor="order-country"
        >
          <CountrySelect
            id="order-country"
            value={form.countryCode}
            onChange={(countryCode) => setField("countryCode", countryCode)}
          />
        </AuthField>
        <AuthField label="Gallery" htmlFor="order-gallery" error={fieldErrors.galleryId}>
          <AppSelect
            value={form.galleryId}
            onChange={(value) => setField("galleryId", value)}
            options={galleryOptions}
            placeholder={isBootstrapping ? "Loading galleries..." : "Select gallery"}
            disabled={isBootstrapping}
          />
        </AuthField>
        {form.mode === "package" ? (
          <AuthField label="Package" htmlFor="order-package" error={fieldErrors.packageId}>
            <AppSelect
              value={form.packageId}
              onChange={(value) => setField("packageId", value)}
              options={packageOptions}
              placeholder={isBootstrapping ? "Loading packages..." : "Select package"}
              disabled={isBootstrapping}
            />
          </AuthField>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            <AuthField
              label="Budget amount"
              htmlFor="order-budget-amount"
              error={fieldErrors.budgetAmount}
            >
              <Input
                id="order-budget-amount"
                inputMode="numeric"
                value={form.budgetAmount}
                onChange={(event) => setField("budgetAmount", event.target.value)}
                placeholder="2500000"
                aria-invalid={Boolean(fieldErrors.budgetAmount)}
              />
            </AuthField>
            <AuthField
              label="Budget currency"
              htmlFor="order-budget-currency"
              error={fieldErrors.budgetCurrency}
            >
              <Input
                id="order-budget-currency"
                value={form.budgetCurrency}
                onChange={(event) => setField("budgetCurrency", event.target.value)}
                placeholder="VND"
                aria-invalid={Boolean(fieldErrors.budgetCurrency)}
              />
            </AuthField>
          </div>
        )}
        <AuthField
          label="How did you discover us?"
          htmlFor="order-discovery"
          error={fieldErrors.discoverySource}
        >
          <Input
            id="order-discovery"
            value={form.discoverySource}
            onChange={(event) => setField("discoverySource", event.target.value)}
            placeholder="facebook"
            aria-invalid={Boolean(fieldErrors.discoverySource)}
          />
        </AuthField>
        <AuthField
          label="Personal story"
          htmlFor="order-personal-story"
          error={fieldErrors.personalStory}
        >
          <textarea
            id="order-personal-story"
            value={form.personalStory}
            onChange={(event) => setField("personalStory", event.target.value)}
            placeholder="Tell us what you want us to capture..."
            rows={5}
            className="flex w-full rounded-2xl border border-border/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(250,247,241,0.92))] px-4 py-3 text-sm text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.72),0_8px_18px_rgba(15,23,42,0.04)] outline-none transition-all duration-300 placeholder:text-muted-foreground/80 focus:border-[--color-brand]/40 focus:bg-white focus:ring-3 focus:ring-[--color-brand]/12"
          />
        </AuthField>
        <Button type="submit" size="lg" className="h-12 w-full rounded-full" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit request"}
        </Button>
      </form>
    </AuthFormShell>
  );
}
