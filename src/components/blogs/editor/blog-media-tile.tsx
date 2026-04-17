import type { BlogEditorMediaItem } from "@/components/blogs/editor/blog-editor.types";

type BlogMediaTileProps = {
  item: Pick<BlogEditorMediaItem, "kind" | "url">;
  className?: string;
  mediaClassName?: string;
  youtubeTitle?: string;
  mediaAlt?: string;
};

export function BlogMediaTile({
  item,
  className = "h-full w-full overflow-hidden rounded-none border-0 bg-transparent shadow-none",
  mediaClassName = "h-full w-full min-h-0 object-cover",
  youtubeTitle = "Blog media",
  mediaAlt = "Blog media",
}: BlogMediaTileProps) {
  return (
    <div className={className}>
      {item.kind === "youtube" ? (
        <iframe
          src={item.url}
          title={youtubeTitle}
          className="h-full w-full border-0"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        // Editor media can point to arbitrary storage URLs that are not known to Next image optimization.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.url}
          alt={mediaAlt}
          className={mediaClassName}
          decoding="async"
          draggable={false}
        />
      )}
    </div>
  );
}
