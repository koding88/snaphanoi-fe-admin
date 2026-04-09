import { AdminSurface } from "@/components/admin/admin-surface";
import { GalleryStatusBadge } from "@/components/galleries/gallery-status-badge";
import type { GalleryRecord } from "@/features/galleries/types/galleries.types";
import { formatDateTime } from "@/features/users/utils/users-format";

export function GalleryDetailCard({ gallery }: { gallery: GalleryRecord }) {
  const detailRows = [
    { label: "English name", value: gallery.name.en },
    { label: "Vietnamese name", value: gallery.name.vi },
    { label: "Chinese name", value: gallery.name.cn },
    { label: "Created by", value: gallery.createdBy.name },
    { label: "Created at", value: formatDateTime(gallery.createdAt) },
    { label: "Updated at", value: formatDateTime(gallery.updatedAt) },
    { label: "Deleted at", value: formatDateTime(gallery.deletedAt) },
  ];

  return (
    <AdminSurface className="p-6 md:p-8">
      <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <GalleryStatusBadge isActive={gallery.isActive} deletedAt={gallery.deletedAt} />
          </div>
          <div>
            <h2 className="font-heading text-4xl tracking-[0.04em] text-foreground">{gallery.name.en}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{gallery.id}</p>
          </div>
        </div>
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {detailRows.map((row) => (
          <div
            key={row.label}
            className="rounded-[1.5rem] border border-border/80 bg-white/72 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.76)]"
          >
            <p className="text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">
              {row.label}
            </p>
            <p className="mt-2 text-sm leading-7 text-foreground">{row.value}</p>
          </div>
        ))}
      </div>
    </AdminSurface>
  );
}
