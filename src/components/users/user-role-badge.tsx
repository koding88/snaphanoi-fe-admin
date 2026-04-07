import { StatusBadge } from "@/components/shared/status-badge";

export function UserRoleBadge({ roleName }: { roleName: string | null }) {
  return <StatusBadge tone="default">{roleName ?? "No role"}</StatusBadge>;
}
