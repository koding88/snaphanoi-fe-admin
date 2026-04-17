"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Button } from "@/components/ui/button";
import { faArrowRotateRight, faSpinner, faTrashCan } from "@/lib/icons/fa";

type BlogCoverFieldProps = {
  previewUrl: string | null;
  title: string | null;
  meta: string | null;
  required?: boolean;
  isUploading: boolean;
  error?: string;
  onSelectFile: (file: File) => void;
  onRemove: () => void;
};

export function BlogCoverField({
  previewUrl,
  title,
  meta,
  required = false,
  isUploading,
  error,
  onSelectFile,
  onRemove,
}: BlogCoverFieldProps) {
  const t = useTranslations("blogs.coverField");
  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className="space-y-4">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) {
            onSelectFile(file);
          }

          event.target.value = "";
        }}
      />
      <div className="overflow-hidden rounded-[1.75rem] border border-border/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(245,240,231,0.92))] shadow-[0_24px_70px_-48px_rgba(15,23,42,0.42)]">
        {previewUrl ? (
          <div className="space-y-4 p-4">
            <div className="overflow-hidden rounded-[1.45rem] border border-border/70 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.94),rgba(233,227,217,0.9))] shadow-[0_24px_54px_-36px_rgba(19,17,14,0.42)]">
              <div className="flex aspect-[4/3] items-center justify-center p-4 md:p-5">
                {/* Blog cover URLs are backend-managed file assets, so plain img keeps the preview flexible. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={previewUrl} alt={title ?? t("coverAlt")} className="h-full w-full object-contain rounded-[1.2rem]" />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex aspect-[4/3] items-center justify-center bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.92),rgba(241,245,249,0.8))] px-6 text-center">
            <div className="max-w-xs space-y-2">
              <p className="text-xs font-semibold tracking-[0.22em] text-[--color-brand-muted] uppercase">
                {t("title")}
              </p>
              <p className="text-sm leading-6 text-foreground/75">
                {required ? t("requiredHint") : t("optionalHint")}
              </p>
              <p className="text-xs font-medium text-muted-foreground">{t("tapHint")}</p>
            </div>
          </div>
        )}
      </div>
      <div className="rounded-[1.35rem] border border-border/70 bg-white/88 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.76)]">
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            className="rounded-full"
            onClick={() => inputRef.current?.click()}
            disabled={isUploading}
          >
            <FontAwesomeIcon icon={faArrowRotateRight} />
            {previewUrl ? t("replace") : t("upload")}
          </Button>
          {previewUrl ? (
            <Button type="button" variant="ghost" className="rounded-full" onClick={onRemove} disabled={isUploading}>
              <FontAwesomeIcon icon={faTrashCan} />
              {t("remove")}
            </Button>
          ) : null}
          <span className="rounded-full border border-border/70 bg-white/80 px-3 py-1 text-[11px] font-semibold tracking-[0.14em] text-[--color-brand-muted] uppercase">
            {required ? t("requiredLabel") : t("optionalLabel")}
          </span>
        </div>

        {title || meta || isUploading || error ? (
          <div className="mt-3 space-y-1 border-t border-border/60 pt-3">
            {title ? <p className="text-sm font-medium text-foreground">{title}</p> : null}
            {meta ? <p className="text-sm text-foreground/75">{meta}</p> : null}
            {isUploading ? (
              <p className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                {t("uploading")}
              </p>
            ) : null}
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
