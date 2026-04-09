import { StatusBadge } from "@/components/shared/status-badge";

export function ProjectPublishBadge({ isPublished }: { isPublished: boolean }) {
  return isPublished ? <StatusBadge tone="default">Published</StatusBadge> : <StatusBadge tone="neutral">Draft</StatusBadge>;
}
