import { useTranslations } from "next-intl";

import type { BlogEditorMediaItem } from "@/components/blogs/editor/blog-editor.types";

type BlogMediaTileProps = {
  item: Pick<BlogEditorMediaItem, "kind" | "url">;
  className?: string;
  mediaClassName?: string;
};

export function BlogMediaTile({
  item,
  className = "h-full w-full overflow-hidden rounded-none border-0 bg-transparent shadow-none",
  mediaClassName = "h-full w-full min-h-0 object-cover",
}: BlogMediaTileProps) {
  const t = useTranslations("blogs.editor");

  return (
    <div className={className}>
      {item.kind === "youtube" ? (
        <iframe
          src={item.url}
          title={t("mediaTitle")}
          className="h-full w-full border-0"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        // Editor media can point to arbitrary storage URLs that are not known to Next image optimization.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.url}
          alt={t("mediaAlt")}
          className={mediaClassName}
          decoding="async"
          draggable={false}
        />
      )}
    </div>
  );
}
