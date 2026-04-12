"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { AdminPageContainer } from "@/components/admin/admin-page-container";
import { OrderDetailCard } from "@/components/orders/order-detail-card";
import { BackButton } from "@/components/shared/back-button";
import { ErrorState } from "@/components/shared/error-state";
import { LoadingState } from "@/components/shared/loading-state";
import { PageHeader } from "@/components/shared/page-header";
import { buttonVariants } from "@/components/ui/button";
import { getOrder } from "@/features/orders/api/get-order";
import type { OrderDetailRecord } from "@/features/orders/types/orders.types";
import { getFriendlyOrdersError } from "@/features/orders/utils/orders-errors";
import { ROUTES } from "@/lib/constants/routes";
import { faArrowRotateRight } from "@/lib/icons/fa";
import { consumeNavigationToast } from "@/lib/toast";
import { cn } from "@/lib/utils";

export function OrderDetailPage({ id }: { id: string }) {
  const router = useRouter();
  const [order, setOrder] = useState<OrderDetailRecord | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    consumeNavigationToast();
  }, []);

  useEffect(() => {
    async function bootstrap() {
      setIsLoading(true);

      try {
        const result = await getOrder(id);
        setOrder(result);
      } catch (loadError) {
        setError(getFriendlyOrdersError(loadError));
      } finally {
        setIsLoading(false);
      }
    }

    void bootstrap();
  }, [id]);

  return (
    <AdminPageContainer tone="hero" className="space-y-8 pb-10">
      <PageHeader
        eyebrow="Order detail"
        title="Review this order request."
        description="See customer context, item snapshot, and update status or payment progression in one place."
        meta={<BackButton href={ROUTES.admin.orders.root} />}
        actions={
          order ? (
            <Link
              href={ROUTES.admin.orders.detail(order.id)}
              onClick={(event) => {
                event.preventDefault();
                router.refresh();
              }}
              className={cn(
                buttonVariants({ variant: "outline" }),
                "rounded-full px-5",
              )}
            >
              <FontAwesomeIcon icon={faArrowRotateRight} />
              Refresh
            </Link>
          ) : null
        }
      />
      {isLoading ? (
        <LoadingState
          title="Loading order"
          description="Pulling the latest order detail and status."
        />
      ) : error || !order ? (
        <ErrorState
          title="Unable to load this order"
          description={error ?? "Order not found."}
        />
      ) : (
        <OrderDetailCard order={order} onUpdated={setOrder} />
      )}
    </AdminPageContainer>
  );
}
