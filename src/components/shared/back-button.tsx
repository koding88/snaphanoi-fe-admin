"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { faArrowRight } from "@/lib/icons/fa";

type BackButtonProps = {
  /** Target route to go back to */
  href?: string;
  /** Show confirm dialog before navigating (use for create/edit pages) */
  confirm?: boolean;
  /** Custom confirm title */
  confirmTitle?: string;
  /** Custom confirm description */
  confirmDescription?: string;
  /** Custom confirm label */
  confirmLabel?: string;
  /** Show the back label text, or just icon */
  showLabel?: boolean;
  /** Custom className */
  className?: string;
};

export function BackButton({
  href,
  confirm = false,
  confirmTitle = "Leave this page?",
  confirmDescription = "Any unsaved changes will be lost.",
  confirmLabel = "Leave page",
  showLabel = true,
  className,
}: BackButtonProps) {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);

  function handleBack() {
    if (href) {
      router.push(href);
    } else {
      router.back();
    }
  }

  function handleClick() {
    if (confirm) {
      setDialogOpen(true);
    } else {
      handleBack();
    }
  }

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleClick}
        className={cn(
          "gap-2 rounded-full border-border/60 pl-3 pr-4 text-sm",
          "hover:bg-muted/60 hover:border-border",
          "focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:ring-offset-2",
          "transition-colors duration-150",
          className
        )}
      >
        <FontAwesomeIcon icon={faArrowRight} className="h-4 w-4 rotate-180" />
        {showLabel && <span>Back</span>}
      </Button>
      {confirm && (
        <ConfirmDialog
          open={dialogOpen}
          title={confirmTitle}
          description={confirmDescription}
          confirmLabel={confirmLabel}
          confirmVariant="destructive"
          onCancel={() => setDialogOpen(false)}
          onConfirm={() => {
            setDialogOpen(false);
            handleBack();
          }}
        />
      )}
    </>
  );
}