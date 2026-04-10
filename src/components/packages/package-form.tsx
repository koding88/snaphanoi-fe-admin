"use client";

import {
  useEffect,
  useState,
  type FormEvent,
  type TextareaHTMLAttributes,
} from "react";

import { PackageCoverField } from "@/components/packages/package-cover-field";
import { PackageCurrencySelect } from "@/components/packages/package-currency-select";
import { Button } from "@/components/ui/button";
import { fieldChrome, Input } from "@/components/ui/input";
import { requestUpload } from "@/features/files/api/request-upload";
import { uploadFileToStorage } from "@/features/files/api/upload-file-to-storage";
import type { RequestUploadResult } from "@/features/files/types/files.types";
import type { PackageMutationPayload } from "@/features/packages/types/packages-api.types";
import type {
  PackageFileRecord,
  PackageLocalizedText,
} from "@/features/packages/types/packages.types";
import {
  formatPackageAmountInput,
  formatPackageDuration,
  formatPackagePrice,
  parsePackageAmountInput,
  packageDurationMinutesToSeconds,
  packageDurationSecondsToMinutes,
} from "@/features/packages/utils/package-format";
import { getFriendlyPackagesError } from "@/features/packages/utils/packages-errors";
import { cn } from "@/lib/utils";
import { notifyError } from "@/lib/toast";

type PackageFormValues = {
  name: PackageLocalizedText;
  bestFor: PackageLocalizedText;
  durationMinutes: number | null;
  photoCount: number | null;
  pricing: {
    amount: number | null;
    currency: string;
  };
};

type PackageFormProps = {
  mode: "create" | "edit";
  initialValues?: Partial<PackageFormValues>;
  existingCoverImage?: PackageFileRecord | null;
  submitLabel: string;
  description?: string;
  onSubmit: (payload: PackageMutationPayload) => Promise<void>;
};

type CoverUploadState = {
  previewUrl: string | null;
  title: string | null;
  meta: string | null;
  uploadToken?: string;
  existingCoverImage?: PackageFileRecord | null;
  changed: boolean;
};

const EMPTY_LOCALIZED_TEXT: PackageLocalizedText = {
  en: "",
  vi: "",
  cn: "",
};

const DEFAULT_COVER_STATE: CoverUploadState = {
  previewUrl: null,
  title: null,
  meta: null,
  changed: false,
};

function getCoverMeta(file: { mimeType: string; size: number }) {
  return `${file.mimeType} · ${Math.max(1, Math.round(file.size / 1024))} KB`;
}

type LocaleKey = keyof PackageLocalizedText;

const LOCALE_FIELDS: Array<{
  key: LocaleKey;
  label: string;
  shortLabel: string;
  namePlaceholder: string;
  bestForPlaceholder: string;
}> = [
  {
    key: "en",
    label: "English",
    shortLabel: "EN",
    namePlaceholder: "Wedding Signature",
    bestForPlaceholder: "Couples who want an elegant half-day story",
  },
  {
    key: "vi",
    label: "Vietnamese",
    shortLabel: "VI",
    namePlaceholder: "Goi chup cuoi",
    bestForPlaceholder: "Phu hop cho cap doi muon mot buoi chup gon gang",
  },
  {
    key: "cn",
    label: "Chinese",
    shortLabel: "CN",
    namePlaceholder: "婚礼拍摄套餐",
    bestForPlaceholder: "适合想要精致半天拍摄的情侣",
  },
];

function getLocalizedFieldError(
  fieldErrors: {
    nameEn?: string;
    nameVi?: string;
    nameCn?: string;
    bestForEn?: string;
    bestForVi?: string;
    bestForCn?: string;
  },
  group: "name" | "bestFor",
  locale: LocaleKey,
) {
  const key = `${group}${locale.charAt(0).toUpperCase()}${locale.slice(
    1,
  )}` as
    | "nameEn"
    | "nameVi"
    | "nameCn"
    | "bestForEn"
    | "bestForVi"
    | "bestForCn";

  return fieldErrors[key];
}

