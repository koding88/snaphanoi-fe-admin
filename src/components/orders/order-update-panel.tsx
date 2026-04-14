"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";

import { OrderPaymentBadge } from "@/components/orders/order-payment-badge";
import { OrderStatusBadge } from "@/components/orders/order-status-badge";
import { Button } from "@/components/ui/button";
import { AppSelect } from "@/components/ui/select";
import { updateOrder } from "@/features/orders/api/update-order";
import type {
  OrderDetailRecord,
  OrderPaymentStatus,
  OrderStatus,
} from "@/features/orders/types/orders.types";
import {
  formatOrderPaymentStatus,
  formatOrderStatus,
  getAllowedPaymentStatusesForSelection,
  getAllowedNextStatuses,
} from "@/features/orders/utils/orders-format";
import { getFriendlyOrdersError } from "@/features/orders/utils/orders-errors";
import { notifyError, notifySuccess } from "@/lib/toast";

type OrderUpdatePanelProps = {
  order: OrderDetailRecord;
  onUpdated: (nextOrder: OrderDetailRecord) => void;
};

export function OrderUpdatePanel({ order, onUpdated }: OrderUpdatePanelProps) {
  const [status, setStatus] = useState<OrderStatus>(order.status);
  const [paymentStatus, setPaymentStatus] = useState<OrderPaymentStatus>(
    order.paymentStatus,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setStatus(order.status);
    setPaymentStatus(order.paymentStatus);
  }, [order.paymentStatus, order.status]);

  const statusOptions = useMemo(
    () =>
      getAllowedNextStatuses(order.status).map((value) => ({
        value,
        label: formatOrderStatus(value),
      })),
    [order.status],
  );

  const paymentOptions = useMemo(
    () =>
      getAllowedPaymentStatusesForSelection({
        selectedStatus: status,
        currentPaymentStatus: order.paymentStatus,
      }).map((value) => ({
        value,
        label: formatOrderPaymentStatus(value),
      })),
    [order.paymentStatus, status],
  );

  useEffect(() => {
    const hasSelectedPayment = paymentOptions.some(
      (option) => option.value === paymentStatus,
    );

    if (hasSelectedPayment) {
      return;
    }

    if (paymentOptions.length === 1) {
      setPaymentStatus(paymentOptions[0].value);
      return;
    }

    if (paymentOptions.length > 1) {
      setPaymentStatus(paymentOptions[0].value);
    }
  }, [paymentOptions, paymentStatus]);

  const isUnchanged =
    status === order.status && paymentStatus === order.paymentStatus;
  const hasValidPaymentSelection = paymentOptions.length > 0;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isUnchanged) {
      notifyError("No change detected. Select a new status or payment status.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await updateOrder(order.id, {
        ...(status !== order.status ? { status } : {}),
        ...(paymentStatus !== order.paymentStatus ? { paymentStatus } : {}),
      });
      onUpdated(response.data);
      notifySuccess(response.message, "Order updated successfully.");
    } catch (error) {
      notifyError(getFriendlyOrdersError(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="rounded-[1.6rem] border border-[--color-brand]/25 bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(247,243,236,0.9))] p-5 shadow-[0_24px_70px_-52px_rgba(15,23,42,0.45)]">
      <div className="space-y-2">
        <p className="text-[10px] font-semibold tracking-[0.2em] text-[--color-brand-muted] uppercase">
          Lifecycle actions
        </p>
        <p className="text-sm leading-6 text-muted-foreground">
          Review current state, choose the next valid transition, and save this order update.
        </p>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-[1rem] border border-border/70 bg-white/82 p-3">
          <p className="text-[10px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
            Current
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <OrderStatusBadge status={order.status} />
            <OrderPaymentBadge status={order.paymentStatus} />
          </div>
        </div>
        <div className="rounded-[1rem] border border-border/70 bg-white/82 p-3">
          <p className="text-[10px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
            Selected
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <OrderStatusBadge status={status} />
            <OrderPaymentBadge status={paymentStatus} />
          </div>
        </div>
      </div>

      <form className="mt-4 grid gap-4" onSubmit={handleSubmit}>
        <label className="space-y-2">
          <span className="text-sm font-medium text-foreground">Order status</span>
          <AppSelect
            value={status}
            onChange={(value) => setStatus(value as OrderStatus)}
            options={statusOptions}
            disabled={isSubmitting}
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-foreground">
            Payment status
          </span>
          <AppSelect
            value={
              paymentOptions.some((option) => option.value === paymentStatus)
                ? paymentStatus
                : paymentOptions[0]?.value ?? paymentStatus
            }
            onChange={(value) => setPaymentStatus(value as OrderPaymentStatus)}
            options={paymentOptions}
            disabled={isSubmitting || paymentOptions.length === 0}
          />
          {paymentOptions.length === 0 ? (
            <p className="text-xs text-muted-foreground">
              No payment status is valid for the selected status from the current payment progression.
            </p>
          ) : null}
        </label>
        {!isUnchanged ? (
          <p className="text-xs text-muted-foreground">
            Saving will apply: {formatOrderStatus(status)} and {formatOrderPaymentStatus(paymentStatus)}.
          </p>
        ) : (
          <p className="text-xs text-muted-foreground">
            No pending change yet. Select a new status to enable saving.
          </p>
        )}
        <div>
          <Button
            type="submit"
            size="lg"
            className="h-11 w-full rounded-full px-6"
            disabled={isSubmitting || isUnchanged || !hasValidPaymentSelection}
          >
            {isSubmitting ? "Saving..." : "Save order update"}
          </Button>
        </div>
      </form>
    </section>
  );
}
