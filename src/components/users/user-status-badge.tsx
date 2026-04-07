import { StatusBadge } from "@/components/shared/status-badge";

type UserStatusBadgeProps = {
  isActive: boolean;
  deletedAt: string | null;
};

export function UserStatusBadge({ isActive, deletedAt }: UserStatusBadgeProps) {
  if (deletedAt) {
    return <StatusBadge tone="danger">Deleted</StatusBadge>;
  }

  if (isActive) {
    return <StatusBadge tone="success">Active</StatusBadge>;
  }

  return <StatusBadge tone="warning">Inactive</StatusBadge>;
}
