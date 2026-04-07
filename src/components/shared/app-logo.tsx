import Link from "next/link";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faCameraRetro } from "@/lib/icons/fa";
import { cn } from "@/lib/utils";

type AppLogoProps = {
  className?: string;
  compact?: boolean;
};

export function AppLogo({ className, compact = false }: AppLogoProps) {
  return (
    <Link
      href="/login"
      className={cn(
        "inline-flex items-center gap-3 text-left text-foreground transition-opacity hover:opacity-85",
        className,
      )}
    >
      <span className="flex size-11 items-center justify-center rounded-2xl border border-white/12 bg-[linear-gradient(145deg,rgba(205,174,111,0.18),rgba(15,23,42,0.92))] shadow-[0_18px_45px_rgba(15,23,42,0.28)] ring-1 ring-white/10">
        <FontAwesomeIcon icon={faCameraRetro} className="text-sm text-[--color-brand]" />
      </span>
      <span className="flex flex-col">
        <span className="font-heading text-[1.65rem] leading-none tracking-[0.18em] uppercase">
          SnapHanoi
        </span>
        {!compact ? (
          <span className="text-xs tracking-[0.26em] text-muted-foreground uppercase">
            premium admin studio
          </span>
        ) : null}
      </span>
    </Link>
  );
}
