"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";

import { AuthFeedback } from "@/components/auth/auth-feedback";
import { AuthField } from "@/components/auth/auth-field";
import { AuthFormShell } from "@/components/auth/auth-form-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { confirmOrderPublic } from "@/features/orders/api/confirm-order-public";
import type { OrderDetailRecord } from "@/features/orders/types/orders.types";
import { formatOrderMoney } from "@/features/orders/utils/orders-format";
import { getFriendlyOrdersError } from "@/features/orders/utils/orders-errors";
import { ROUTES } from "@/lib/constants/routes";
import { notifyError, notifySuccess } from "@/lib/toast";

export function PublicOrderConfirmForm() {
  const t = useTranslations("orders.publicConfirm");
  const searchParams = useSearchParams();
  const [token, setToken] = useState("");
  const [prefilledFromLink, setPrefilledFromLink] = useState(false);
  const [showManualToken, setShowManualToken] = useState(false);
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<OrderDetailRecord | null>(
    null,
  );

  useEffect(() => {
    const tokenFromQuery = searchParams.get("token");
    if (tokenFromQuery) {
      setToken(tokenFromQuery);
      setPrefilledFromLink(true);
    }
  }, [searchParams]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFieldError(null);

    if (!token.trim()) {
      setFieldError(t("errors.tokenRequired"));
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await confirmOrderPublic({ token: token.trim() });
      setConfirmedOrder(response.data);
      notifySuccess(
        response.message,
        t("toasts.confirmedTitle"),
        t("toasts.confirmedDescription"),
      );
    } catch (error) {
      notifyError(getFriendlyOrdersError(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  const firstItem = confirmedOrder?.items[0];
  const amountLabel =
    firstItem?.type === "package"
      ? formatOrderMoney(firstItem.pricing)
      : formatOrderMoney(firstItem?.budget ?? null);

  return (
    <AuthFormShell
      eyebrow={t("eyebrow")}
      title={t("title")}
      description={t("description")}
      footer={
        <div className="text-sm text-white/65">
          <Link href={ROUTES.publicOrders.request} className="transition-opacity hover:opacity-100">
            {t("footer.backToRequest")}
          </Link>
        </div>
      }
    >
      <form className="space-y-5" noValidate onSubmit={handleSubmit}>
        {confirmedOrder ? (
          <AuthFeedback variant="success">
            {t("confirmed", { orderNumber: confirmedOrder.orderNumber, email: confirmedOrder.customerInfo.email })}
          </AuthFeedback>
        ) : null}
        {prefilledFromLink && !showManualToken ? (
          <AuthFeedback variant="info">
            {t("linkDetected")}
          </AuthFeedback>
        ) : (
          <AuthField label={t("fields.token")} htmlFor="order-confirm-token" error={fieldError}>
            <Input
              id="order-confirm-token"
              value={token}
              onChange={(event) => {
                setToken(event.target.value);
                setFieldError(null);
              }}
              placeholder={t("fields.tokenPlaceholder")}
              aria-invalid={Boolean(fieldError)}
            />
          </AuthField>
        )}
        {prefilledFromLink ? (
          <button
            type="button"
            onClick={() => setShowManualToken((current) => !current)}
            className="text-sm text-white/76 transition hover:text-white"
          >
            {showManualToken ? t("actions.useLinkToken") : t("actions.useDifferentToken")}
          </button>
        ) : null}
        {prefilledFromLink && showManualToken ? (
          <AuthField
            label={t("fields.differentToken")}
            htmlFor="order-confirm-token-manual"
            error={fieldError}
          >
            <Input
              id="order-confirm-token-manual"
              value={token}
              onChange={(event) => {
                setToken(event.target.value);
                setFieldError(null);
              }}
              placeholder={t("fields.tokenPlaceholder")}
              aria-invalid={Boolean(fieldError)}
            />
          </AuthField>
        ) : null}
        {confirmedOrder ? (
          <div className="rounded-2xl border border-white/12 bg-white/6 p-4 text-sm text-white/80">
            <p className="text-xs tracking-[0.2em] text-white/55 uppercase">
              {t("summary.title")}
            </p>
            <p className="mt-2 font-medium text-white">
              {confirmedOrder.customerInfo.name}
            </p>
            <p className="mt-1">{t("summary.orderNumber", { orderNumber: confirmedOrder.orderNumber })}</p>
            <p className="mt-1">
              {t("summary.item", { type: firstItem?.type === "package" ? t("summary.package") : t("summary.custom") })}
            </p>
            <p className="mt-1">{t("summary.amount", { amount: amountLabel })}</p>
          </div>
        ) : null}
        <Button type="submit" size="lg" className="h-12 w-full rounded-full" disabled={isSubmitting}>
          {isSubmitting ? t("actions.confirming") : t("actions.confirm")}
        </Button>
      </form>
    </AuthFormShell>
  );
}
