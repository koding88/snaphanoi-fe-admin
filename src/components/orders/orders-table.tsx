"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type KeyboardEvent, type MouseEvent } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { OrderPaymentBadge } from "@/components/orders/order-payment-badge";
import { OrderStatusBadge } from "@/components/orders/order-status-badge";
import { buttonVariants } from "@/components/ui/button";
import type { OrderItemRecord, OrderRecord } from "@/features/orders/types/orders.types";
import {
  formatOrderCountry,
  formatOrderDiscoverySource,
  formatOrderMoney,
} from "@/features/orders/utils/orders-format";
import { formatDateOnly } from "@/features/users/utils/users-format";
import { ROUTES } from "@/lib/constants/routes";
import { faChevronRight } from "@/lib/icons/fa";
import { cn } from "@/lib/utils";

type OrdersTableProps = {
  orders: OrderRecord[];
};

function getOrderItemSummary(item: OrderItemRecord | undefined) {
  if (!item) {
    return "No item";
  }

  if (item.type === "package") {
    const packageName =
      typeof item.packageSnapshot?.name === "string"
        ? item.packageSnapshot.name
        : item.packageSnapshot?.name.en;

    return `Package · ${packageName ?? "Snapshot missing"} · ${formatOrderMoney(item.pricing)}`;
  }

  return `Custom · Budget ${formatOrderMoney(item.budget)}`;
}

export function OrdersTable({ orders }: OrdersTableProps) {
  const router = useRouter();
  const columnLayout =
    "grid-cols-[minmax(160px,0.95fr)_minmax(220px,1.25fr)_130px_minmax(220px,1.1fr)_120px_130px_130px_96px]";

  function navigateToOrder(orderId: string) {
    router.push(ROUTES.admin.orders.detail(orderId));
  }

  const stopRowAction = (event: MouseEvent | KeyboardEvent) => {
    event.stopPropagation();
  };

  return (
    <div className="surface-enter overflow-hidden rounded-[2rem] border border-border/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(248,244,237,0.88))] shadow-soft">
      <div className="border-b border-border/70 bg-white/56 px-5 py-4">
        <p className="text-xs font-semibold tracking-[0.22em] text-[--color-brand-muted] uppercase">
          Order records
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Track incoming requests, status changes, and payment progress from one table.
        </p>
      </div>
      <div className="overflow-x-auto border-t border-border/10">
        <div
          className={cn(
            "grid min-w-[1180px] items-center gap-x-2.5 border-b border-border/80 bg-white/55 px-5 py-4 text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase",
            columnLayout,
          )}
        >
          <div>Order</div>
          <div>Customer</div>
          <div>Source</div>
          <div>Item</div>
          <div className="text-center">Status</div>
          <div className="text-center">Payment</div>
          <div className="text-center">Created</div>
          <div className="sticky right-0 z-20 bg-inherit text-center">Open</div>
        </div>
        <div>
          {orders.map((order) => (
            <div
              key={order.id}
              role="link"
              tabIndex={0}
              onClick={() => navigateToOrder(order.id)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  navigateToOrder(order.id);
                }
              }}
              className={cn(
                "group grid min-w-[1180px] cursor-pointer items-center gap-x-2.5 border-b border-border/60 px-5 py-4 transition-[background-color,box-shadow] hover:bg-white/60 focus-visible:bg-white/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-brand]/30 last:border-b-0",
                columnLayout,
              )}
            >
              <div className="min-w-0">
                <p className="truncate font-semibold tracking-wide text-foreground">
                  {order.orderNumber}
                </p>
                <p className="mt-1 truncate text-xs text-muted-foreground">
                  {order.id}
                </p>
              </div>
              <div className="min-w-0">
                <p className="truncate font-medium text-foreground">
                  {order.customerInfo.name}
                </p>
                <p className="mt-1 truncate text-xs text-muted-foreground">
                  {order.customerInfo.email}
                </p>
                <p className="mt-1 truncate text-xs text-muted-foreground">
                  {formatOrderCountry(order.customerInfo.countryCode)}
                </p>
              </div>
              <div className="min-w-0 text-sm text-muted-foreground">
                {formatOrderDiscoverySource(order.discoverySource)}
              </div>
              <div className="min-w-0 text-sm text-muted-foreground">
                <p className="truncate">{getOrderItemSummary(order.items[0])}</p>
              </div>
              <div className="flex justify-center">
                <OrderStatusBadge status={order.status} />
              </div>
              <div className="flex justify-center">
                <OrderPaymentBadge status={order.paymentStatus} />
              </div>
              <div className="text-center text-[13px] text-muted-foreground">
                <p>{formatDateOnly(order.createdAt)}</p>
              </div>
              <div
                className="sticky right-0 z-10 bg-inherit py-2 text-center"
                onClick={stopRowAction}
                onKeyDown={stopRowAction}
              >
                <Link
                  href={ROUTES.admin.orders.detail(order.id)}
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" }),
                    "h-8 w-[84px] px-2.5 text-xs",
                  )}
                >
                  <FontAwesomeIcon icon={faChevronRight} />
                  View
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
