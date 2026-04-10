import { StatusBadge } from "@/components/shared/status-badge";

type BlogStatusBadgeProps = {
  isActive: boolean;
  deletedAt: string | null;
};

export function BlogStatusBadge({ isActive, deletedAt }: BlogStatusBadgeProps) {
  if (deletedAt) {
    return <StatusBadge tone="danger">Archived</StatusBadge>;
  }

  return isActive ? <StatusBadge tone="success">Active</StatusBadge> : <StatusBadge tone="warning">Inactive</StatusBadge>;
}
