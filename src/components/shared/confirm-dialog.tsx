"use client";

import type { ReactNode } from "react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmVariant?: "default" | "destructive";
  isSubmitting?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  extra?: ReactNode;
};

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel,
  confirmVariant = "destructive",
  isSubmitting = false,
  onCancel,
  onConfirm,
  extra,
}: ConfirmDialogProps) {
  const t = useTranslations();

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/48 px-4 backdrop-blur-sm">
      <div className="dialog-enter w-full max-w-lg rounded-[2rem] border border-border/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,244,237,0.94))] p-6 shadow-[0_30px_100px_rgba(15,23,42,0.22)] sm:p-7">
        <div className="space-y-3">
            <p className="text-xs font-semibold tracking-[0.26em] text-[--color-brand-muted] uppercase">
            {t("shared.confirmDialog.eyebrow")}
          </p>
          <h2 className="font-heading text-3xl tracking-[0.04em] text-foreground">{title}</h2>
          <p className="text-sm leading-7 text-muted-foreground">{description}</p>
          {extra ? <div className="rounded-[1.25rem] border border-border/80 bg-white/70 p-3">{extra}</div> : null}
        </div>
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            {cancelLabel ?? t("common.actions.cancel")}
          </Button>
          <Button
            type="button"
            variant={confirmVariant}
            onClick={onConfirm}
            disabled={isSubmitting}
          >
            {isSubmitting ? t("common.actions.working") : (confirmLabel ?? t("common.actions.confirm"))}
          </Button>
        </div>
      </div>
    </div>
  );
}
