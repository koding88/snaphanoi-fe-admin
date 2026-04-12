"use client";

import { useRouter } from "next/navigation";

import { OrderPaymentBadge } from "@/components/orders/order-payment-badge";
import { OrderStatusBadge } from "@/components/orders/order-status-badge";
import type { OrderItemRecord, OrderRecord } from "@/features/orders/types/orders.types";
import {
  formatOrderCountry,
  formatOrderDiscoverySource,
  formatOrderMoney,
} from "@/features/orders/utils/orders-format";
import { formatDateOnly } from "@/features/users/utils/users-format";
import { ROUTES } from "@/lib/constants/routes";
import { cn } from "@/lib/utils";

type OrdersTableProps = {
  orders: OrderRecord[];
};

function getOrderItemSummary(item: OrderItemRecord | undefined) {
  if (!item) {
    return {
      type: "No item",
      name: "No item snapshot",
      amount: "",
    };
  }

  if (item.type === "package") {
    const packageName =
      typeof item.packageSnapshot?.name === "string"
        ? item.packageSnapshot.name
        : item.packageSnapshot?.name.en;

    return {
      type: "Package",
      name: packageName ?? "Snapshot missing",
      amount: formatOrderMoney(item.pricing),
    };
  }

  return {
    type: "Custom",
    name: "Budget",
    amount: formatOrderMoney(item.budget),
  };
}

export function OrdersTable({ orders }: OrdersTableProps) {
  const router = useRouter();
  const columnLayout =
    "grid-cols-[minmax(190px,1fr)_minmax(230px,1.3fr)_140px_minmax(190px,1fr)_170px]";

  function navigateToOrder(orderId: string) {
    router.push(ROUTES.admin.orders.detail(orderId));
  }

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
            "grid min-w-[980px] items-center gap-x-4 border-b border-border/80 bg-white/55 px-5 py-4 text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase",
            columnLayout,
          )}
        >
          <div>Order</div>
          <div>Customer</div>
          <div>Source</div>
          <div>Item</div>
          <div className="text-center">Lifecycle</div>
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
                "group grid min-w-[980px] cursor-pointer items-center gap-x-4 border-b border-border/60 px-5 py-4 transition-[background-color,box-shadow] hover:bg-white/60 focus-visible:bg-white/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-brand]/30 last:border-b-0",
                columnLayout,
              )}
            >
              <div className="min-w-0">
                <p className="truncate font-semibold tracking-wide text-foreground">
                  {order.orderNumber}
                </p>
                <p className="mt-1 truncate text-xs text-muted-foreground">
                  {formatDateOnly(order.createdAt)}
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
              <div className="min-w-0 text-sm">
                {(() => {
                  const summary = getOrderItemSummary(order.items[0]);
                  return (
                    <div className="space-y-0.5">
                      <p className="font-medium text-foreground">{summary.type}</p>
                      <p className="truncate text-muted-foreground">{summary.name}</p>
                      {summary.amount ? (
                        <p className="text-muted-foreground">{summary.amount}</p>
                      ) : null}
                    </div>
                  );
                })()}
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <OrderStatusBadge status={order.status} />
                <OrderPaymentBadge status={order.paymentStatus} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
