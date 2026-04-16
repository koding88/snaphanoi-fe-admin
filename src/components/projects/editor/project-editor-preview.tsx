import { createElement, type CSSProperties, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import type { OutputData } from "@editorjs/editorjs";
import type { Layout } from "react-grid-layout/legacy";
import type { ProjectEditorMediaItem } from "@/components/projects/editor/project-editor.types";
import { ProjectMediaTile } from "@/components/projects/editor/project-media-tile";
import { normalizeProjectContent } from "@/features/projects/utils/project-content";

type ListItemNode = {
  content?: string;
  items?: ListItemNode[];
  meta?: {
    checked?: boolean;
  };
};

const ROW_HEIGHT = 26;
const GAP = 12;

function renderInlineHtml(html: string): ReactNode[] {
  const parser = new DOMParser();
  const document = parser.parseFromString(html, "text/html");
  const allowedTags = new Set(["strong", "b", "em", "i", "u", "s", "a", "code", "mark", "span", "br"]);

  const mapNode = (node: ChildNode, key: string): ReactNode => {
    if (node.nodeType === Node.TEXT_NODE) {
      return node.textContent;
    }

    if (node.nodeType !== Node.ELEMENT_NODE) {
      return null;
    }

    const element = node as HTMLElement;
    const tag = element.tagName.toLowerCase();
    const children = Array.from(element.childNodes).map((child, index) => mapNode(child, `${key}-${index}`));

    if (!allowedTags.has(tag)) {
      return <span key={key}>{children}</span>;
    }

    if (tag === "a") {
      const href = element.getAttribute("href") ?? "#";
      return (
        <a key={key} href={href} target="_blank" rel="noreferrer noopener">
          {children}
        </a>
      );
    }

    if (tag === "br") {
      return <br key={key} />;
    }

    if (tag === "span") {
      const style: CSSProperties = {
        ...(element.style.color ? { color: element.style.color } : {}),
        ...(element.style.backgroundColor ? { backgroundColor: element.style.backgroundColor } : {}),
        ...(element.style.borderRadius ? { borderRadius: element.style.borderRadius } : {}),
        ...(element.style.padding ? { padding: element.style.padding } : {}),
        ...(element.style.boxDecorationBreak
          ? {
              boxDecorationBreak: element.style.boxDecorationBreak as CSSProperties["boxDecorationBreak"],
              WebkitBoxDecorationBreak: element.style.boxDecorationBreak as CSSProperties["WebkitBoxDecorationBreak"],
            }
          : {}),
      };

      return (
        <span key={key} style={Object.keys(style).length ? style : undefined}>
          {children}
        </span>
      );
    }

    return createElement(tag, { key }, children);
  };

  return Array.from(document.body.childNodes).map((node, index) => mapNode(node, `node-${index}`));
}

function normalizeListItem(item: unknown): ListItemNode {
  if (typeof item === "string") {
    return { content: item, items: [] };
  }

  const node = item as ListItemNode;
  return {
    content: typeof node?.content === "string" ? node.content : "",
    items: Array.isArray(node?.items) ? node.items : [],
    meta:
      node?.meta && typeof node.meta === "object"
        ? { checked: node.meta.checked === true }
        : undefined,
  };
}

function compareLayout(a?: { x?: number; y?: number }, b?: { x?: number; y?: number }) {
  const yDiff = (a?.y ?? 0) - (b?.y ?? 0);
  if (yDiff !== 0) {
    return yDiff;
  }

  return (a?.x ?? 0) - (b?.x ?? 0);
}

function getYouTubeEmbedUrl(source?: string, embed?: string) {
  if (typeof source === "string") {
    const match = source.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([^&?/]+)/,
    );
    if (match?.[1]) {
      return `https://www.youtube-nocookie.com/embed/${match[1]}?rel=0&modestbranding=1`;
    }
  }

  if (typeof embed === "string" && embed.length > 0) {
    return embed.replace("https://www.youtube.com/embed/", "https://www.youtube-nocookie.com/embed/");
  }

  return null;
}

function renderListItems(
  items: unknown[],
  style: "ordered" | "unordered" | "checklist",
  blockId: string,
  depth = 0,
): ReactNode {
  if (style === "checklist") {
    return (
      <ul className="my-4 space-y-3">
        {items.map((item, idx) => {
          const parsed = normalizeListItem(item);
          const key = `${blockId}-${depth}-${idx}`;
          return (
            <li key={key} className="flex gap-3 text-slate-700">
              <span
                aria-hidden="true"
                className={`mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-xl border text-sm ${
                  parsed.meta?.checked
                    ? "border-[--color-brand] bg-[--color-brand] text-slate-950"
                    : "border-slate-300 bg-white text-transparent"
                }`}
              >
                ✓
              </span>
              <span className="min-w-0 flex-1">
                {renderInlineHtml(parsed.content ?? "")}
                {Array.isArray(parsed.items) && parsed.items.length > 0
                  ? renderListItems(parsed.items, style, blockId, depth + 1)
                  : null}
              </span>
            </li>
          );
        })}
      </ul>
    );
  }

  const Tag = style === "ordered" ? "ol" : "ul";
  const listClass =
    style === "ordered"
      ? "my-4 list-decimal space-y-2 pl-6 text-slate-700 marker:text-slate-400"
      : "my-4 list-disc space-y-2 pl-6 text-slate-700 marker:text-slate-400";

  return (
    <Tag className={listClass}>
      {items.map((item, idx) => {
        const parsed = normalizeListItem(item);
        const key = `${blockId}-${depth}-${idx}`;
        return (
          <li key={key}>
            {renderInlineHtml(parsed.content ?? "")}
            {Array.isArray(parsed.items) && parsed.items.length > 0
              ? renderListItems(parsed.items, style, blockId, depth + 1)
              : null}
          </li>
        );
      })}
    </Tag>
  );
}

