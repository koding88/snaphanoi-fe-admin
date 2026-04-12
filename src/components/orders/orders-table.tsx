"use client";

import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import type { OrderItemRecord, OrderRecord } from "@/features/orders/types/orders.types";
import {
  formatOrderDiscoverySource,
  formatOrderMoney,
  formatOrderPaymentStatus,
  formatOrderStatus,
} from "@/features/orders/utils/orders-format";
import { formatDateOnly } from "@/features/users/utils/users-format";
import { getCountryByCode } from "@/lib/constants/countries";
import { ROUTES } from "@/lib/constants/routes";
import {
  faFacebook,
  faGoogle,
  faInstagram,
  faTiktok,
  faUserGroup,
} from "@/lib/icons/fa";
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
    "grid-cols-[minmax(176px,0.95fr)_minmax(210px,1.2fr)_minmax(112px,0.72fr)_minmax(148px,0.85fr)_minmax(168px,0.9fr)]";

  function navigateToOrder(orderId: string) {
    router.push(ROUTES.admin.orders.detail(orderId));
  }

  function getSourceIcon(source: string) {
    const normalized = source.trim().toLowerCase();

    if (normalized === "facebook") {
      return faFacebook;
    }

    if (normalized === "instagram") {
      return faInstagram;
    }

    if (normalized === "tiktok") {
      return faTiktok;
    }

    if (normalized === "google") {
      return faGoogle;
    }

    if (normalized === "friend") {
      return faUserGroup;
    }

    return null;
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
            "grid min-w-[860px] items-center gap-x-3 border-b border-border/80 bg-white/55 px-4 py-3.5 text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase",
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
                "group grid min-w-[860px] cursor-pointer items-center gap-x-3 border-b border-border/60 px-4 py-3.5 transition-[background-color,box-shadow] hover:bg-white/60 focus-visible:bg-white/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-brand]/30 last:border-b-0",
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
                <p
                  className="mt-1 max-w-[182px] truncate text-[11px] text-muted-foreground"
                  title={order.customerInfo.email}
                >
                  {order.customerInfo.email}
                </p>
                <p
                  className="mt-1 text-[10px] font-semibold tracking-[0.14em] text-muted-foreground/85 uppercase"
                  title={order.customerInfo.countryCode || "N/A"}
                >
                  {(() => {
                    const code = order.customerInfo.countryCode || "N/A";
                    const country = getCountryByCode(order.customerInfo.countryCode);

                    return country ? `${country.flag} ${code}` : code;
                  })()}
                </p>
              </div>
              <div className="min-w-0 text-sm text-muted-foreground">
                <div className="inline-flex items-center gap-1.5">
                  {(() => {
                    const icon = getSourceIcon(order.discoverySource);

                    if (!icon) {
                      return null;
                    }

                    return (
                      <span className="inline-flex h-4 w-4 items-center justify-center text-[11px] text-[--color-brand-muted]">
                        <FontAwesomeIcon icon={icon} />
                      </span>
                    );
                  })()}
                  <span className="truncate text-[12px]">
                    {formatOrderDiscoverySource(order.discoverySource)}
                  </span>
                </div>
              </div>
              <div className="min-w-0 text-sm">
                {(() => {
                  const summary = getOrderItemSummary(order.items[0]);
                  return (
                    <div className="space-y-0.5">
                      <p className="font-medium text-foreground">{summary.type}</p>
                      <p className="truncate text-muted-foreground">{summary.name}</p>
                      {summary.amount ? (
                        <p className="truncate text-muted-foreground">{summary.amount}</p>
                      ) : null}
                    </div>
                  );
                })()}
              </div>
              <div className="min-w-0 text-center">
                <p className="truncate text-xs font-semibold tracking-[0.14em] text-foreground uppercase">
                  {formatOrderStatus(order.status)}{" "}
                  <span className="text-muted-foreground/70">|</span>{" "}
                  {formatOrderPaymentStatus(order.paymentStatus)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
