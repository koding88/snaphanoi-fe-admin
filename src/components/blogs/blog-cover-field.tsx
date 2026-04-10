"use client";

import { useRef } from "react";
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
      <div className="overflow-hidden rounded-[1.85rem] border border-border/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(247,242,234,0.88))] shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
        {previewUrl ? (
          <div className="space-y-4 p-4">
            <div className="overflow-hidden rounded-[1.45rem] border border-border/70 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.94),rgba(233,227,217,0.9))] shadow-[0_24px_54px_-36px_rgba(19,17,14,0.42)]">
              <div className="flex aspect-[4/3] items-center justify-center p-4 md:p-5">
                {/* Blog cover URLs are backend-managed file assets, so plain img keeps the preview flexible. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={previewUrl} alt={title ?? "Blog cover"} className="h-full w-full object-contain rounded-[1.2rem]" />
              </div>
            </div>
            {(title || meta) ? (
              <div className="rounded-[1.35rem] border border-border/70 bg-white/76 px-4 py-3">
                {title ? <p className="text-sm font-medium text-foreground">{title}</p> : null}
                {meta ? <p className="mt-1 text-sm text-muted-foreground">{meta}</p> : null}
              </div>
            ) : null}
          </div>
        ) : (
          <div className="flex aspect-[4/3] items-center justify-center bg-muted/35 px-6 text-center">
            <div className="space-y-2">
              <p className="text-xs font-semibold tracking-[0.22em] text-[--color-brand-muted] uppercase">
                Cover image
              </p>
              <p className="text-sm leading-6 text-muted-foreground">
                {required
                  ? "Upload the lead cover before saving the blog."
                  : "Keep the current cover or upload a replacement when needed."}
              </p>
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" onClick={() => inputRef.current?.click()} disabled={isUploading}>
          <FontAwesomeIcon icon={faArrowRotateRight} />
          {previewUrl ? "Replace cover" : "Upload cover"}
        </Button>
        {previewUrl ? (
          <Button type="button" variant="ghost" onClick={onRemove} disabled={isUploading}>
            <FontAwesomeIcon icon={faTrashCan} />
            Remove
          </Button>
        ) : null}
      </div>
      <div className="space-y-1">
        {isUploading ? (
          <p className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
            Uploading cover image...
          </p>
        ) : null}
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
      </div>
    </div>
  );
}
