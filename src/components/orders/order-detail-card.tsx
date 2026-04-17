import { useTranslations } from "next-intl";

import { AdminSurface } from "@/components/admin/admin-surface";
import { OrderPaymentBadge } from "@/components/orders/order-payment-badge";
import { OrderStatusBadge } from "@/components/orders/order-status-badge";
import { OrderUpdatePanel } from "@/components/orders/order-update-panel";
import type {
  OrderDetailRecord,
  OrderItemRecord,
} from "@/features/orders/types/orders.types";
import {
  formatOrderCountry,
  formatOrderDiscoverySource,
  formatOrderMoney,
  translateOrderPaymentStatus,
  translateOrderStatus,
} from "@/features/orders/utils/orders-format";
import {
  formatDateTime,
  formatPhoneNumberDisplay,
} from "@/features/users/utils/users-format";

function getLocalizedText(
  value: string | { en: string; vi: string; cn: string } | undefined,
  fallback: string,
) {
  if (!value) {
    return fallback;
  }

  if (typeof value === "string") {
    return value;
  }

  return value.en;
}

function renderOrderItem(
  item: OrderItemRecord,
  index: number,
  t: ReturnType<typeof useTranslations>,
) {
  const galleryName = getLocalizedText(item.gallerySnapshot.name, t("na"));

  if (item.type === "package") {
    return (
      <div
        key={`${item.type}-${item.createdAt}-${index}`}
        className="rounded-[1.45rem] border border-border/75 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(248,244,237,0.88))] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.72)] md:p-5"
      >
        <p className="text-[10px] font-semibold tracking-[0.2em] text-[--color-brand-muted] uppercase">
          {t("item.packageItem")}
        </p>
        <div className="mt-3 grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(210px,0.65fr)] md:items-start">
          <div className="space-y-3">
            <p className="text-[10px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
              {t("item.package")}
            </p>
            <p className="text-lg font-semibold leading-tight text-foreground">
              {getLocalizedText(item.packageSnapshot?.name, t("na"))}
            </p>
            <p className="text-sm text-muted-foreground">
              {t("item.gallery", { name: galleryName })}
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full border border-border/70 bg-white/78 px-2.5 py-1 text-xs text-muted-foreground">
                {item.packageSnapshot?.duration
                  ? t("item.durationMinutes", {
                      count: Math.round(item.packageSnapshot.duration / 60),
                    })
                  : t("item.durationNa")}
              </span>
              <span className="rounded-full border border-border/70 bg-white/78 px-2.5 py-1 text-xs text-muted-foreground">
                {item.packageSnapshot?.photoCount
                  ? t("item.photoCount", {
                      count: item.packageSnapshot.photoCount,
                    })
                  : t("item.photoCountNa")}
              </span>
            </div>
          </div>
          <div className="rounded-[1rem] border border-border/65 bg-white/78 p-3.5">
            <p className="text-[10px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
              {t("item.pricing")}
            </p>
            <p className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
              {formatOrderMoney(item.pricing)}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {t("item.canonicalPricing")}
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
        {t("item.customItem")}
      </p>
      <div className="mt-3 grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(210px,0.65fr)] md:items-start">
        <div className="space-y-3">
          <p className="text-[10px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
            {t("item.galleryLabel")}
          </p>
          <p className="text-lg font-semibold leading-tight text-foreground">
            {galleryName}
          </p>
          <p className="text-sm text-muted-foreground">
            {t("item.customDescription")}
          </p>
        </div>
        <div className="rounded-[1rem] border border-border/65 bg-white/78 p-3.5">
          <p className="text-[10px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
            {t("item.budget")}
          </p>
          <p className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
            {formatOrderMoney(item.budget)}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {t("item.confirmedBudget")}
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
  const t = useTranslations("orders.detailCard");
  const badgeT = useTranslations("orders.badges");
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
                  {t("identity.eyebrow")}
                </p>
                <h2 className="font-heading text-3xl leading-[0.95] tracking-[0.03em] text-foreground md:text-4xl">
                  {order.orderNumber}
                </h2>
                <div className="space-y-1">
                  <p className="text-base font-medium text-foreground">
                    {order.customerInfo.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {order.customerInfo.email}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formatPhoneNumberDisplay(order.customerInfo.phoneNumber)} -{" "}
                    {formatOrderCountry(order.customerInfo.countryCode)}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <OrderStatusBadge status={order.status} />
                <OrderPaymentBadge status={order.paymentStatus} />
              </div>

              <p className="text-sm leading-6 text-muted-foreground">
                {t("identity.description")}
              </p>
            </div>

            <div className="rounded-[1.3rem] border border-border/70 bg-white/78 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)]">
              <p className="text-[10px] font-semibold tracking-[0.18em] text-[--color-brand-muted] uppercase">
                {t("currentCondition.title")}
              </p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {t("currentCondition.description", {
                  status: translateOrderStatus(order.status, badgeT),
                  payment: translateOrderPaymentStatus(
                    order.paymentStatus,
                    badgeT,
                  ),
                })}
              </p>
              <p className="mt-3 text-xs text-muted-foreground">
                {t("currentCondition.hint")}
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-4 xl:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)] xl:items-start">
          <section className="space-y-3 rounded-[1.5rem] border border-border/75 bg-white/76 p-4 md:p-5">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[10px] font-semibold tracking-[0.2em] text-[--color-brand-muted] uppercase">
                {t("requestedItem.title")}
              </p>
              <p className="text-xs text-muted-foreground">
                {t("requestedItem.subtitle")}
              </p>
            </div>
            {order.items.length > 0 ? (
              order.items.map((item, index) => renderOrderItem(item, index, t))
            ) : (
              <div className="rounded-[1.2rem] border border-border/70 bg-white/76 p-4 text-sm text-muted-foreground">
                {t("requestedItem.empty")}
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
              {t("metadata.title")}
            </p>
            <dl className="space-y-2.5 text-sm">
              <div>
                <dt className="text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                  {t("metadata.discoverySource")}
                </dt>
                <dd className="mt-0.5 text-foreground">
                  {formatOrderDiscoverySource(order.discoverySource)}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                  {t("metadata.created")}
                </dt>
                <dd className="mt-0.5 text-foreground">
                  {formatDateTime(order.createdAt)}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                  {t("metadata.updated")}
                </dt>
                <dd className="mt-0.5 text-foreground">
                  {formatDateTime(order.updatedAt)}
                </dd>
              </div>
            </dl>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[10px] font-semibold tracking-[0.2em] text-[--color-brand-muted] uppercase">
                {t("story.title")}
              </p>
              {hasStory ? (
                <p className="text-xs text-muted-foreground">
                  {isLongStory ? t("story.long") : t("story.short")}
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
                {hasStory ? story : t("story.empty")}
              </p>
            </div>
          </div>
        </section>
      </div>
    </AdminSurface>
  );
}