function PackageFormSection({
  eyebrow,
  title,
  description,
  children,
  className,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-[1.8rem] border border-border/75 bg-white/78 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.76)] md:p-6",
        className,
      )}
    >
      <div className="mb-5 space-y-2">
        <p className="text-[11px] font-semibold tracking-[0.22em] text-[--color-brand-muted] uppercase">
          {eyebrow}
        </p>
        <div className="space-y-1">
          <h3 className="text-lg font-semibold tracking-tight text-foreground">
            {title}
          </h3>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        </div>
      </div>
      {children}
    </section>
  );
}

function LocaleGroupHeader({
  title,
  description,
  meta,
}: {
  title: string;
  description: string;
  meta?: React.ReactNode;
}) {
  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
      <div className="space-y-1">
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="text-sm leading-6 text-muted-foreground">{description}</p>
      </div>
      {meta ? <div>{meta}</div> : null}
    </div>
  );
}

function StableTextarea({
  className,
  fixedHeightClass,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & {
  fixedHeightClass: string;
}) {
  return (
    <textarea
      {...props}
      className={cn(
        fieldChrome,
        "resize-none overflow-y-auto py-3 text-base leading-7 transition-[border-color,box-shadow,background-color] duration-200",
        fixedHeightClass,
        className,
      )}
    />
  );
}

function LocaleSwitch({
  locales,
  activeLocale,
  onChange,
  getStatus,
}: {
  locales: typeof LOCALE_FIELDS;
  activeLocale: LocaleKey;
  onChange: (locale: LocaleKey) => void;
  getStatus: (locale: LocaleKey) => "complete" | "incomplete" | "neutral";
}) {
  const activeIndex = locales.findIndex((locale) => locale.key === activeLocale);

  return (
    <div className="relative inline-flex rounded-full border border-border/75 bg-white/78 p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.72)]">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-1 bottom-1 left-1 w-20 rounded-full bg-[linear-gradient(180deg,rgba(205,174,111,0.24),rgba(205,174,111,0.12))] shadow-[0_10px_22px_-16px_rgba(185,125,70,0.6)] transition-transform duration-300 ease-out"
        style={{
          transform: `translateX(${activeIndex * 100}%)`,
        }}
      />
      {locales.map((locale) => {
        const status = getStatus(locale.key);
        const isActive = activeLocale === locale.key;

        return (
          <button
            key={locale.key}
            type="button"
            onClick={() => onChange(locale.key)}
            className={cn(
              "relative z-10 flex w-20 cursor-pointer items-center justify-center rounded-full px-3 py-1.5 text-xs font-semibold tracking-[0.18em] uppercase transition-colors duration-200",
              "hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-brand]/20",
              isActive
                ? "text-[--color-brand]"
                : "text-muted-foreground",
            )}
          >
            <span className="flex items-center gap-2">
              <span
                className={cn(
                  "h-2.5 w-2.5 rounded-full border border-white/60 transition-[transform,background-color] duration-200",
                  isActive && "scale-110",
                  status === "complete" && "bg-emerald-500",
                  status === "incomplete" && "bg-red-500",
                  status === "neutral" && "bg-border",
                )}
              />
              {locale.shortLabel}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function LocaleEditor({
  locales,
  group,
  activeLocale,
  onChangeLocale,
  getStatus,
  completedCount,
  value,
  onChangeValue,
  label,
  placeholder,
  error,
  multiline = false,
}: {
  locales: typeof LOCALE_FIELDS;
  group: "name" | "bestFor";
  activeLocale: LocaleKey;
  onChangeLocale: (locale: LocaleKey) => void;
  getStatus: (locale: LocaleKey) => "complete" | "incomplete" | "neutral";
  completedCount: number;
  value: string;
  onChangeValue: (value: string) => void;
  label: string;
  placeholder: string;
  error?: string;
  multiline?: boolean;
}) {
  const localeMeta = locales.find((locale) => locale.key === activeLocale);

  return (
    <div className="space-y-4">
      <LocaleGroupHeader
        title={group === "name" ? "Package names" : "Best for"}
        description={
          group === "name"
            ? "Pick a locale and fill it. All 3 locales are required."
            : "Edit one locale at a time to keep longer copy readable."
        }
        meta={
          <div className="flex items-center gap-3">
            <span className="rounded-full border border-border/70 bg-white/78 px-3 py-1.5 text-[11px] font-semibold tracking-[0.16em] text-[--color-brand-muted] uppercase">
              {completedCount}/3 ready
            </span>
            <LocaleSwitch
              locales={locales}
              activeLocale={activeLocale}
              onChange={onChangeLocale}
              getStatus={getStatus}
            />
          </div>
        }
      />

      <div className="rounded-[1.2rem] border border-border/70 bg-white/86 p-4 md:p-5">
        <div className="mb-3 flex flex-wrap items-center gap-3">
          <span className="rounded-full border border-[--color-brand]/20 bg-[--color-brand-soft] px-3 py-1 text-[11px] font-semibold tracking-[0.18em] text-[--color-brand] uppercase">
            {localeMeta?.shortLabel}
          </span>
          <div className="space-y-0.5">
            <p className="text-sm font-medium text-foreground">{label}</p>
            <p className="text-xs text-muted-foreground">
              {localeMeta?.label} locale
            </p>
          </div>
        </div>

        {multiline ? (
          <StableTextarea
            value={value}
            onChange={(event) => onChangeValue(event.target.value)}
            placeholder={placeholder}
            aria-invalid={Boolean(error)}
            rows={5}
            fixedHeightClass="h-36"
          />
        ) : (
          <StableTextarea
            value={value}
            onChange={(event) => onChangeValue(event.target.value)}
            placeholder={placeholder}
            aria-invalid={Boolean(error)}
            rows={2}
            fixedHeightClass="h-28"
            className="leading-8"
          />
        )}

        {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
      </div>
    </div>
  );
}

export function PackageForm({
  mode,
  initialValues,
  existingCoverImage = null,
  submitLabel,
  description,
  onSubmit,
}: PackageFormProps) {
  const [values, setValues] = useState<PackageFormValues>({
    name: initialValues?.name ?? EMPTY_LOCALIZED_TEXT,
    bestFor: initialValues?.bestFor ?? EMPTY_LOCALIZED_TEXT,
    durationMinutes: initialValues?.durationMinutes ?? null,
    photoCount: initialValues?.photoCount ?? null,
    pricing: {
      amount: initialValues?.pricing?.amount ?? null,
      currency: initialValues?.pricing?.currency ?? "VND",
    },
  });
  const [activeNameLocale, setActiveNameLocale] = useState<LocaleKey>("en");
  const [activeBestForLocale, setActiveBestForLocale] =
    useState<LocaleKey>("en");
  const [amountInput, setAmountInput] = useState(() =>
    formatPackageAmountInput(initialValues?.pricing?.amount ?? null),
  );
  const [cover, setCover] = useState<CoverUploadState>(() =>
    existingCoverImage
      ? {
          previewUrl: existingCoverImage.url,
          title: existingCoverImage.originalName,
          meta: getCoverMeta(existingCoverImage),
          existingCoverImage,
          changed: false,
        }
      : DEFAULT_COVER_STATE,
  );
  const [fieldErrors, setFieldErrors] = useState<{
    nameEn?: string;
    nameVi?: string;
    nameCn?: string;
    bestForEn?: string;
    bestForVi?: string;
    bestForCn?: string;
    duration?: string;
    photoCount?: string;
    pricingAmount?: string;
    pricingCurrency?: string;
    cover?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);
  const previewLocale = activeNameLocale;
  const previewName = values.name[previewLocale].trim();
  const previewBestFor = values.bestFor[previewLocale].trim();
  const previewDurationSeconds =
    values.durationMinutes && values.durationMinutes > 0
      ? packageDurationMinutesToSeconds(values.durationMinutes)
      : 0;
  const previewDurationLabel =
    previewDurationSeconds > 0
      ? formatPackageDuration(previewDurationSeconds)
      : "Session length pending";
  const previewPhotosLabel =
    values.photoCount != null && values.photoCount >= 0
      ? `${values.photoCount} photos`
      : "Photo count pending";
  const previewPriceLabel =
    values.pricing.amount != null && values.pricing.currency.trim()
      ? formatPackagePrice({
          amount: values.pricing.amount,
          currency: values.pricing.currency.trim().toUpperCase(),
        })
      : "Pricing pending";
  const hasCover = Boolean(cover.previewUrl);

  useEffect(() => {
    if (!existingCoverImage) {
      return;
    }

    setCover({
      previewUrl: existingCoverImage.url,
      title: existingCoverImage.originalName,
      meta: getCoverMeta(existingCoverImage),
      existingCoverImage,
      changed: false,
    });
  }, [existingCoverImage]);

  useEffect(() => {
    setAmountInput(formatPackageAmountInput(values.pricing.amount));
  }, [values.pricing.amount]);

  async function uploadPackageCover(file: File) {
    const requested = await requestUpload({
      fileName: file.name,
      mimeType: file.type,
      size: file.size,
      kind: "image",
      purpose: "package-cover",
    });

    const uploadInfo: RequestUploadResult = requested.data;

    await uploadFileToStorage({
      uploadUrl: uploadInfo.uploadUrl,
      file,
      headers: uploadInfo.headers,
    });

    return {
      uploadToken: uploadInfo.uploadToken,
      url: uploadInfo.url,
      originalName: file.name,
      mimeType: file.type,
      size: file.size,
    };
  }

  async function handleCoverUpload(file: File) {
    setIsUploadingCover(true);
    setFieldErrors((current) => ({ ...current, cover: undefined }));

    try {
      const uploaded = await uploadPackageCover(file);

      setCover({
        previewUrl: uploaded.url,
        title: uploaded.originalName,
        meta: `${uploaded.mimeType} · ${Math.max(
          1,
          Math.round(uploaded.size / 1024),
        )} KB`,
        uploadToken: uploaded.uploadToken,
        existingCoverImage,
        changed: true,
      });
    } catch (error) {
      notifyError(getFriendlyPackagesError(error));
      setFieldErrors((current) => ({
        ...current,
        cover: "The cover image could not be uploaded. Please try again.",
      }));
    } finally {
      setIsUploadingCover(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAttemptedSubmit(true);

    const nextFieldErrors: typeof fieldErrors = {};

    if (!values.name.en.trim()) {
      nextFieldErrors.nameEn = "English package name is required.";
    }
    if (!values.name.vi.trim()) {
      nextFieldErrors.nameVi = "Vietnamese package name is required.";
    }
    if (!values.name.cn.trim()) {
      nextFieldErrors.nameCn = "Chinese package name is required.";
    }
    if (!values.bestFor.en.trim()) {
      nextFieldErrors.bestForEn = "English best-for copy is required.";
    }
    if (!values.bestFor.vi.trim()) {
      nextFieldErrors.bestForVi = "Vietnamese best-for copy is required.";
    }
    if (!values.bestFor.cn.trim()) {
      nextFieldErrors.bestForCn = "Chinese best-for copy is required.";
    }
    if (
      !Number.isFinite(values.durationMinutes) ||
      (values.durationMinutes ?? 0) <= 0
    ) {
      nextFieldErrors.duration = "Duration must be a positive number of minutes.";
    }
    if (
      !Number.isFinite(values.photoCount) ||
      (values.photoCount ?? 0) < 0
    ) {
      nextFieldErrors.photoCount =
        "Photo count must be zero or greater.";
    }
    if (
      !Number.isFinite(values.pricing.amount) ||
      (values.pricing.amount ?? 0) < 0
    ) {
      nextFieldErrors.pricingAmount =
        "Pricing amount must be zero or greater.";
    }
    if (!values.pricing.currency.trim()) {
      nextFieldErrors.pricingCurrency = "Pricing currency is required.";
    }
    if (mode === "create" && !cover.uploadToken) {
      nextFieldErrors.cover = "Upload a package cover before saving.";
    }

    setFieldErrors(nextFieldErrors);

    if (Object.keys(nextFieldErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit({
        name: {
          en: values.name.en.trim(),
          vi: values.name.vi.trim(),
          cn: values.name.cn.trim(),
        },
        bestFor: {
          en: values.bestFor.en.trim(),
          vi: values.bestFor.vi.trim(),
          cn: values.bestFor.cn.trim(),
        },
        duration: packageDurationMinutesToSeconds(Number(values.durationMinutes)),
        photoCount: Number(values.photoCount),
        pricing: {
          amount: Number(values.pricing.amount),
          currency: values.pricing.currency.trim().toUpperCase(),
        },
        ...(cover.changed && cover.uploadToken
          ? { coverImageUploadToken: cover.uploadToken }
          : {}),
      });
    } catch (submissionError) {
      notifyError(getFriendlyPackagesError(submissionError));
    } finally {
      setIsSubmitting(false);
    }
  }

  function getLocaleStatus(
    group: "name" | "bestFor",
    locale: LocaleKey,
  ): "complete" | "incomplete" | "neutral" {
    const value = values[group][locale].trim();

    if (value) {
      return "complete";
    }

    return attemptedSubmit ? "incomplete" : "neutral";
  }

  function getLocaleStatusForGroup(group: "name" | "bestFor") {
    return (locale: LocaleKey) => getLocaleStatus(group, locale);
  }

  function countCompletedLocales(group: "name" | "bestFor") {
    return LOCALE_FIELDS.filter((locale) => values[group][locale.key].trim()).length;
  }

  function handleLocaleFocus(locale: LocaleKey) {
    setActiveNameLocale(locale);
    setActiveBestForLocale(locale);
  }

  return (
    <form className="space-y-8" noValidate onSubmit={handleSubmit}>
      {description ? (
        <div className="rounded-[1.4rem] border border-border/70 bg-white/72 px-4 py-3 text-sm leading-6 text-muted-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.72)]">
          {description}
        </div>
      ) : null}

      <section className="rounded-[2rem] border border-border/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(247,243,236,0.86))] p-5 shadow-[0_28px_80px_-56px_rgba(15,23,42,0.38)] md:p-7">
        <div className="mb-6 flex flex-col gap-3 border-b border-border/60 pb-5">
          <div className="space-y-2">
            <p className="text-xs font-semibold tracking-[0.2em] text-[--color-brand-muted] uppercase">
              Package details
            </p>
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-foreground">
                Build this package offer
              </h2>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
                Fill the localized offer copy first, then confirm the booking numbers, pricing, and cover before saving.
              </p>
            </div>
          </div>
        </div>

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.28fr)_minmax(320px,0.72fr)]">
          <div className="space-y-5">
            <PackageFormSection
              eyebrow="Names"
              title="Localized package naming"
              description="Fill all locales for the package name."
            >
              <LocaleEditor
                locales={LOCALE_FIELDS}
                group="name"
                activeLocale={activeNameLocale}
                onChangeLocale={handleLocaleFocus}
                getStatus={getLocaleStatusForGroup("name")}
                completedCount={countCompletedLocales("name")}
                value={values.name[activeNameLocale]}
                onChangeValue={(nextValue) => {
                  setValues((current) => ({
                    ...current,
                    name: {
                      ...current.name,
                      [activeNameLocale]: nextValue,
                    },
                  }));
                  setFieldErrors((current) => ({
                    ...current,
                    [`name${activeNameLocale.charAt(0).toUpperCase()}${activeNameLocale.slice(1)}`]:
                      undefined,
                  }));
                }}
                label="Package name"
                placeholder={
                  LOCALE_FIELDS.find((locale) => locale.key === activeNameLocale)
                    ?.namePlaceholder ?? ""
                }
                error={getLocalizedFieldError(
                  fieldErrors,
                  "name",
                  activeNameLocale,
                )}
              />
            </PackageFormSection>

            <PackageFormSection
              eyebrow="Audience"
              title="Best-fit positioning"
              description="Define who this package is for in each locale."
            >
              <LocaleEditor
                locales={LOCALE_FIELDS}
                group="bestFor"
                activeLocale={activeBestForLocale}
                onChangeLocale={handleLocaleFocus}
                getStatus={getLocaleStatusForGroup("bestFor")}
                completedCount={countCompletedLocales("bestFor")}
                value={values.bestFor[activeBestForLocale]}
                onChangeValue={(nextValue) => {
                  setValues((current) => ({
                    ...current,
                    bestFor: {
                      ...current.bestFor,
                      [activeBestForLocale]: nextValue,
                    },
                  }));
                  setFieldErrors((current) => ({
                    ...current,
                    [`bestFor${activeBestForLocale.charAt(0).toUpperCase()}${activeBestForLocale.slice(1)}`]:
                      undefined,
                  }));
                }}
                label="Best for"
                placeholder={
                  LOCALE_FIELDS.find((locale) => locale.key === activeBestForLocale)
                    ?.bestForPlaceholder ?? ""
                }
                error={getLocalizedFieldError(
                  fieldErrors,
                  "bestFor",
                  activeBestForLocale,
                )}
                multiline
              />
            </PackageFormSection>

            <PackageFormSection
              eyebrow="Offer setup"
              title="Offer details and pricing"
              description="Set delivery numbers and price in one pass."
            >
              <div className="grid gap-5 xl:grid-cols-2">
                <div className="space-y-4 rounded-[1.2rem] border border-border/70 bg-white/86 p-4">
                  <p className="text-xs font-semibold tracking-[0.16em] text-[--color-brand-muted] uppercase">
                    Offer details
                  </p>
                  <label className="min-w-0 space-y-2">
                    <span className="text-sm font-medium text-foreground">
                      Duration (minutes)
                    </span>
                    <Input
                      type="number"
                      min={1}
                      step={1}
                      value={values.durationMinutes ?? ""}
                      onChange={(event) => {
                        const nextValue = event.target.value;
                        setValues((current) => ({
                          ...current,
                          durationMinutes:
                            nextValue === "" ? null : Number(nextValue),
                        }));
                        setFieldErrors((current) => ({
                          ...current,
                          duration: undefined,
                        }));
                      }}
                      placeholder="90"
                      aria-invalid={Boolean(fieldErrors.duration)}
                      className="h-14 text-lg tracking-[0.02em]"
                    />
                    <p className="text-xs text-muted-foreground">
                      Saved to backend as seconds.
                    </p>
                    {fieldErrors.duration ? (
                      <p className="text-sm text-red-600">{fieldErrors.duration}</p>
                    ) : null}
                  </label>

                  <label className="min-w-0 space-y-2">
                    <span className="text-sm font-medium text-foreground">
                      Photo count
                    </span>
                    <Input
                      type="number"
                      min={0}
                      step={1}
                      value={values.photoCount ?? ""}
                      onChange={(event) => {
                        const nextValue = event.target.value;
                        setValues((current) => ({
                          ...current,
                          photoCount:
                            nextValue === "" ? null : Number(nextValue),
                        }));
                        setFieldErrors((current) => ({
                          ...current,
                          photoCount: undefined,
                        }));
                      }}
                      placeholder="80"
                      aria-invalid={Boolean(fieldErrors.photoCount)}
                      className="h-14 text-lg tracking-[0.02em]"
                    />
                    <p className="text-xs text-muted-foreground">
                      Final delivered image count.
                    </p>
                    {fieldErrors.photoCount ? (
                      <p className="text-sm text-red-600">{fieldErrors.photoCount}</p>
                    ) : null}
                  </label>
                </div>

                <div className="space-y-4 rounded-[1.2rem] border border-border/70 bg-white/86 p-4">
                  <p className="text-xs font-semibold tracking-[0.16em] text-[--color-brand-muted] uppercase">
                    Pricing
                  </p>
                  <label className="min-w-0 space-y-2">
                    <span className="text-sm font-medium text-foreground">
                      Amount
                    </span>
                    <Input
                      type="text"
                      inputMode="numeric"
                      value={amountInput}
                      onChange={(event) => {
                        const nextAmount = parsePackageAmountInput(
                          event.target.value,
                        );

                        setAmountInput(formatPackageAmountInput(nextAmount));
                        setValues((current) => ({
                          ...current,
                          pricing: {
                            ...current.pricing,
                            amount: nextAmount,
                          },
                        }));
                        setFieldErrors((current) => ({
                          ...current,
                          pricingAmount: undefined,
                        }));
                      }}
                      placeholder="1,000,000"
                      aria-invalid={Boolean(fieldErrors.pricingAmount)}
                      className="h-14 min-w-0 text-lg tracking-[0.02em]"
                    />
                    <p className="text-xs text-muted-foreground">
                      Auto-formatted while typing.
                    </p>
                    {fieldErrors.pricingAmount ? (
                      <p className="text-sm text-red-600">
                        {fieldErrors.pricingAmount}
                      </p>
                    ) : null}
                  </label>

                  <label className="min-w-0 space-y-2">
                    <span className="text-sm font-medium text-foreground">
                      Currency
                    </span>
                    <PackageCurrencySelect
                      className="min-w-0"
                      value={values.pricing.currency}
                      onChange={(nextValue) => {
                        setValues((current) => ({
                          ...current,
                          pricing: {
                            ...current.pricing,
                            currency: nextValue,
                          },
                        }));
                        setFieldErrors((current) => ({
                          ...current,
                          pricingCurrency: undefined,
                        }));
                      }}
                    />
                    <p className="text-xs text-muted-foreground">
                      Search by country, code, or symbol.
                    </p>
                    {fieldErrors.pricingCurrency ? (
                      <p className="text-sm text-red-600">
                        {fieldErrors.pricingCurrency}
                      </p>
                    ) : null}
                  </label>
                </div>
              </div>
            </PackageFormSection>
          </div>

          <div className="space-y-5">
            <PackageFormSection
              eyebrow="Cover"
              title="Lead package artwork"
              description={
                mode === "create"
                  ? "Upload the main package image before saving. The same upload-token flow is kept intact."
                  : "Keep the current package cover or replace it without changing the existing update behavior."
              }
              className="sticky top-6"
            >
              <PackageCoverField
                previewUrl={cover.previewUrl}
                title={cover.title}
                meta={cover.meta}
                required={mode === "create"}
                isUploading={isUploadingCover}
                error={fieldErrors.cover}
                onSelectFile={(file) => {
                  void handleCoverUpload(file);
                }}
                onRemove={() => {
                  if (existingCoverImage) {
                    setCover({
                      previewUrl: existingCoverImage.url,
                      title: existingCoverImage.originalName,
                      meta: getCoverMeta(existingCoverImage),
                      existingCoverImage,
                      changed: false,
                    });
                    return;
                  }

                  setCover(DEFAULT_COVER_STATE);
                }}
              />
              <div className="mt-6 border-t border-border/60 pt-6">
                <p className="mb-4 text-[11px] font-semibold tracking-[0.16em] text-[--color-brand-muted] uppercase">
                  Customer-facing preview
                </p>
                <article className="overflow-hidden rounded-[1.5rem] border border-border/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.99),rgba(247,243,236,0.95))] shadow-[0_30px_70px_-44px_rgba(15,23,42,0.35)]">
                  <div className="relative aspect-[4/5] overflow-hidden bg-[linear-gradient(180deg,rgba(249,245,238,0.88),rgba(241,236,228,0.9))]">
                    {hasCover ? (
                      <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.45),rgba(232,224,212,0.5))] p-3">
                        <img
                          src={cover.previewUrl ?? ""}
                          alt={previewName || "Package cover preview"}
                          className="h-full w-full rounded-[1rem] object-contain object-center"
                        />
                      </div>
                    ) : (
                      <div className="flex h-full items-center justify-center px-6 text-center text-sm text-muted-foreground">
                        Upload a cover image to render the customer card hero.
                      </div>
                    )}
                    <span className="absolute top-3 right-3 rounded-full border border-white/45 bg-black/40 px-2.5 py-1 text-[10px] font-semibold tracking-[0.14em] text-white/90 uppercase">
                      {previewLocale.toUpperCase()}
                    </span>
                  </div>

                  <div className="space-y-4 px-6 pt-6 pb-6 text-center">
                    <h4 className="line-clamp-2 text-3xl leading-tight font-semibold tracking-tight text-foreground">
                      {previewName || "Package name in active locale"}
                    </h4>

                    <div className="space-y-3">
                      <div className="space-y-1">
                        <p className="text-[10px] font-semibold tracking-[0.18em] text-[--color-brand-muted] uppercase">
                          Best for
                        </p>
                        <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">
                          {previewBestFor || "Best-for description in active locale"}
                        </p>
                      </div>

                      <div className="space-y-1">
                        <p className="text-[10px] font-semibold tracking-[0.18em] text-[--color-brand-muted] uppercase">
                          Duration
                        </p>
                        <p className="text-sm font-medium text-foreground">
                          {previewDurationLabel}
                        </p>
                      </div>

                      <div className="space-y-1">
                        <p className="text-[10px] font-semibold tracking-[0.18em] text-[--color-brand-muted] uppercase">
                          Number of photos
                        </p>
                        <p className="text-sm font-medium text-foreground">
                          {previewPhotosLabel}
                        </p>
                      </div>
                    </div>

                    <p className="text-2xl font-semibold tracking-tight text-foreground">
                      {previewPriceLabel}
                    </p>

                    <Button
                      type="button"
                      className="h-12 w-full rounded-full text-sm font-semibold tracking-[0.08em] uppercase"
                    >
                      Request Now
                    </Button>
                  </div>
                </article>
              </div>
            </PackageFormSection>
          </div>
        </div>
      </section>

      <div className="rounded-[1.65rem] border border-border/75 bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(247,243,236,0.9))] p-4 shadow-[0_20px_48px_-38px_rgba(15,23,42,0.35)]">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <p className="text-[11px] font-semibold tracking-[0.18em] text-[--color-brand-muted] uppercase">
              Final check
            </p>
            <p className="text-sm text-muted-foreground">
              Save once the localized copy, raw session numbers, pricing object, and cover artwork all look correct.
            </p>
          </div>
          <Button
            type="submit"
            size="lg"
            className="min-w-52 rounded-full"
            disabled={isSubmitting || isUploadingCover}
          >
            {isSubmitting ? "Saving..." : submitLabel}
          </Button>
        </div>
      </div>
    </form>
  );
}

export function getPackageFormInitialValues(pkg: {
  name: PackageLocalizedText;
  bestFor: PackageLocalizedText;
  duration: number;
  photoCount: number;
  pricing: {
    amount: number;
    currency: string;
  };
}) {
  return {
    name: {
      en: pkg.name.en,
      vi: pkg.name.vi,
      cn: pkg.name.cn,
    },
    bestFor: {
      en: pkg.bestFor.en,
      vi: pkg.bestFor.vi,
      cn: pkg.bestFor.cn,
    },
    durationMinutes: packageDurationSecondsToMinutes(pkg.duration),
    photoCount: pkg.photoCount,
    pricing: {
      amount: pkg.pricing.amount,
      currency: pkg.pricing.currency,
    },
  };
}
