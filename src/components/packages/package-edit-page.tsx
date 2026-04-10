"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { AdminPageContainer } from "@/components/admin/admin-page-container";
import { AdminSurface } from "@/components/admin/admin-surface";
import {
  getPackageFormInitialValues,
  PackageForm,
} from "@/components/packages/package-form";
import { BackButton } from "@/components/shared/back-button";
import { ErrorState } from "@/components/shared/error-state";
import { LoadingState } from "@/components/shared/loading-state";
import { PageHeader } from "@/components/shared/page-header";
import { getPackage } from "@/features/packages/api/get-package";
import { updatePackage } from "@/features/packages/api/update-package";
import type { PackageDetailRecord } from "@/features/packages/types/packages.types";
import { getFriendlyPackagesError } from "@/features/packages/utils/packages-errors";
import { ROUTES } from "@/lib/constants/routes";
import { queueNavigationToast } from "@/lib/toast";

export function PackageEditPage({ id }: { id: string }) {
  const router = useRouter();
  const [pkg, setPkg] = useState<PackageDetailRecord | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function bootstrap() {
      setIsLoading(true);

      try {
        const packageResult = await getPackage(id);
        setPkg(packageResult);
      } catch (loadError) {
        setError(getFriendlyPackagesError(loadError));
      } finally {
        setIsLoading(false);
      }
    }

    void bootstrap();
  }, [id]);

  async function handleSubmit(payload: Parameters<typeof updatePackage>[1]) {
    const response = await updatePackage(id, payload);
    queueNavigationToast({
      intent: "success",
      title: response.message ?? "Package updated successfully.",
    });
    router.replace(ROUTES.admin.packages.detail(response.data.id));
  }

  return (
    <AdminPageContainer tone="hero" className="space-y-8 pb-10">
      <PageHeader
        eyebrow="Edit package"
        title="Update this photography package"
        description="Review the localized package copy, booking numbers, pricing, and cover without changing the backend contract."
        meta={
          <BackButton
            href={ROUTES.admin.packages.detail(id)}
            confirm
            confirmTitle="Discard these changes?"
            confirmDescription="Any modifications will be lost."
            confirmLabel="Discard"
          />
        }
      />
      {isLoading ? (
        <LoadingState
          title="Loading package"
          description="Fetching the current package record and cover asset."
        />
      ) : error || !pkg ? (
        <ErrorState
          title="Unable to load this package"
          description={error ?? "Package not found."}
        />
      ) : (
        <AdminSurface className="overflow-hidden border-white/60 bg-white/84 p-6 shadow-[0_30px_100px_-70px_rgba(15,23,42,0.5)] md:p-8">
          <PackageForm
            mode="edit"
            initialValues={getPackageFormInitialValues(pkg)}
            existingCoverImage={pkg.coverImage}
            submitLabel="Save changes"
            description="Edit keeps the same raw duration, pricing, and localized payload shape while making the form faster to scan and update."
            onSubmit={handleSubmit}
          />
        </AdminSurface>
      )}
    </AdminPageContainer>
  );
}
