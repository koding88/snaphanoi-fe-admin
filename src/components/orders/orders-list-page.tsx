"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { AdminPageContainer } from "@/components/admin/admin-page-container";
import { AdminSurface } from "@/components/admin/admin-surface";
import { OrdersTable } from "@/components/orders/orders-table";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { LoadingState } from "@/components/shared/loading-state";
import { PageHeader } from "@/components/shared/page-header";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AppSelect } from "@/components/ui/select";
import { listOrders } from "@/features/orders/api/list-orders";
import type {
  OrderListQuery,
  OrderPaymentStatus,
  OrderStatus,
  OrdersListResult,
} from "@/features/orders/types/orders.types";
import { getFriendlyOrdersError } from "@/features/orders/utils/orders-errors";
import { useDebouncedValue } from "@/lib/hooks/use-debounced-value";
import { faRotateLeft } from "@/lib/icons/fa";
import { notifyError } from "@/lib/toast";
import { cn } from "@/lib/utils";

const INITIAL_QUERY: OrderListQuery = {
  page: 1,
  limit: 10,
  keyword: "",
  status: "",
  paymentStatus: "",
  discoverySource: "",
};

const ALL_SELECT_VALUE = "__all__";

export function OrdersListPage() {
  const t = useTranslations("orders.list");
  const [query, setQuery] = useState<OrderListQuery>(INITIAL_QUERY);
  const [keywordInput, setKeywordInput] = useState(INITIAL_QUERY.keyword);
  const [result, setResult] = useState<OrdersListResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const hasLoadedOnceRef = useRef(false);
  const debouncedKeyword = useDebouncedValue(keywordInput, 300);

  const statusOptions: Array<{ value: OrderStatus | ""; label: string }> = [
    { value: "", label: t("filters.statusAll") },
    { value: "pending", label: t("filters.statusPending") },
    { value: "contacted", label: t("filters.statusContacted") },
    { value: "confirmed", label: t("filters.statusConfirmed") },
    { value: "completed", label: t("filters.statusCompleted") },
    { value: "cancelled", label: t("filters.statusCancelled") },
  ];

  const paymentStatusOptions: Array<{ value: OrderPaymentStatus | ""; label: string }> = [
    { value: "", label: t("filters.paymentAll") },
    { value: "unpaid", label: t("filters.paymentUnpaid") },
    { value: "partiallyPaid", label: t("filters.paymentPartiallyPaid") },
    { value: "paid", label: t("filters.paymentPaid") },
    { value: "refunded", label: t("filters.paymentRefunded") },
  ];

  const discoverySourceOptions: Array<{ value: string; label: string }> = [
    { value: "", label: t("filters.discoveryAll") },
    { value: "instagram", label: t("filters.discoveryInstagram") },
    { value: "facebook", label: t("filters.discoveryFacebook") },
    { value: "tiktok", label: t("filters.discoveryTiktok") },
    { value: "google", label: t("filters.discoveryGoogle") },
    { value: "friend", label: t("filters.discoveryFriend") },
    { value: "other", label: t("filters.discoveryOther") },
  ];

  const loadData = useCallback(async (nextQuery: OrderListQuery) => {
    const isInitialLoad = !hasLoadedOnceRef.current;

    if (isInitialLoad) {
      setIsLoading(true);
      setError(null);
    } else {
      setIsRefreshing(true);
    }

    try {
      const nextResult = await listOrders(nextQuery);
      setResult(nextResult);
      setError(null);
      hasLoadedOnceRef.current = true;
    } catch (loadError) {
      const friendlyError = getFriendlyOrdersError(loadError);

      if (!hasLoadedOnceRef.current) {
        setError(friendlyError);
      } else {
        notifyError(friendlyError);
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void loadData(query);
  }, [loadData, query]);

  useEffect(() => {
    setQuery((current) => {
      if (current.keyword === debouncedKeyword) {
        return current;
      }

      return {
        ...current,
        page: 1,
        keyword: debouncedKeyword,
      };
    });
  }, [debouncedKeyword]);

  return (
    <AdminPageContainer tone="hero" className="space-y-6 pb-8">
      <PageHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("description")}
      />

      <AdminSurface className="p-5 md:p-6">
        <div className="mb-3 flex flex-wrap gap-2">
          <span className="rounded-full border border-border/80 bg-white/70 px-3 py-1 text-[10px] font-semibold tracking-[0.18em] text-[--color-brand-muted] uppercase">
            {t("filters.quick")}
          </span>
        </div>
        <div className="grid gap-3 lg:grid-cols-2 xl:grid-cols-5">
          <label className="space-y-1.5 xl:col-span-2">
            <span className="text-sm font-medium text-foreground">
              {t("filters.searchLabel")}
            </span>
            <Input
              value={keywordInput}
              onChange={(event) => setKeywordInput(event.target.value)}
              placeholder={t("filters.searchPlaceholder")}
            />
          </label>
          <label className="space-y-1.5">
            <span className="text-sm font-medium text-foreground">{t("filters.status")}</span>
            <AppSelect
              value={query.status || ALL_SELECT_VALUE}
              onChange={(value) =>
                setQuery((current) => ({
                  ...current,
                  page: 1,
                  status:
                    value === ALL_SELECT_VALUE ? "" : (value as OrderStatus),
                }))
              }
              options={statusOptions.map((option) => ({
                value: option.value || ALL_SELECT_VALUE,
                label: option.label,
              }))}
            />
          </label>
          <label className="space-y-1.5">
            <span className="text-sm font-medium text-foreground">
              {t("filters.paymentStatus")}
            </span>
            <AppSelect
              value={query.paymentStatus || ALL_SELECT_VALUE}
              onChange={(value) =>
                setQuery((current) => ({
                  ...current,
                  page: 1,
                  paymentStatus:
                    value === ALL_SELECT_VALUE
                      ? ""
                      : (value as OrderPaymentStatus),
                }))
              }
              options={paymentStatusOptions.map((option) => ({
                value: option.value || ALL_SELECT_VALUE,
                label: option.label,
              }))}
            />
          </label>
          <label className="space-y-1.5">
            <span className="text-sm font-medium text-foreground">
              {t("filters.discoverySource")}
            </span>
            <AppSelect
              value={query.discoverySource || ALL_SELECT_VALUE}
              onChange={(value) =>
                setQuery((current) => ({
                  ...current,
                  page: 1,
                  discoverySource: value === ALL_SELECT_VALUE ? "" : value,
                }))
              }
              options={discoverySourceOptions.map((option) => ({
                value: option.value || ALL_SELECT_VALUE,
                label: option.label,
              }))}
            />
          </label>
        </div>
      </AdminSurface>

      {isLoading && !result ? (
        <LoadingState
          title={t("loading.title")}
          description={t("loading.description")}
        />
      ) : error ? (
        <ErrorState
          title={t("errors.load")}
          description={error}
          action={
            <button
              type="button"
              onClick={() => void loadData(query)}
              className={cn(
                buttonVariants({ variant: "outline" }),
                "rounded-full px-5",
              )}
            >
              <FontAwesomeIcon icon={faRotateLeft} />
              {t("actions.retry")}
            </button>
          }
        />
      ) : result && result.items.length > 0 ? (
        <>
          <OrdersTable orders={result.items} />
          <AdminSurface className="p-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <p className="text-xs text-muted-foreground">
                {t("pagination.summary", { page: result.meta.page, totalPages: result.meta.totalPages, total: result.meta.total })}
                {isRefreshing ? ` ${t("pagination.updating")}` : ""}
              </p>
              <div className="flex gap-2">
                <label className="sr-only" htmlFor="order-page-size">
                  {t("filters.pageSize")}
                </label>
                <AppSelect
                  value={String(query.limit)}
                  onChange={(value) =>
                    setQuery((current) => ({
                      ...current,
                      page: 1,
                      limit: Number(value),
                    }))
                  }
                  options={[
                    { value: "10", label: t("filters.perPage", { value: 10 }) },
                    { value: "20", label: t("filters.perPage", { value: 20 }) },
                    { value: "50", label: t("filters.perPage", { value: 50 }) },
                  ]}
                  className="w-[160px]"
                />
                <button
                  type="button"
                  disabled={query.page <= 1}
                  onClick={() =>
                    setQuery((current) => ({
                      ...current,
                      page: current.page - 1,
                    }))
                  }
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "rounded-full px-4 disabled:pointer-events-none disabled:opacity-50",
                  )}
                >
                  {t("actions.previous")}
                </button>
                <button
                  type="button"
                  disabled={query.page >= result.meta.totalPages}
                  onClick={() =>
                    setQuery((current) => ({
                      ...current,
                      page: current.page + 1,
                    }))
                  }
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "rounded-full px-4 disabled:pointer-events-none disabled:opacity-50",
                  )}
                >
                  {t("actions.next")}
                </button>
              </div>
            </div>
          </AdminSurface>
        </>
      ) : (
        <EmptyState
          eyebrow={t("eyebrow")}
          title={t("empty.title")}
          description={t("empty.description")}
          action={
            <button
              type="button"
              onClick={() => {
                setKeywordInput("");
                setQuery(INITIAL_QUERY);
              }}
              className={cn(buttonVariants({ variant: "outline" }), "rounded-full px-5")}
            >
              {t("actions.resetFilters")}
            </button>
          }
        />
      )}
    </AdminPageContainer>
  );
}
