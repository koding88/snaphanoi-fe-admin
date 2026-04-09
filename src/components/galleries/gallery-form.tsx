"use client";

import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  const [values, setValues] = useState<GalleryFormValues>(initialValues);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof GalleryFormValues, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextFieldErrors: Partial<Record<keyof GalleryFormValues, string>> = {};

    if (!values.en.trim()) {
      nextFieldErrors.en = "English name is required.";
    }
    if (!values.vi.trim()) {
      nextFieldErrors.vi = "Vietnamese name is required.";
    }
    if (!values.cn.trim()) {
      nextFieldErrors.cn = "Chinese name is required.";
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
    <form className="space-y-6" noValidate onSubmit={handleSubmit}>
      {description ? <p className="text-sm leading-7 text-muted-foreground">{description}</p> : null}
      <div className="grid gap-5 md:grid-cols-2">
        <label className="space-y-2 md:col-span-2">
          <span className="text-sm font-medium text-foreground">English name</span>
          <Input
            value={values.en}
            onChange={(event) => {
              setValues((current) => ({ ...current, en: event.target.value }));
              setFieldErrors((current) => ({ ...current, en: undefined }));
            }}
            placeholder="Couple"
            aria-invalid={Boolean(fieldErrors.en)}
          />
          {fieldErrors.en ? <p className="text-sm text-red-600">{fieldErrors.en}</p> : null}
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-foreground">Vietnamese name</span>
          <Input
            value={values.vi}
            onChange={(event) => {
              setValues((current) => ({ ...current, vi: event.target.value }));
              setFieldErrors((current) => ({ ...current, vi: undefined }));
            }}
            placeholder="Cap doi"
            aria-invalid={Boolean(fieldErrors.vi)}
          />
          {fieldErrors.vi ? <p className="text-sm text-red-600">{fieldErrors.vi}</p> : null}
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-foreground">Chinese name</span>
          <Input
            value={values.cn}
            onChange={(event) => {
              setValues((current) => ({ ...current, cn: event.target.value }));
              setFieldErrors((current) => ({ ...current, cn: undefined }));
            }}
            placeholder="情侣"
            aria-invalid={Boolean(fieldErrors.cn)}
          />
          {fieldErrors.cn ? <p className="text-sm text-red-600">{fieldErrors.cn}</p> : null}
        </label>
      </div>
      <div className="flex justify-end pt-2">
        <Button type="submit" size="lg" className="min-w-44 rounded-full" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}
