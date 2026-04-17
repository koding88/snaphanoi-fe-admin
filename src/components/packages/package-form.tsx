"use client";

import {
  useEffect,
  useState,
  type FormEvent,
  type TextareaHTMLAttributes,
} from "react";
import { useTranslations } from "next-intl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
import { faSpinner } from "@/lib/icons/fa";
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

type LocaleField = {
  key: LocaleKey;
  label: string;
  shortLabel: string;
  namePlaceholder: string;
  bestForPlaceholder: string;
};

function createLocaleFields(t: ReturnType<typeof useTranslations>): LocaleField[] {
  return [
    {
      key: "en",
      label: t("locales.en.label"),
      shortLabel: t("locales.en.short"),
      namePlaceholder: t("locales.en.namePlaceholder"),
      bestForPlaceholder: t("locales.en.bestForPlaceholder"),
    },
    {
      key: "vi",
      label: t("locales.vi.label"),
      shortLabel: t("locales.vi.short"),
      namePlaceholder: t("locales.vi.namePlaceholder"),
      bestForPlaceholder: t("locales.vi.bestForPlaceholder"),
    },
    {
      key: "cn",
      label: t("locales.cn.label"),
      shortLabel: t("locales.cn.short"),
      namePlaceholder: t("locales.cn.namePlaceholder"),
      bestForPlaceholder: t("locales.cn.bestForPlaceholder"),
    },
  ];
}

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
  locales: LocaleField[];
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
  t,
}: {
  locales: LocaleField[];
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
  t: ReturnType<typeof useTranslations>;
}) {
  const localeMeta = locales.find((locale) => locale.key === activeLocale);

  return (
    <div className="space-y-4">
      <LocaleGroupHeader
        title={group === "name" ? t("localeEditor.packageNames") : t("localeEditor.bestFor")}
        description={
          group === "name"
            ? t("localeEditor.namesDescription")
            : t("localeEditor.bestForDescription")
        }
        meta={
          <div className="flex items-center gap-3">
            <span className="rounded-full border border-border/70 bg-white/78 px-3 py-1.5 text-[11px] font-semibold tracking-[0.16em] text-[--color-brand-muted] uppercase">
              {t("localeEditor.ready", { count: completedCount })}
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
              {t("localeEditor.localeLabel", { locale: localeMeta?.label ?? "" })}
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
  const t = useTranslations("packages.form");
  const localeFields = createLocaleFields(t);
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
  const [isCoverPreviewPending, setIsCoverPreviewPending] = useState(false);
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);
  const isCoverBusy = isUploadingCover || isCoverPreviewPending;
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
      : t("preview.sessionPending");
  const previewPhotosLabel =
    values.photoCount != null && values.photoCount >= 0
      ? t("preview.photos", { count: values.photoCount })
      : t("preview.photoPending");
  const previewPriceLabel =
    values.pricing.amount != null && values.pricing.currency.trim()
      ? formatPackagePrice({
          amount: values.pricing.amount,
          currency: values.pricing.currency.trim().toUpperCase(),
        })
      : t("preview.pricingPending");
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
    setIsCoverPreviewPending(false);
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
    setIsCoverPreviewPending(true);
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
      setIsCoverPreviewPending(false);
      setFieldErrors((current) => ({
        ...current,
        cover: t("errors.coverUploadFailed"),
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
      nextFieldErrors.nameEn = t("errors.nameEnRequired");
    }
    if (!values.name.vi.trim()) {
      nextFieldErrors.nameVi = t("errors.nameViRequired");
    }
    if (!values.name.cn.trim()) {
      nextFieldErrors.nameCn = t("errors.nameCnRequired");
    }
    if (!values.bestFor.en.trim()) {
      nextFieldErrors.bestForEn = t("errors.bestForEnRequired");
    }
    if (!values.bestFor.vi.trim()) {
      nextFieldErrors.bestForVi = t("errors.bestForViRequired");
    }
    if (!values.bestFor.cn.trim()) {
      nextFieldErrors.bestForCn = t("errors.bestForCnRequired");
    }
    if (
      !Number.isFinite(values.durationMinutes) ||
      (values.durationMinutes ?? 0) <= 0
    ) {
      nextFieldErrors.duration = t("errors.durationInvalid");
    }
    if (
      !Number.isFinite(values.photoCount) ||
      (values.photoCount ?? 0) < 0
    ) {
      nextFieldErrors.photoCount = t("errors.photoCountInvalid");
    }
    if (
      !Number.isFinite(values.pricing.amount) ||
      (values.pricing.amount ?? 0) < 0
    ) {
      nextFieldErrors.pricingAmount = t("errors.pricingAmountInvalid");
    }
    if (!values.pricing.currency.trim()) {
      nextFieldErrors.pricingCurrency = t("errors.pricingCurrencyRequired");
    }
    if (mode === "create" && !cover.uploadToken) {
      nextFieldErrors.cover = t("errors.coverRequired");
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
    return localeFields.filter((locale) => values[group][locale.key].trim()).length;
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
              {t("sections.packageDetails.eyebrow")}
            </p>
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-foreground">
                {t("sections.packageDetails.title")}
              </h2>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
                {t("sections.packageDetails.description")}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.28fr)_minmax(320px,0.72fr)]">
          <div className="space-y-5">
            <PackageFormSection
              eyebrow={t("sections.names.eyebrow")}
              title={t("sections.names.title")}
              description={t("sections.names.description")}
            >
              <LocaleEditor
                locales={localeFields}
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
                label={t("sections.names.fieldLabel")}
                placeholder={
                  localeFields.find((locale) => locale.key === activeNameLocale)
                    ?.namePlaceholder ?? ""
                }
                error={getLocalizedFieldError(
                  fieldErrors,
                  "name",
                  activeNameLocale,
                )}
                t={t}
              />
            </PackageFormSection>

            <PackageFormSection
              eyebrow={t("sections.audience.eyebrow")}
              title={t("sections.audience.title")}
              description={t("sections.audience.description")}
            >
              <LocaleEditor
                locales={localeFields}
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
                label={t("sections.audience.fieldLabel")}
                placeholder={
                  localeFields.find((locale) => locale.key === activeBestForLocale)
                    ?.bestForPlaceholder ?? ""
                }
                error={getLocalizedFieldError(
                  fieldErrors,
                  "bestFor",
                  activeBestForLocale,
                )}
                multiline
                t={t}
              />
            </PackageFormSection>

            <PackageFormSection
              eyebrow={t("sections.offer.eyebrow")}
              title={t("sections.offer.title")}
              description={t("sections.offer.description")}
            >
              <div className="grid gap-5 xl:grid-cols-2">
                <div className="space-y-4 rounded-[1.2rem] border border-border/70 bg-white/86 p-4">
                  <p className="text-xs font-semibold tracking-[0.16em] text-[--color-brand-muted] uppercase">
                    {t("sections.offer.detailsTitle")}
                  </p>
                  <label className="min-w-0 space-y-2">
                    <span className="text-sm font-medium text-foreground">
                      {t("fields.durationMinutes")}
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
                      placeholder={t("fields.durationPlaceholder")}
                      aria-invalid={Boolean(fieldErrors.duration)}
                      className="h-14 text-lg tracking-[0.02em]"
                    />
                    <p className="text-xs text-muted-foreground">
                      {t("fields.durationHint")}
                    </p>
                    {fieldErrors.duration ? (
                      <p className="text-sm text-red-600">{fieldErrors.duration}</p>
                    ) : null}
                  </label>

                  <label className="min-w-0 space-y-2">
                    <span className="text-sm font-medium text-foreground">
                      {t("fields.photoCount")}
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
                      placeholder={t("fields.photoCountPlaceholder")}
                      aria-invalid={Boolean(fieldErrors.photoCount)}
                      className="h-14 text-lg tracking-[0.02em]"
                    />
                    <p className="text-xs text-muted-foreground">
                      {t("fields.photoCountHint")}
                    </p>
                    {fieldErrors.photoCount ? (
                      <p className="text-sm text-red-600">{fieldErrors.photoCount}</p>
                    ) : null}
                  </label>
                </div>

                <div className="space-y-4 rounded-[1.2rem] border border-border/70 bg-white/86 p-4">
                  <p className="text-xs font-semibold tracking-[0.16em] text-[--color-brand-muted] uppercase">
                    {t("sections.offer.pricingTitle")}
                  </p>
                  <label className="min-w-0 space-y-2">
                    <span className="text-sm font-medium text-foreground">
                      {t("fields.amount")}
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
                      placeholder={t("fields.amountPlaceholder")}
                      aria-invalid={Boolean(fieldErrors.pricingAmount)}
                      className="h-14 min-w-0 text-lg tracking-[0.02em]"
                    />
                    <p className="text-xs text-muted-foreground">
                      {t("fields.amountHint")}
                    </p>
                    {fieldErrors.pricingAmount ? (
                      <p className="text-sm text-red-600">
                        {fieldErrors.pricingAmount}
                      </p>
                    ) : null}
                  </label>

                  <label className="min-w-0 space-y-2">
                    <span className="text-sm font-medium text-foreground">
                      {t("fields.currency")}
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
                      {t("fields.currencyHint")}
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
              eyebrow={t("sections.cover.eyebrow")}
              title={t("sections.cover.title")}
              description={
                mode === "create"
                  ? t("sections.cover.createDescription")
                  : t("sections.cover.editDescription")
              }
              className="sticky top-6"
            >
              <PackageCoverField
                previewUrl={cover.previewUrl}
                title={cover.title}
                meta={cover.meta}
                required={mode === "create"}
                isUploading={isUploadingCover}
                isPreviewPending={isCoverPreviewPending}
                error={fieldErrors.cover}
                onSelectFile={(file) => {
                  void handleCoverUpload(file);
                }}
                onPreviewReady={() => {
                  setIsCoverPreviewPending(false);
                }}
                onPreviewError={() => {
                  setIsCoverPreviewPending(false);
                  setFieldErrors((current) => ({
                    ...current,
                    cover: t("errors.coverUploadFailed"),
                  }));
                }}
              />
              <div className="mt-6 border-t border-border/60 pt-6">
                <p className="mb-4 text-[11px] font-semibold tracking-[0.16em] text-[--color-brand-muted] uppercase">
                  {t("preview.title")}
                </p>
                <article className="overflow-hidden rounded-[1.5rem] border border-border/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.99),rgba(247,243,236,0.95))] shadow-[0_30px_70px_-44px_rgba(15,23,42,0.35)]">
                  <div className="relative aspect-[4/5] overflow-hidden bg-[linear-gradient(180deg,rgba(249,245,238,0.88),rgba(241,236,228,0.9))]">
                    {hasCover ? (
                      <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.45),rgba(232,224,212,0.5))] p-3">
                        <img
                          src={cover.previewUrl ?? ""}
                          alt={previewName || t("preview.coverAlt")}
                          className={cn(
                            "h-full w-full rounded-[1rem] object-contain object-center transition-opacity duration-200",
                            isCoverBusy ? "opacity-70" : "opacity-100",
                          )}
                        />
                      </div>
                    ) : (
                      <div className="flex h-full items-center justify-center px-6 text-center text-sm text-muted-foreground">
                        {t("preview.uploadHint")}
                      </div>
                    )}
                    {hasCover && isCoverBusy ? (
                      <div className="absolute inset-0 flex items-center justify-center bg-[linear-gradient(180deg,rgba(251,249,245,0.45),rgba(242,236,227,0.68))] backdrop-blur-[2px]">
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/88 px-4 py-2 text-sm font-medium text-foreground shadow-[0_14px_32px_-20px_rgba(15,23,42,0.4)]">
                          <FontAwesomeIcon icon={faSpinner} className="animate-spin text-[--color-brand-muted]" />
                          <span>{t("coverField.uploading")}</span>
                        </div>
                      </div>
                    ) : null}
                    <span className="absolute top-3 right-3 rounded-full border border-white/45 bg-black/40 px-2.5 py-1 text-[10px] font-semibold tracking-[0.14em] text-white/90 uppercase">
                      {previewLocale.toUpperCase()}
                    </span>
                  </div>

                  <div className="space-y-4 px-6 pt-6 pb-6 text-center">
                    <h4 className="line-clamp-2 text-3xl leading-tight font-semibold tracking-tight text-foreground">
                      {previewName || t("preview.nameFallback")}
                    </h4>

                    <div className="space-y-3">
                      <div className="space-y-1">
                        <p className="text-[10px] font-semibold tracking-[0.18em] text-[--color-brand-muted] uppercase">
                          {t("preview.bestFor")}
                        </p>
                        <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">
                          {previewBestFor || t("preview.bestForFallback")}
                        </p>
                      </div>

                      <div className="space-y-1">
                        <p className="text-[10px] font-semibold tracking-[0.18em] text-[--color-brand-muted] uppercase">
                          {t("preview.duration")}
                        </p>
                        <p className="text-sm font-medium text-foreground">
                          {previewDurationLabel}
                        </p>
                      </div>

                      <div className="space-y-1">
                        <p className="text-[10px] font-semibold tracking-[0.18em] text-[--color-brand-muted] uppercase">
                          {t("preview.photoCount")}
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
                      {t("preview.requestNow")}
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
              {t("finalCheck.title")}
            </p>
            <p className="text-sm text-muted-foreground">
              {t("finalCheck.description")}
            </p>
          </div>
          <Button
            type="submit"
            size="lg"
            className="min-w-52 rounded-full"
            disabled={isSubmitting || isCoverBusy}
          >
            {isSubmitting ? t("actions.saving") : submitLabel}
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
