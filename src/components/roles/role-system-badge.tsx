import { StatusBadge } from "@/components/shared/status-badge";

export function RoleSystemBadge({ isSystem }: { isSystem: boolean }) {
  return isSystem ? (
    <StatusBadge tone="warning">System</StatusBadge>
  ) : (
    <StatusBadge tone="neutral">Custom</StatusBadge>
  );
}
