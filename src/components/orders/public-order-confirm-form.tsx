"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";

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
      setFieldError("Confirmation token is required.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await confirmOrderPublic({ token: token.trim() });
      setConfirmedOrder(response.data);
      notifySuccess(
        response.message,
        "Order confirmed successfully.",
        "If this token was already used recently, the same order is returned instead of creating a duplicate.",
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
      eyebrow="Confirm order"
      title="Confirm your order request."
      description="Use the token from the email. The first successful confirmation creates the order. Repeating the same token returns the same success state."
      footer={
        <div className="text-sm text-white/65">
          <Link href={ROUTES.publicOrders.request} className="transition-opacity hover:opacity-100">
            Back to order request
          </Link>
        </div>
      }
    >
      <form className="space-y-5" noValidate onSubmit={handleSubmit}>
        {confirmedOrder ? (
          <AuthFeedback variant="success">
            Order {confirmedOrder.orderNumber} is confirmed. We will follow up through{" "}
            {confirmedOrder.customerInfo.email}.
          </AuthFeedback>
        ) : null}
        {prefilledFromLink && !showManualToken ? (
          <AuthFeedback variant="info">
            Confirmation link detected. Continue below, or enter a different token.
          </AuthFeedback>
        ) : (
          <AuthField label="Confirmation token" htmlFor="order-confirm-token" error={fieldError}>
            <Input
              id="order-confirm-token"
              value={token}
              onChange={(event) => {
                setToken(event.target.value);
                setFieldError(null);
              }}
              placeholder="Paste your token"
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
            {showManualToken ? "Use token from the email link" : "Use a different token instead"}
          </button>
        ) : null}
        {prefilledFromLink && showManualToken ? (
          <AuthField
            label="Different confirmation token"
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
              placeholder="Paste your token"
              aria-invalid={Boolean(fieldError)}
            />
          </AuthField>
        ) : null}
        {confirmedOrder ? (
          <div className="rounded-2xl border border-white/12 bg-white/6 p-4 text-sm text-white/80">
            <p className="text-xs tracking-[0.2em] text-white/55 uppercase">
              Order summary
            </p>
            <p className="mt-2 font-medium text-white">
              {confirmedOrder.customerInfo.name}
            </p>
            <p className="mt-1">Order number: {confirmedOrder.orderNumber}</p>
            <p className="mt-1">
              Item: {firstItem?.type === "package" ? "Package request" : "Custom request"}
            </p>
            <p className="mt-1">Amount: {amountLabel}</p>
          </div>
        ) : null}
        <Button type="submit" size="lg" className="h-12 w-full rounded-full" disabled={isSubmitting}>
          {isSubmitting ? "Confirming..." : "Confirm order"}
        </Button>
      </form>
    </AuthFormShell>
  );
}
