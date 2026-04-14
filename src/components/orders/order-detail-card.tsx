import { AdminSurface } from "@/components/admin/admin-surface";
import { OrderPaymentBadge } from "@/components/orders/order-payment-badge";
import { OrderStatusBadge } from "@/components/orders/order-status-badge";
import { OrderUpdatePanel } from "@/components/orders/order-update-panel";
import type { OrderDetailRecord, OrderItemRecord } from "@/features/orders/types/orders.types";
import {
  formatOrderCountry,
  formatOrderDiscoverySource,
  formatOrderMoney,
  formatOrderPaymentStatus,
  formatOrderStatus,
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
        className="rounded-[1.45rem] border border-border/75 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(248,244,237,0.88))] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.72)] md:p-5"
      >
        <p className="text-[10px] font-semibold tracking-[0.2em] text-[--color-brand-muted] uppercase">
          Package item
        </p>
        <div className="mt-3 grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(210px,0.65fr)] md:items-start">
          <div className="space-y-3">
            <p className="text-[10px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
              Package
            </p>
            <p className="text-lg font-semibold leading-tight text-foreground">
              {getLocalizedText(item.packageSnapshot?.name)}
            </p>
            <p className="text-sm text-muted-foreground">Gallery: {galleryName}</p>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full border border-border/70 bg-white/78 px-2.5 py-1 text-xs text-muted-foreground">
                {item.packageSnapshot?.duration
                  ? `${Math.round(item.packageSnapshot.duration / 60)} min`
                  : "Duration N/A"}
              </span>
              <span className="rounded-full border border-border/70 bg-white/78 px-2.5 py-1 text-xs text-muted-foreground">
                {item.packageSnapshot?.photoCount
                  ? `${item.packageSnapshot.photoCount} photos`
                  : "Photo count N/A"}
              </span>
            </div>
          </div>
          <div className="rounded-[1rem] border border-border/65 bg-white/78 p-3.5">
            <p className="text-[10px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
              Pricing
            </p>
            <p className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
              {formatOrderMoney(item.pricing)}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
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
      className="rounded-[1.45rem] border border-border/75 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(248,244,237,0.88))] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.72)] md:p-5"
    >
      <p className="text-[10px] font-semibold tracking-[0.2em] text-[--color-brand-muted] uppercase">
        Custom item
      </p>
      <div className="mt-3 grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(210px,0.65fr)] md:items-start">
        <div className="space-y-3">
          <p className="text-[10px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
            Gallery
          </p>
          <p className="text-lg font-semibold leading-tight text-foreground">{galleryName}</p>
          <p className="text-sm text-muted-foreground">
            Custom request scoped to this gallery.
          </p>
        </div>
        <div className="rounded-[1rem] border border-border/65 bg-white/78 p-3.5">
          <p className="text-[10px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
            Budget
          </p>
          <p className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
            {formatOrderMoney(item.budget)}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
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
  const story = order.personalStory.trim();
  const hasStory = story.length > 0;
  const isLongStory = story.length > 520;

  return (
    <AdminSurface className="p-5 md:p-7">
      <div className="space-y-5">
        <section className="rounded-[1.7rem] border border-border/75 bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(247,243,236,0.9))] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.76)] md:p-6">
          <div className="grid gap-5 xl:grid-cols-[minmax(0,1.25fr)_minmax(290px,0.75fr)] xl:items-start">
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-[10px] font-semibold tracking-[0.22em] text-[--color-brand-muted] uppercase">
                  Order identity
                </p>
                <h2 className="font-heading text-3xl leading-[0.95] tracking-[0.03em] text-foreground md:text-4xl">
                  {order.orderNumber}
                </h2>
                <div className="space-y-1">
                  <p className="text-base font-medium text-foreground">
                    {order.customerInfo.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {order.customerInfo.email} - {formatOrderCountry(order.customerInfo.countryCode)}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <OrderStatusBadge status={order.status} />
                <OrderPaymentBadge status={order.paymentStatus} />
              </div>

              <p className="text-sm leading-6 text-muted-foreground">
                Keep lifecycle and payment progression aligned before confirming final delivery.
              </p>
            </div>

            <div className="rounded-[1.3rem] border border-border/70 bg-white/78 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)]">
              <p className="text-[10px] font-semibold tracking-[0.18em] text-[--color-brand-muted] uppercase">
                Current condition
              </p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Order is currently <span className="font-medium text-foreground">{formatOrderStatus(order.status)}</span> with payment marked as <span className="font-medium text-foreground">{formatOrderPaymentStatus(order.paymentStatus)}</span>.
              </p>
              <p className="mt-3 text-xs text-muted-foreground">
                Use the lifecycle action panel below to apply the next valid transition.
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-4 xl:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)] xl:items-start">
          <section className="space-y-3 rounded-[1.5rem] border border-border/75 bg-white/76 p-4 md:p-5">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[10px] font-semibold tracking-[0.2em] text-[--color-brand-muted] uppercase">
                Requested item
              </p>
              <p className="text-xs text-muted-foreground">
                Booking and pricing snapshot
              </p>
            </div>
            {order.items.length > 0 ? (
              order.items.map((item, index) => renderOrderItem(item, index))
            ) : (
              <div className="rounded-[1.2rem] border border-border/70 bg-white/76 p-4 text-sm text-muted-foreground">
                No item snapshot is available for this order.
              </div>
            )}
          </section>

          <div className="xl:sticky xl:top-6">
            <OrderUpdatePanel order={order} onUpdated={onUpdated} />
          </div>
        </section>

        <section className="grid gap-4 rounded-[1.4rem] border border-border/70 bg-white/70 p-4 md:grid-cols-[minmax(220px,0.75fr)_minmax(0,1.25fr)] md:p-5">
          <div className="space-y-3">
            <p className="text-[10px] font-semibold tracking-[0.2em] text-[--color-brand-muted] uppercase">
              Admin metadata
            </p>
            <dl className="space-y-2.5 text-sm">
              <div>
                <dt className="text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                  Discovery source
                </dt>
                <dd className="mt-0.5 text-foreground">
                  {formatOrderDiscoverySource(order.discoverySource)}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                  Created
                </dt>
                <dd className="mt-0.5 text-foreground">{formatDateTime(order.createdAt)}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                  Updated
                </dt>
                <dd className="mt-0.5 text-foreground">{formatDateTime(order.updatedAt)}</dd>
              </div>
            </dl>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[10px] font-semibold tracking-[0.2em] text-[--color-brand-muted] uppercase">
                Personal story
              </p>
              {hasStory ? (
                <p className="text-xs text-muted-foreground">
                  {isLongStory ? "Long note" : "Short note"}
                </p>
              ) : null}
            </div>
            <div
              className={
                isLongStory
                  ? "max-h-72 overflow-y-auto rounded-[1.1rem] border border-border/65 bg-white/86 p-3.5"
                  : "rounded-[1.1rem] border border-border/65 bg-white/86 p-3.5"
              }
            >
              <p className="whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
                {hasStory ? story : "No story provided."}
              </p>
            </div>
          </div>
        </section>
      </div>
    </AdminSurface>
  );
}
