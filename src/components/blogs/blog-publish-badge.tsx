import { StatusBadge } from "@/components/shared/status-badge";

export function BlogPublishBadge({ isPublished }: { isPublished: boolean }) {
  return isPublished ? <StatusBadge tone="default">Published</StatusBadge> : <StatusBadge tone="neutral">Draft</StatusBadge>;
}
