import Link from "next/link";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faCameraRetro } from "@/lib/icons/fa";
import { cn } from "@/lib/utils";

type AppLogoProps = {
  className?: string;
  compact?: boolean;
  collapsed?: boolean;
};

export function AppLogo({ className, compact = false, collapsed = false }: AppLogoProps) {
  return (
    <Link
      href="/login"
      className={cn(
        "inline-flex items-center gap-3 text-left text-foreground transition-opacity hover:opacity-85",
        className,
        collapsed && "justify-center",
      )}
    >
      <span className="flex size-11 items-center justify-center rounded-2xl border border-white/12 bg-[linear-gradient(145deg,rgba(205,174,111,0.18),rgba(15,23,42,0.92))] shadow-[0_18px_45px_rgba(15,23,42,0.28)] ring-1 ring-white/10 transition-transform duration-300 ease-out">
        <FontAwesomeIcon icon={faCameraRetro} className="text-sm text-[--color-brand]" />
      </span>
      {!collapsed && (
        <span className="flex flex-col transition-all duration-300 ease-out">
          <span className="font-heading text-[1.65rem] leading-none tracking-[0.18em] uppercase">
            SnapHanoi
          </span>
          {!compact ? (
            <span className="text-xs tracking-[0.26em] text-muted-foreground uppercase">
              premium admin studio
            </span>
          ) : null}
        </span>
      )}
    </Link>
  );
}
