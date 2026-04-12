import type { PublicOrderPackageOption } from "@/features/orders/types/orders.types";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

type PublicPackagesResult = {
  items: PublicOrderPackageOption[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export async function listPublicOrderPackages() {
  const searchParams = new URLSearchParams({
    page: "1",
    limit: "100",
  });

  const result = await apiClient.get<PublicPackagesResult>(
    `${API_ENDPOINTS.packages.publicList}?${searchParams.toString()}`,
  );

  return result.items;
}
