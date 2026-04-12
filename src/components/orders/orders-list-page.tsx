"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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

const STATUS_OPTIONS: Array<{ value: OrderStatus | ""; label: string }> = [
  { value: "", label: "All statuses" },
  { value: "pending", label: "Pending" },
  { value: "contacted", label: "Contacted" },
  { value: "confirmed", label: "Confirmed" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

const PAYMENT_STATUS_OPTIONS: Array<{
  value: OrderPaymentStatus | "";
  label: string;
}> = [
  { value: "", label: "All payment statuses" },
  { value: "unpaid", label: "Unpaid" },
  { value: "partiallyPaid", label: "Partially paid" },
  { value: "paid", label: "Paid" },
  { value: "refunded", label: "Refunded" },
];

const DISCOVERY_SOURCE_OPTIONS: Array<{ value: string; label: string }> = [
  { value: "", label: "All discovery sources" },
  { value: "instagram", label: "Instagram" },
  { value: "facebook", label: "Facebook" },
  { value: "tiktok", label: "TikTok" },
  { value: "google", label: "Google" },
  { value: "friend", label: "Friend" },
  { value: "other", label: "Other" },
];

const ALL_SELECT_VALUE = "__all__";

export function OrdersListPage() {
  const [query, setQuery] = useState<OrderListQuery>(INITIAL_QUERY);
  const [keywordInput, setKeywordInput] = useState(INITIAL_QUERY.keyword);
  const [result, setResult] = useState<OrdersListResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const hasLoadedOnceRef = useRef(false);
  const debouncedKeyword = useDebouncedValue(keywordInput, 300);

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
    <AdminPageContainer tone="hero" className="space-y-8 pb-10">
      <PageHeader
        eyebrow="Orders"
        title="Manage order requests and fulfillment."
        description="Review incoming requests, payment progression, and lifecycle updates from one admin module."
      />

      <AdminSurface className="p-6 md:p-8">
        <div className="mb-5 flex flex-wrap gap-2">
          <span className="rounded-full border border-border/80 bg-white/70 px-3 py-1.5 text-[11px] font-semibold tracking-[0.18em] text-[--color-brand-muted] uppercase">
            Search and lifecycle
          </span>
          <span className="rounded-full border border-border/80 bg-white/70 px-3 py-1.5 text-[11px] font-semibold tracking-[0.18em] text-[--color-brand-muted] uppercase">
            Empty filters map to all
          </span>
        </div>
        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-5">
          <label className="space-y-2 xl:col-span-2">
            <span className="text-sm font-medium text-foreground">
              Search keyword
            </span>
            <Input
              value={keywordInput}
              onChange={(event) => setKeywordInput(event.target.value)}
              placeholder="Order number, customer name, or email"
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-foreground">Status</span>
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
              options={STATUS_OPTIONS.map((option) => ({
                value: option.value || ALL_SELECT_VALUE,
                label: option.label,
              }))}
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-foreground">
              Payment status
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
              options={PAYMENT_STATUS_OPTIONS.map((option) => ({
                value: option.value || ALL_SELECT_VALUE,
                label: option.label,
              }))}
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-foreground">
              Discovery source
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
              options={DISCOVERY_SOURCE_OPTIONS.map((option) => ({
                value: option.value || ALL_SELECT_VALUE,
                label: option.label,
              }))}
            />
          </label>
        </div>
      </AdminSurface>

      {isLoading && !result ? (
        <LoadingState
          title="Loading orders"
          description="Preparing the latest order records and filters."
        />
      ) : error ? (
        <ErrorState
          title="Unable to load orders"
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
              Retry
            </button>
          }
        />
      ) : result && result.items.length > 0 ? (
        <>
          <OrdersTable orders={result.items} />
          <AdminSurface className="p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <p className="text-sm text-muted-foreground">
                Page {result.meta.page} of {result.meta.totalPages}. Total orders:{" "}
                {result.meta.total}
                {isRefreshing ? " Updating…" : ""}
              </p>
              <div className="flex gap-2">
                <label className="sr-only" htmlFor="order-page-size">
                  Page size
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
                    { value: "10", label: "10 per page" },
                    { value: "20", label: "20 per page" },
                    { value: "50", label: "50 per page" },
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
                  Previous
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
                  Next
                </button>
              </div>
            </div>
          </AdminSurface>
        </>
      ) : (
        <EmptyState
          eyebrow="Orders"
          title="No orders matched the current filters."
          description="Try clearing one or more filters to show more requests."
          action={
            <button
              type="button"
              onClick={() => {
                setKeywordInput("");
                setQuery(INITIAL_QUERY);
              }}
              className={cn(buttonVariants({ variant: "outline" }), "rounded-full px-5")}
            >
              Reset filters
            </button>
          }
        />
      )}
    </AdminPageContainer>
  );
}
