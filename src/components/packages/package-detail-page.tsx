"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { AdminPageContainer } from "@/components/admin/admin-page-container";
import { PackageDetailCard } from "@/components/packages/package-detail-card";
import { BackButton } from "@/components/shared/back-button";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { ErrorState } from "@/components/shared/error-state";
import { LoadingState } from "@/components/shared/loading-state";
import { PageHeader } from "@/components/shared/page-header";
import { buttonVariants } from "@/components/ui/button";
import { deletePackage } from "@/features/packages/api/delete-package";
import { getPackage } from "@/features/packages/api/get-package";
import { restorePackage } from "@/features/packages/api/restore-package";
import type { PackageDetailRecord } from "@/features/packages/types/packages.types";
import { getFriendlyPackagesError } from "@/features/packages/utils/packages-errors";
import { ROUTES } from "@/lib/constants/routes";
import { faRotateLeft, faTrashCan, faUserPen } from "@/lib/icons/fa";
import { consumeNavigationToast, notifyError, notifySuccess } from "@/lib/toast";
import { cn } from "@/lib/utils";

export function PackageDetailPage({ id }: { id: string }) {
  const router = useRouter();
  const [pkg, setPkg] = useState<PackageDetailRecord | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogMode, setDialogMode] = useState<"delete" | "restore" | null>(
    null,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    consumeNavigationToast();
  }, []);

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

  async function handleAction() {
    if (!pkg || !dialogMode) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (dialogMode === "delete") {
        const response = await deletePackage(pkg.id);
        notifySuccess(
          response.message ?? response.data.message,
          "Package archived.",
        );
        router.replace(ROUTES.admin.packages.root);
        return;
      }

      const response = await restorePackage(pkg.id);
      setPkg(response.data);
      notifySuccess(response.message, "Package restored successfully.");
      setDialogMode(null);
    } catch (actionError) {
      notifyError(getFriendlyPackagesError(actionError));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AdminPageContainer tone="hero" className="space-y-8 pb-10">
      <PageHeader
        eyebrow="Package detail"
        title="Review this package offer."
        description="Inspect localized naming, offer fit, raw session numbers, pricing, and cover artwork before making changes."
        meta={<BackButton href={ROUTES.admin.packages.root} />}
        actions={
          pkg ? (
            <div className="flex flex-wrap gap-2">
              <Link
                href={ROUTES.admin.packages.edit(pkg.id)}
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "rounded-full px-5",
                )}
              >
                <FontAwesomeIcon icon={faUserPen} />
                Edit
              </Link>
              {pkg.deletedAt ? (
                <button
                  type="button"
                  onClick={() => setDialogMode("restore")}
                  className={cn(buttonVariants(), "rounded-full px-5")}
                >
                  <FontAwesomeIcon icon={faRotateLeft} />
                  Restore
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setDialogMode("delete")}
                  className={cn(
                    buttonVariants({ variant: "destructive" }),
                    "rounded-full px-5",
                  )}
                >
                  <FontAwesomeIcon icon={faTrashCan} />
                  Delete
                </button>
              )}
            </div>
          ) : null
        }
      />
      {isLoading ? (
        <LoadingState
          title="Loading package"
          description="Fetching the selected package and cover asset."
        />
      ) : error || !pkg ? (
        <ErrorState
          title="Unable to load this package"
          description={error ?? "Package not found."}
        />
      ) : (
        <PackageDetailCard pkg={pkg} />
      )}
      <ConfirmDialog
        open={Boolean(dialogMode && pkg)}
        title={
          dialogMode === "delete"
            ? `Delete ${pkg?.name.en}?`
            : `Restore ${pkg?.name.en}?`
        }
        description={
          dialogMode === "delete"
            ? "This archives the package for now. You can restore it later if needed."
            : "This will bring the archived package back into the active offer library."
        }
        confirmLabel={
          dialogMode === "delete" ? "Delete package" : "Restore package"
        }
        confirmVariant={dialogMode === "delete" ? "destructive" : "default"}
        isSubmitting={isSubmitting}
        onCancel={() => setDialogMode(null)}
        onConfirm={handleAction}
      />
    </AdminPageContainer>
  );
}
