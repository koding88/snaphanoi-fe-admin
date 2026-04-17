"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import type { OrderItemRecord, OrderRecord } from "@/features/orders/types/orders.types";
import {
  formatOrderDiscoverySource,
  formatOrderMoney,
  formatOrderPaymentStatus,
  formatOrderStatus,
} from "@/features/orders/utils/orders-format";
import { formatDateOnly, formatPhoneNumberDisplay } from "@/features/users/utils/users-format";
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
      type: "no-item",
      name: "no-item-snapshot",
      amount: "",
    };
  }

  if (item.type === "package") {
    const packageName =
      typeof item.packageSnapshot?.name === "string"
        ? item.packageSnapshot.name
        : item.packageSnapshot?.name.en;

    return {
      type: "package",
      name: packageName ?? "snapshot-missing",
      amount: formatOrderMoney(item.pricing),
    };
  }

  return {
    type: "custom",
    name: "budget",
    amount: formatOrderMoney(item.budget),
  };
}

export function OrdersTable({ orders }: OrdersTableProps) {
  const t = useTranslations("orders.table");
  const router = useRouter();
  const columnLayout =
    "grid-cols-[minmax(0,1fr)_auto] md:grid-cols-[minmax(170px,0.95fr)_minmax(210px,1.2fr)_minmax(168px,0.95fr)_minmax(168px,0.9fr)] xl:grid-cols-[minmax(176px,0.95fr)_minmax(210px,1.2fr)_minmax(112px,0.72fr)_minmax(148px,0.85fr)_minmax(168px,0.9fr)]";

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

  function getStatusToneClass(status: OrderRecord["status"]) {
    if (status === "completed") {
      return "border-emerald-500/25 bg-emerald-500/10 text-emerald-700";
    }

    if (status === "cancelled") {
      return "border-red-500/20 bg-red-500/8 text-red-700";
    }

    if (status === "confirmed") {
      return "border-[--color-brand]/25 bg-[--color-brand-soft] text-[--color-brand]";
    }

    if (status === "contacted") {
      return "border-sky-500/20 bg-sky-500/8 text-sky-700";
    }

    return "border-amber-500/25 bg-amber-500/10 text-amber-700";
  }

  function getPaymentToneClass(paymentStatus: OrderRecord["paymentStatus"]) {
    if (paymentStatus === "paid") {
      return "border-emerald-500/25 bg-emerald-500/10 text-emerald-700";
    }

    if (paymentStatus === "refunded") {
      return "border-rose-500/20 bg-rose-500/8 text-rose-700";
    }

    if (paymentStatus === "partiallyPaid") {
      return "border-sky-500/20 bg-sky-500/8 text-sky-700";
    }

    return "border-amber-500/25 bg-amber-500/10 text-amber-700";
  }

  return (
    <div className="surface-enter overflow-hidden rounded-[2rem] border border-border/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(248,244,237,0.88))] shadow-soft">
      <div className="border-b border-border/70 bg-white/56 px-5 py-3">
        <p className="text-xs font-semibold tracking-[0.22em] text-[--color-brand-muted] uppercase">
          {t("title")}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          {t("description")}
        </p>
      </div>
      <div className="overflow-x-auto border-t border-border/10">
        <div
          className={cn(
            "hidden items-center gap-x-3 border-b border-border/80 bg-white/55 px-4 py-3 text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase md:grid md:min-w-[740px] xl:min-w-[860px]",
            columnLayout,
          )}
        >
          <div>{t("columns.order")}</div>
          <div>{t("columns.customer")}</div>
          <div className="hidden xl:block">{t("columns.source")}</div>
          <div>{t("columns.item")}</div>
          <div className="text-center">{t("columns.lifecycle")}</div>
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
                "group grid cursor-pointer items-center gap-x-3 border-b border-border/60 px-4 py-3 transition-[background-color,box-shadow] hover:bg-white/60 focus-visible:bg-white/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-brand]/30 last:border-b-0 md:min-w-[740px] xl:min-w-[860px]",
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
                <p className="mt-1 truncate text-xs text-muted-foreground md:hidden">
                  {order.customerInfo.name} · {order.customerInfo.phoneNumber ? formatPhoneNumberDisplay(order.customerInfo.phoneNumber) : order.customerInfo.email}
                </p>
                <p className="mt-1 truncate text-[11px] text-muted-foreground md:hidden">
                  {formatOrderDiscoverySource(order.discoverySource)}
                </p>
                <p className="mt-1 truncate text-[11px] text-muted-foreground md:hidden">
                  {(() => {
                    const summary = getOrderItemSummary(order.items[0]);

                    if (summary.type === "package") {
                      return t("item.package");
                    }

                    if (summary.type === "custom") {
                      return t("item.custom");
                    }

                    return t("item.noItem");
                  })()}
                </p>
              </div>
              <div className="hidden min-w-0 md:block">
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
                  title={order.customerInfo.phoneNumber ?? t("na")}
                >
                  {order.customerInfo.phoneNumber ? formatPhoneNumberDisplay(order.customerInfo.phoneNumber) : t("na")}
                </p>
              </div>
              <div className="hidden min-w-0 text-sm text-muted-foreground xl:block">
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
              <div className="hidden min-w-0 text-sm md:block">
                {(() => {
                  const summary = getOrderItemSummary(order.items[0]);
                  return (
                    <div className="space-y-0.5">
                      <p className="font-medium text-foreground">
                        {summary.type === "package"
                          ? t("item.package")
                          : summary.type === "custom"
                            ? t("item.custom")
                            : t("item.noItem")}
                      </p>
                      <p className="truncate text-muted-foreground">
                        {summary.name === "budget"
                          ? t("item.budget")
                          : summary.name === "snapshot-missing"
                            ? t("item.snapshotMissing")
                            : summary.name === "no-item-snapshot"
                              ? t("item.noItemSnapshot")
                              : summary.name}
                      </p>
                      {summary.amount ? (
                        <p className="truncate text-muted-foreground">{summary.amount}</p>
                      ) : null}
                    </div>
                  );
                })()}
              </div>
              <div className="min-w-0 text-center">
                <div className="inline-flex max-w-full items-center gap-1.5 truncate">
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold tracking-[0.13em] uppercase",
                      getStatusToneClass(order.status),
                    )}
                  >
                    {formatOrderStatus(order.status)}
                  </span>
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium tracking-[0.1em] uppercase opacity-85",
                      getPaymentToneClass(order.paymentStatus),
                    )}
                  >
                    {formatOrderPaymentStatus(order.paymentStatus)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
