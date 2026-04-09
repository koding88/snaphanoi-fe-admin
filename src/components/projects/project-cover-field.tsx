"use client";

import { useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Button } from "@/components/ui/button";
import { faArrowRotateRight, faSpinner, faTrashCan } from "@/lib/icons/fa";

type ProjectCoverFieldProps = {
  previewUrl: string | null;
  title: string | null;
  meta: string | null;
  required?: boolean;
  isUploading: boolean;
  error?: string;
  onSelectFile: (file: File) => void;
  onRemove: () => void;
};

export function ProjectCoverField({
  previewUrl,
  title,
  meta,
  required = false,
  isUploading,
  error,
  onSelectFile,
  onRemove,
}: ProjectCoverFieldProps) {
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
      <div className="overflow-hidden rounded-[1.75rem] border border-border/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(247,243,236,0.84))]">
        {previewUrl ? (
          // Cover previews come from presigned storage uploads and existing backend file URLs.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={previewUrl}
            alt={title ?? "Project cover"}
            className="block aspect-[4/3] w-full object-cover"
          />
        ) : (
          <div className="flex aspect-[4/3] items-center justify-center bg-muted/35 px-6 text-center">
            <div className="space-y-2">
              <p className="text-xs font-semibold tracking-[0.22em] text-[--color-brand-muted] uppercase">
                Cover image
              </p>
              <p className="text-sm leading-6 text-muted-foreground">
                {required
                  ? "Upload the primary cover before saving the project."
                  : "Keep the current cover or upload a replacement when needed."}
              </p>
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
        >
          <FontAwesomeIcon icon={previewUrl ? faArrowRotateRight : faArrowRotateRight} />
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
        {title ? <p className="text-sm font-medium text-foreground">{title}</p> : null}
        {meta ? <p className="text-sm text-muted-foreground">{meta}</p> : null}
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
      </div>
    </div>
  );
}
