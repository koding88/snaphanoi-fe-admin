"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";

import { LocalizedNameEditor } from "@/components/shared/localized-name-editor";
import { Button } from "@/components/ui/button";
import { getFriendlyGalleriesError } from "@/features/galleries/utils/galleries-errors";
import { notifyError } from "@/lib/toast";

type GalleryFormValues = {
  en: string;
  vi: string;
  cn: string;
};

type GalleryFormProps = {
  initialValues?: GalleryFormValues;
  submitLabel: string;
  description?: string;
  onSubmit: (payload: { name: GalleryFormValues }) => Promise<void>;
};

export function GalleryForm({
  initialValues = { en: "", vi: "", cn: "" },
  submitLabel,
  description,
  onSubmit,
}: GalleryFormProps) {
  const t = useTranslations("galleries.form");
  const [values, setValues] = useState<GalleryFormValues>(initialValues);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof GalleryFormValues, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextFieldErrors: Partial<Record<keyof GalleryFormValues, string>> = {};

    if (!values.en.trim()) {
      nextFieldErrors.en = t("errors.enRequired");
    }
    if (!values.vi.trim()) {
      nextFieldErrors.vi = t("errors.viRequired");
    }
    if (!values.cn.trim()) {
      nextFieldErrors.cn = t("errors.cnRequired");
    }

    if (Object.keys(nextFieldErrors).length > 0) {
      setFieldErrors(nextFieldErrors);
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);

    try {
      await onSubmit({
        name: {
          en: values.en.trim(),
          vi: values.vi.trim(),
          cn: values.cn.trim(),
        },
      });
    } catch (submissionError) {
      notifyError(getFriendlyGalleriesError(submissionError));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="space-y-8" noValidate onSubmit={handleSubmit}>
      {description ? (
        <div className="rounded-[1.4rem] border border-border/70 bg-white/72 px-4 py-3 text-sm leading-6 text-muted-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.72)]">
          {description}
        </div>
      ) : null}
      <LocalizedNameEditor
        value={values}
        errors={fieldErrors}
        sectionEyebrow={t("sectionEyebrow")}
        sectionTitle={t("localizedTitle")}
        sectionDescription={t("localizedDescription")}
        fieldLabel={t("fieldLabel")}
        placeholders={{
          en: t("placeholders.en"),
          vi: t("placeholders.vi"),
          cn: t("placeholders.cn"),
        }}
        onChange={(locale, nextValue) => {
          setValues((current) => ({ ...current, [locale]: nextValue }));
          setFieldErrors((current) => ({ ...current, [locale]: undefined }));
        }}
      />
      <div className="flex justify-end pt-2">
        <Button type="submit" size="lg" className="min-w-44 rounded-full" disabled={isSubmitting}>
          {isSubmitting ? t("actions.saving") : submitLabel}
        </Button>
      </div>
    </form>
  );
}
