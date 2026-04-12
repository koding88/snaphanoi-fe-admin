"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";

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
    <section className="rounded-[1.6rem] border border-border/75 bg-white/78 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.76)]">
      <div className="space-y-1">
        <p className="text-[11px] font-semibold tracking-[0.22em] text-[--color-brand-muted] uppercase">
          Update lifecycle
        </p>
        <p className="text-sm text-muted-foreground">
          Current state: {formatOrderStatus(order.status)} · {formatOrderPaymentStatus(order.paymentStatus)}. Choose the next valid step below.
        </p>
      </div>
      <form className="mt-4 grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
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
        <div className="md:col-span-2">
          <Button
            type="submit"
            size="lg"
            className="h-11 rounded-full px-6"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save order update"}
          </Button>
        </div>
      </form>
    </section>
  );
}
