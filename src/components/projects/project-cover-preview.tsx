import { cn } from "@/lib/utils";

type ProjectCoverPreviewProps = {
  src: string;
  alt: string;
  className?: string;
  imageClassName?: string;
};

export function ProjectCoverPreview({
  src,
  alt,
  className,
  imageClassName,
}: ProjectCoverPreviewProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-[1.9rem] border border-border/80 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.94),rgba(233,227,217,0.9))] shadow-[0_24px_54px_-36px_rgba(19,17,14,0.42)]",
        className,
      )}
    >
      <div className="flex aspect-[4/3] items-center justify-center p-4 md:p-5">
        {/* Project cover URLs are backend-managed file assets, so plain img keeps the preview flexible. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className={cn("h-full w-full object-contain", imageClassName)}
        />
      </div>
    </div>
  );
}
