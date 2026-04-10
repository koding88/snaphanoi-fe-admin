"use client";

import { useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { ProjectCoverPreview } from "@/components/projects/project-cover-preview";
import { Button } from "@/components/ui/button";
import { faArrowRotateRight, faSpinner, faTrashCan } from "@/lib/icons/fa";

type PackageCoverFieldProps = {
  previewUrl: string | null;
  title: string | null;
  meta: string | null;
  required?: boolean;
  isUploading: boolean;
  error?: string;
  onSelectFile: (file: File) => void;
  onRemove: () => void;
};

export function PackageCoverField({
  previewUrl,
  title,
  meta,
  required = false,
  isUploading,
  error,
  onSelectFile,
  onRemove,
}: PackageCoverFieldProps) {
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
          <ProjectCoverPreview
            src={previewUrl}
            alt={title ?? "Package cover"}
            className="rounded-none border-0 bg-transparent shadow-none"
            imageClassName="rounded-[1.2rem]"
          />
        ) : (
          <div className="flex aspect-[4/3] items-center justify-center bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.92),rgba(241,245,249,0.8))] px-6 text-center">
            <div className="max-w-xs space-y-2">
              <p className="text-xs font-semibold tracking-[0.22em] text-[--color-brand-muted] uppercase">
                Cover image
              </p>
              <p className="text-sm leading-6 text-muted-foreground">
                {required
                  ? "Upload the package cover before saving this offer."
                  : "Keep the current cover or replace it when the offer artwork changes."}
              </p>
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
            {previewUrl ? "Replace cover" : "Upload cover"}
          </Button>
          {previewUrl ? (
            <Button
              type="button"
              variant="ghost"
              className="rounded-full"
              onClick={onRemove}
              disabled={isUploading}
            >
              <FontAwesomeIcon icon={faTrashCan} />
              Remove
            </Button>
          ) : null}
          {isUploading ? (
            <p className="inline-flex items-center gap-2 text-sm text-muted-foreground">
              <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
              Uploading cover image...
            </p>
          ) : null}
        </div>

        {title || meta || error ? (
          <div className="mt-3 space-y-1 border-t border-border/60 pt-3">
            {title ? (
              <p className="text-sm font-medium text-foreground">{title}</p>
            ) : null}
            {meta ? <p className="text-sm text-muted-foreground">{meta}</p> : null}
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
