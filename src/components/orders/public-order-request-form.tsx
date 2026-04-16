"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";

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
  const t = useTranslations("orders.publicRequest");
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
        description: t("packageOption", { photos: pkg.photoCount, minutes: Math.max(1, Math.round(pkg.duration / 60)) }),
      })),
    [packages, t],
  );

  function setField<Value extends keyof FormState>(key: Value, value: FormState[Value]) {
    setForm((current) => ({ ...current, [key]: value }));
    setFieldErrors((current) => ({ ...current, [key]: "" }));
  }

  function validate() {
    const nextErrors: Record<string, string> = {};

    if (!form.name.trim()) {
      nextErrors.name = t("errors.nameRequired");
    }

    if (!form.email.trim()) {
      nextErrors.email = t("errors.emailRequired");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      nextErrors.email = t("errors.emailInvalid");
    }

    if (!form.galleryId) {
      nextErrors.galleryId = t("errors.galleryRequired");
    }

    if (!form.discoverySource.trim()) {
      nextErrors.discoverySource = t("errors.discoveryRequired");
    }

    if (!form.personalStory.trim()) {
      nextErrors.personalStory = t("errors.storyRequired");
    }

    if (form.mode === "package") {
      if (!form.packageId) {
        nextErrors.packageId = t("errors.packageRequired");
      }
    } else {
      const parsedBudget = Number(form.budgetAmount.replace(/[^\d.]/g, ""));
      if (!Number.isFinite(parsedBudget) || parsedBudget <= 0) {
        nextErrors.budgetAmount = t("errors.budgetAmountInvalid");
      }
      if (!form.budgetCurrency.trim()) {
        nextErrors.budgetCurrency = t("errors.budgetCurrencyRequired");
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
        t("toasts.submittedTitle"),
        t("toasts.submittedDescription"),
      );
    } catch (error) {
      notifyError(getFriendlyOrdersError(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthFormShell
      eyebrow={t("eyebrow")}
      title={t("title")}
      description={t("description")}
      footer={
        <div className="text-sm text-white/65">
          <Link href={ROUTES.publicOrders.confirm} className="transition-opacity hover:opacity-100">
            {t("footer.confirmLink")}
          </Link>
        </div>
      }
    >
      <form className="space-y-5" noValidate onSubmit={handleSubmit}>
        {hasRequested ? (
          <AuthFeedback variant="success">
            {t("success")}
          </AuthFeedback>
        ) : null}
        <div className="space-y-2">
          <p className="text-sm font-medium text-white/92">{t("fields.requestType")}</p>
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
              {t("fields.modePackage")}
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
              {t("fields.modeCustom")}
            </button>
          </div>
        </div>
        <AuthField label={t("fields.fullName")} htmlFor="order-name" error={fieldErrors.name}>
          <Input
            id="order-name"
            value={form.name}
            onChange={(event) => setField("name", event.target.value)}
            placeholder={t("fields.fullNamePlaceholder")}
            aria-invalid={Boolean(fieldErrors.name)}
          />
        </AuthField>
        <AuthField label={t("fields.email")} htmlFor="order-email" error={fieldErrors.email}>
          <Input
            id="order-email"
            type="email"
            value={form.email}
            onChange={(event) => setField("email", event.target.value)}
            placeholder={t("fields.emailPlaceholder")}
            aria-invalid={Boolean(fieldErrors.email)}
          />
        </AuthField>
        <AuthField
          label={t("fields.country")}
          htmlFor="order-country"
        >
          <CountrySelect
            id="order-country"
            value={form.countryCode}
            onChange={(countryCode) => setField("countryCode", countryCode)}
          />
        </AuthField>
        <AuthField label={t("fields.gallery")} htmlFor="order-gallery" error={fieldErrors.galleryId}>
          <AppSelect
            value={form.galleryId}
            onChange={(value) => setField("galleryId", value)}
            options={galleryOptions}
            placeholder={isBootstrapping ? t("fields.loadingGalleries") : t("fields.selectGallery")}
            disabled={isBootstrapping}
          />
        </AuthField>
        {form.mode === "package" ? (
          <AuthField label={t("fields.package")} htmlFor="order-package" error={fieldErrors.packageId}>
            <AppSelect
              value={form.packageId}
              onChange={(value) => setField("packageId", value)}
              options={packageOptions}
              placeholder={isBootstrapping ? t("fields.loadingPackages") : t("fields.selectPackage")}
              disabled={isBootstrapping}
            />
          </AuthField>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            <AuthField
              label={t("fields.budgetAmount")}
              htmlFor="order-budget-amount"
              error={fieldErrors.budgetAmount}
            >
              <Input
                id="order-budget-amount"
                inputMode="numeric"
                value={form.budgetAmount}
                onChange={(event) => setField("budgetAmount", event.target.value)}
                placeholder={t("fields.budgetAmountPlaceholder")}
                aria-invalid={Boolean(fieldErrors.budgetAmount)}
              />
            </AuthField>
            <AuthField
              label={t("fields.budgetCurrency")}
              htmlFor="order-budget-currency"
              error={fieldErrors.budgetCurrency}
            >
              <Input
                id="order-budget-currency"
                value={form.budgetCurrency}
                onChange={(event) => setField("budgetCurrency", event.target.value)}
                placeholder={t("fields.budgetCurrencyPlaceholder")}
                aria-invalid={Boolean(fieldErrors.budgetCurrency)}
              />
            </AuthField>
          </div>
        )}
        <AuthField
          label={t("fields.discoverySource")}
          htmlFor="order-discovery"
          error={fieldErrors.discoverySource}
        >
          <Input
            id="order-discovery"
            value={form.discoverySource}
            onChange={(event) => setField("discoverySource", event.target.value)}
            placeholder={t("fields.discoveryPlaceholder")}
            aria-invalid={Boolean(fieldErrors.discoverySource)}
          />
        </AuthField>
        <AuthField
          label={t("fields.personalStory")}
          htmlFor="order-personal-story"
          error={fieldErrors.personalStory}
        >
          <textarea
            id="order-personal-story"
            value={form.personalStory}
            onChange={(event) => setField("personalStory", event.target.value)}
            placeholder={t("fields.personalStoryPlaceholder")}
            rows={5}
            className="flex w-full rounded-2xl border border-border/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(250,247,241,0.92))] px-4 py-3 text-sm text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.72),0_8px_18px_rgba(15,23,42,0.04)] outline-none transition-all duration-300 placeholder:text-muted-foreground/80 focus:border-[--color-brand]/40 focus:bg-white focus:ring-3 focus:ring-[--color-brand]/12"
          />
        </AuthField>
        <Button type="submit" size="lg" className="h-12 w-full rounded-full" disabled={isSubmitting}>
          {isSubmitting ? t("actions.submitting") : t("actions.submit")}
        </Button>
      </form>
    </AuthFormShell>
  );
}
