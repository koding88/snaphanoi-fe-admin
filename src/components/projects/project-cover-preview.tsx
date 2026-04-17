"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { cn } from "@/lib/utils";
import { faSpinner } from "@/lib/icons/fa";

type ProjectCoverPreviewProps = {
  src: string;
  alt: string;
  className?: string;
  imageClassName?: string;
  isPending?: boolean;
  pendingLabel?: string;
  onImageLoad?: () => void;
  onImageError?: () => void;
};

export function ProjectCoverPreview({
  src,
  alt,
  className,
  imageClassName,
  isPending = false,
  pendingLabel,
  onImageLoad,
  onImageError,
}: ProjectCoverPreviewProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[1.9rem] border border-border/80 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.94),rgba(233,227,217,0.9))] shadow-[0_24px_54px_-36px_rgba(19,17,14,0.42)]",
        className,
      )}
      aria-busy={isPending}
    >
      <div className="flex aspect-[4/3] items-center justify-center p-4 md:p-5">
        {/* Project cover URLs are backend-managed file assets, so plain img keeps the preview flexible. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className={cn("h-full w-full object-contain", imageClassName)}
          onLoad={onImageLoad}
          onError={onImageError}
        />
      </div>
      {isPending ? (
        <div className="absolute inset-0 flex items-center justify-center bg-[linear-gradient(180deg,rgba(251,249,245,0.72),rgba(242,236,227,0.84))] backdrop-blur-[2px]">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/88 px-4 py-2 text-sm font-medium text-foreground shadow-[0_14px_32px_-20px_rgba(15,23,42,0.4)]">
            <FontAwesomeIcon icon={faSpinner} className="animate-spin text-[--color-brand-muted]" />
            <span>{pendingLabel}</span>
          </div>
        </div>
      ) : null}
    </div>
  );
}
