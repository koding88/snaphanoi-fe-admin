import type { ProjectEditorMediaItem } from "@/components/projects/editor/project-editor.types";

type ProjectMediaTileProps = {
  item: Pick<ProjectEditorMediaItem, "kind" | "url">;
  className?: string;
  mediaClassName?: string;
  youtubeTitle?: string;
  mediaAlt?: string;
};

export function ProjectMediaTile({
  item,
  className = "h-full w-full overflow-hidden rounded-none border-0 bg-transparent shadow-none",
  mediaClassName = "h-full w-full min-h-0 object-cover",
  youtubeTitle = "YouTube video",
  mediaAlt = "Project media",
}: ProjectMediaTileProps) {
  return (
    <div className={className}>
      {item.kind === "youtube" ? (
        <iframe
          src={item.url}
          title={youtubeTitle}
          className={mediaClassName}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
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
