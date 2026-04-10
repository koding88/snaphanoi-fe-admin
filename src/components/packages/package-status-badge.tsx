import { StatusBadge } from "@/components/shared/status-badge";

type PackageStatusBadgeProps = {
  isActive: boolean;
  deletedAt: string | null;
};

export function PackageStatusBadge({
  isActive,
  deletedAt,
}: PackageStatusBadgeProps) {
  if (deletedAt) {
    return <StatusBadge tone="danger">Archived</StatusBadge>;
  }

  return isActive ? (
    <StatusBadge tone="success">Active</StatusBadge>
  ) : (
    <StatusBadge tone="warning">Inactive</StatusBadge>
  );
}
