import { StatusBadge } from "@/components/shared/status-badge";

export function GalleryStatusBadge({ isActive, deletedAt }: { isActive: boolean; deletedAt: string | null }) {
  if (deletedAt) {
    return <StatusBadge tone="danger">Archived</StatusBadge>;
  }

  return isActive ? <StatusBadge tone="success">Active</StatusBadge> : <StatusBadge tone="warning">Inactive</StatusBadge>;
}
