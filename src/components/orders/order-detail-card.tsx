import { AdminSurface } from "@/components/admin/admin-surface";
import { OrderPaymentBadge } from "@/components/orders/order-payment-badge";
import { OrderStatusBadge } from "@/components/orders/order-status-badge";
import { OrderUpdatePanel } from "@/components/orders/order-update-panel";
import type { OrderDetailRecord, OrderItemRecord } from "@/features/orders/types/orders.types";
import {
  formatOrderCountry,
  formatOrderDiscoverySource,
  formatOrderMoney,
} from "@/features/orders/utils/orders-format";
import { formatDateTime } from "@/features/users/utils/users-format";

function getLocalizedText(value: string | { en: string; vi: string; cn: string } | undefined) {
  if (!value) {
    return "N/A";
  }

  if (typeof value === "string") {
    return value;
  }

  return value.en;
}

function renderOrderItem(item: OrderItemRecord, index: number) {
  const galleryName = getLocalizedText(item.gallerySnapshot.name);

  if (item.type === "package") {
    return (
      <div
        key={`${item.type}-${item.createdAt}-${index}`}
        className="rounded-[1.6rem] border border-border/75 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(248,244,237,0.88))] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.72)]"
      >
        <p className="text-[11px] font-semibold tracking-[0.22em] text-[--color-brand-muted] uppercase">
          Package item
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(190px,0.6fr)]">
          <div>
            <p className="text-xs font-medium tracking-[0.16em] text-muted-foreground uppercase">
              Package
            </p>
            <p className="mt-1 text-lg font-medium text-foreground">
              {getLocalizedText(item.packageSnapshot?.name)}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Gallery: {galleryName}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {item.packageSnapshot?.duration
                ? `${Math.round(item.packageSnapshot.duration / 60)} min`
                : "N/A"}
              {item.packageSnapshot?.photoCount
                ? ` · ${item.packageSnapshot.photoCount} photos`
                : ""}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium tracking-[0.16em] text-muted-foreground uppercase">
              Pricing
            </p>
            <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
              {formatOrderMoney(item.pricing)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Canonical order pricing
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      key={`${item.type}-${item.createdAt}-${index}`}
      className="rounded-[1.6rem] border border-border/75 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(248,244,237,0.88))] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.72)]"
    >
      <p className="text-[11px] font-semibold tracking-[0.22em] text-[--color-brand-muted] uppercase">
        Custom item
      </p>
      <div className="mt-4 grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(190px,0.6fr)]">
        <div>
          <p className="text-xs font-medium tracking-[0.16em] text-muted-foreground uppercase">
            Gallery
          </p>
          <p className="mt-1 text-lg font-medium text-foreground">{galleryName}</p>
        </div>
        <div>
          <p className="text-xs font-medium tracking-[0.16em] text-muted-foreground uppercase">
            Budget
          </p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
            {formatOrderMoney(item.budget)}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Confirmed custom request budget
          </p>
        </div>
      </div>
    </div>
  );
}

type OrderDetailCardProps = {
  order: OrderDetailRecord;
  onUpdated: (nextOrder: OrderDetailRecord) => void;
};

export function OrderDetailCard({ order, onUpdated }: OrderDetailCardProps) {
  return (
    <AdminSurface className="p-6 md:p-8">
      <div className="space-y-6">
        <section className="rounded-[1.8rem] border border-border/75 bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(247,243,236,0.88))] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.76)] md:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-2">
              <p className="text-[11px] font-semibold tracking-[0.24em] text-[--color-brand-muted] uppercase">
                Order number
              </p>
              <h2 className="font-heading text-3xl leading-[0.95] tracking-[0.03em] text-foreground md:text-4xl">
                {order.orderNumber}
              </h2>
              <p className="text-sm text-muted-foreground">
                {order.customerInfo.name}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <OrderStatusBadge status={order.status} />
              <OrderPaymentBadge status={order.paymentStatus} />
            </div>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-[1.2rem] border border-border/65 bg-white/72 p-3.5">
              <p className="text-[10px] font-semibold tracking-[0.2em] text-[--color-brand-muted] uppercase">
                Customer
              </p>
              <p className="mt-2 text-sm font-medium text-foreground">
                {order.customerInfo.name}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {order.customerInfo.email}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {formatOrderCountry(order.customerInfo.countryCode)}
              </p>
            </div>

            <div className="rounded-[1.2rem] border border-border/65 bg-white/72 p-3.5">
              <p className="text-[10px] font-semibold tracking-[0.2em] text-[--color-brand-muted] uppercase">
                Discovery source
              </p>
              <p className="mt-2 text-sm font-medium text-foreground">
                {formatOrderDiscoverySource(order.discoverySource)}
              </p>
            </div>

            <div className="rounded-[1.2rem] border border-border/65 bg-white/72 p-3.5">
              <p className="text-[10px] font-semibold tracking-[0.2em] text-[--color-brand-muted] uppercase">
                Created
              </p>
              <p className="mt-2 text-sm text-foreground">
                {formatDateTime(order.createdAt)}
              </p>
            </div>

            <div className="rounded-[1.2rem] border border-border/65 bg-white/72 p-3.5">
              <p className="text-[10px] font-semibold tracking-[0.2em] text-[--color-brand-muted] uppercase">
                Updated
              </p>
              <p className="mt-2 text-sm text-foreground">
                {formatDateTime(order.updatedAt)}
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[11px] font-semibold tracking-[0.22em] text-[--color-brand-muted] uppercase">
              Requested item
            </p>
            <p className="text-xs text-muted-foreground">
              Operational summary for this booking request
            </p>
          </div>
          {order.items.length > 0 ? (
            order.items.map((item, index) => renderOrderItem(item, index))
          ) : (
            <div className="rounded-[1.4rem] border border-border/70 bg-white/76 p-4 text-sm text-muted-foreground">
              No item snapshot is available for this order.
            </div>
          )}
        </section>

        <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
          <section className="rounded-[1.4rem] border border-border/65 bg-white/60 p-4">
            <p className="text-[10px] font-semibold tracking-[0.2em] text-[--color-brand-muted] uppercase">
              Personal story
            </p>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
              {order.personalStory || "No story provided."}
            </p>
          </section>
          <OrderUpdatePanel order={order} onUpdated={onUpdated} />
        </section>
      </div>
    </AdminSurface>
  );
}
