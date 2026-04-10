import { StatusBadge } from "@/components/shared/status-badge";

export function BlogPinBadge({ isPinned }: { isPinned: boolean }) {
  return isPinned ? <StatusBadge tone="warning">Pinned</StatusBadge> : <StatusBadge tone="neutral">Standard</StatusBadge>;
}