function PreviewMedia({
  media,
  layout,
}: {
  media: ProjectEditorMediaItem[];
  layout: Layout;
}) {
  if (!media.length) {
    return null;
  }

  const layoutMap = new Map(layout.map((entry) => [entry.i, entry]));
  const sortedMedia = [...media].sort((first, second) => compareLayout(layoutMap.get(first.id), layoutMap.get(second.id)));

  return (
    <div
      className="grid grid-cols-12"
      style={{
        gap: `${GAP}px`,
        gridAutoRows: `${ROW_HEIGHT}px`,
      }}
    >
      {sortedMedia.map((item) => {
        if (!("url" in item) || typeof item.url !== "string") {
          return null;
        }

        const entry = layoutMap.get(item.id);
        const style: CSSProperties | undefined = entry
          ? {
              gridColumn: `${entry.x + 1} / span ${entry.w}`,
              gridRow: `${entry.y + 1} / span ${entry.h}`,
            }
          : undefined;

        return (
          <div key={item.id} style={style} className="min-w-0">
            <ProjectMediaTile item={item} />
          </div>
        );
      })}
    </div>
  );
}

export function ProjectEditorPreview({ content }: { content: OutputData }) {
  const t = useTranslations("projects.editor");
  const normalized = normalizeProjectContent(content);

  return (
    <div className="mx-auto max-w-4xl space-y-2 text-[1.02rem] leading-8 text-slate-700">
      {normalized.blocks.map((block, index) => {
        const blockId = block.id ?? `block-${index}`;

        if (block.type === "mediaLayout") {
          const mediaData = block.data as {
            items?: ProjectEditorMediaItem[];
            layout?: Layout;
          };

          return (
            <div key={blockId} className="not-prose my-10">
              <PreviewMedia media={mediaData.items ?? []} layout={mediaData.layout ?? []} />
            </div>
          );
        }

        if (block.type === "header") {
          const level = Number((block.data as { level?: number }).level ?? 2);
          const rich = renderInlineHtml(String((block.data as { text?: string }).text ?? ""));

          if (level === 1) {
            return <h1 key={blockId} className="mb-5 text-4xl font-semibold leading-tight tracking-[-0.03em] text-slate-950 md:text-5xl">{rich}</h1>;
          }

          if (level === 2) {
            return <h2 key={blockId} className="mb-5 mt-10 text-3xl font-semibold tracking-[-0.03em] text-slate-950 md:text-4xl">{rich}</h2>;
          }

          if (level === 3) {
            return <h3 key={blockId} className="mb-4 mt-8 text-2xl font-semibold tracking-tight text-slate-900">{rich}</h3>;
          }

          if (level === 4) {
            return <h4 key={blockId} className="mb-3 mt-7 text-xl font-semibold text-slate-900">{rich}</h4>;
          }

          if (level === 5) {
            return <h5 key={blockId} className="mb-3 mt-6 text-lg font-semibold text-slate-900">{rich}</h5>;
          }

          return <h6 key={blockId} className="mb-3 mt-6 text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">{rich}</h6>;
        }

        if (block.type === "list") {
          const listData = block.data as {
            style?: "ordered" | "unordered" | "checklist";
            items?: unknown[];
          };

          return <div key={blockId}>{renderListItems(listData.items ?? [], listData.style ?? "unordered", blockId)}</div>;
        }

        if (block.type === "youtube" || block.type === "embed") {
          const embedData = block.data as {
            service?: string;
            source?: string;
            embed?: string;
            caption?: string;
          };

          const youtubeUrl =
            embedData.service === "youtube" || block.type === "youtube"
              ? getYouTubeEmbedUrl(embedData.source, embedData.embed)
              : null;

          if (youtubeUrl) {
            return (
              <figure key={blockId} className="my-8">
                <div className="overflow-hidden rounded-[28px] border border-slate-200/80 bg-slate-950 shadow-[0_24px_60px_rgba(15,23,42,0.16)]">
                  <div className="relative w-full pt-[56.25%]">
                    <iframe
                      src={youtubeUrl}
                      title={embedData.caption || t("youtubeTitle")}
                      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0 h-full w-full border-0"
                    />
                  </div>
                </div>
                {embedData.caption ? (
                  <figcaption className="mt-4 text-sm leading-7 text-slate-500">
                    {renderInlineHtml(embedData.caption)}
                  </figcaption>
                ) : null}
              </figure>
            );
          }
        }

        const rich = renderInlineHtml(String((block.data as { text?: string }).text ?? ""));
        return (
          <p key={blockId} className="mb-5 text-[1.02rem] leading-8 text-slate-700">
            {rich}
          </p>
        );
      })}
    </div>
  );
}
