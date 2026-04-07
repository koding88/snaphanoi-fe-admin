import type { ReactNode } from "react";
import Link from "next/link";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faArrowRight } from "@/lib/icons/fa";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type FoundationPlaceholderProps = {
  title: string;
  description: string;
  ctaLabel?: string;
  ctaHref?: string;
  footer?: ReactNode;
};

export function FoundationPlaceholder({
  title,
  description,
  ctaLabel,
  ctaHref,
  footer,
}: FoundationPlaceholderProps) {
  return (
    <div className="rounded-[2rem] border border-border/80 bg-card/92 p-8 shadow-soft backdrop-blur xl:p-10">
      <div className="space-y-4">
        <h2 className="font-heading text-3xl tracking-[0.04em] text-balance text-foreground xl:text-4xl">
          {title}
        </h2>
        <p className="max-w-2xl text-sm leading-7 text-muted-foreground md:text-base">
          {description}
        </p>
      </div>
      {ctaLabel && ctaHref ? (
        <div className="mt-7">
          <Link
            href={ctaHref}
            className={cn(
              buttonVariants({ size: "lg" }),
              "min-w-52 rounded-full px-6",
            )}
          >
            {ctaLabel}
            <FontAwesomeIcon icon={faArrowRight} />
          </Link>
        </div>
      ) : null}
      {footer ? <div className="mt-8">{footer}</div> : null}
    </div>
  );
}
