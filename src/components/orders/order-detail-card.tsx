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
        className="rounded-[1.4rem] border border-border/70 bg-white/76 p-4"
      >
        <p className="text-[11px] font-semibold tracking-[0.2em] text-[--color-brand-muted] uppercase">
          Package item
        </p>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <div>
            <p className="text-xs font-medium tracking-[0.16em] text-muted-foreground uppercase">
              Gallery
            </p>
            <p className="mt-1 text-sm text-foreground">{galleryName}</p>
          </div>
          <div>
            <p className="text-xs font-medium tracking-[0.16em] text-muted-foreground uppercase">
              Package
            </p>
            <p className="mt-1 text-sm text-foreground">
              {getLocalizedText(item.packageSnapshot?.name)}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium tracking-[0.16em] text-muted-foreground uppercase">
              Pricing
            </p>
            <p className="mt-1 text-sm text-foreground">
              {formatOrderMoney(item.pricing)}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium tracking-[0.16em] text-muted-foreground uppercase">
              Snapshot
            </p>
            <p className="mt-1 text-sm text-foreground">
              {item.packageSnapshot?.duration
                ? `${Math.round(item.packageSnapshot.duration / 60)} min`
                : "N/A"}
              {item.packageSnapshot?.photoCount
                ? ` · ${item.packageSnapshot.photoCount} photos`
                : ""}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      key={`${item.type}-${item.createdAt}-${index}`}
      className="rounded-[1.4rem] border border-border/70 bg-white/76 p-4"
    >
      <p className="text-[11px] font-semibold tracking-[0.2em] text-[--color-brand-muted] uppercase">
        Custom item
      </p>
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <div>
          <p className="text-xs font-medium tracking-[0.16em] text-muted-foreground uppercase">
            Gallery
          </p>
          <p className="mt-1 text-sm text-foreground">{galleryName}</p>
        </div>
        <div>
          <p className="text-xs font-medium tracking-[0.16em] text-muted-foreground uppercase">
            Budget
          </p>
          <p className="mt-1 text-sm text-foreground">{formatOrderMoney(item.budget)}</p>
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
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-[1.5rem] border border-border/70 bg-white/70 p-4">
            <p className="text-[11px] font-semibold tracking-[0.2em] text-[--color-brand-muted] uppercase">
              Customer
            </p>
            <p className="mt-2 text-lg font-medium text-foreground">
              {order.customerInfo.name}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {order.customerInfo.email}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {formatOrderCountry(order.customerInfo.countryCode)}
            </p>
          </div>
          <div className="rounded-[1.5rem] border border-border/70 bg-white/70 p-4">
            <p className="text-[11px] font-semibold tracking-[0.2em] text-[--color-brand-muted] uppercase">
              Discovery source
            </p>
            <p className="mt-2 text-lg font-medium text-foreground">
              {formatOrderDiscoverySource(order.discoverySource)}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">{order.orderNumber}</p>
          </div>
          <div className="rounded-[1.5rem] border border-border/70 bg-white/70 p-4">
            <p className="text-[11px] font-semibold tracking-[0.2em] text-[--color-brand-muted] uppercase">
              Lifecycle
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <OrderStatusBadge status={order.status} />
              <OrderPaymentBadge status={order.paymentStatus} />
            </div>
          </div>
          <div className="rounded-[1.5rem] border border-border/70 bg-white/70 p-4">
            <p className="text-[11px] font-semibold tracking-[0.2em] text-[--color-brand-muted] uppercase">
              Timeline
            </p>
            <p className="mt-2 text-sm text-foreground">
              Created: {formatDateTime(order.createdAt)}
            </p>
            <p className="mt-1 text-sm text-foreground">
              Updated: {formatDateTime(order.updatedAt)}
            </p>
          </div>
        </section>

        <section className="rounded-[1.6rem] border border-border/75 bg-white/78 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.76)]">
          <p className="text-[11px] font-semibold tracking-[0.22em] text-[--color-brand-muted] uppercase">
            Personal story
          </p>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-foreground">
            {order.personalStory || "No story provided."}
          </p>
        </section>

        <section className="space-y-3">
          <p className="text-[11px] font-semibold tracking-[0.22em] text-[--color-brand-muted] uppercase">
            Requested item
          </p>
          {order.items.length > 0 ? (
            order.items.map((item, index) => renderOrderItem(item, index))
          ) : (
            <div className="rounded-[1.4rem] border border-border/70 bg-white/76 p-4 text-sm text-muted-foreground">
              No item snapshot is available for this order.
            </div>
          )}
        </section>

        <OrderUpdatePanel order={order} onUpdated={onUpdated} />
      </div>
    </AdminSurface>
  );
}
