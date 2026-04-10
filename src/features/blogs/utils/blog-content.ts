import type { OutputData } from "@editorjs/editorjs";
import type { Layout, LayoutItem } from "react-grid-layout/legacy";

type GenericBlock = {
  id?: string;
  type: string;
  data: Record<string, unknown>;
};

type GenericMediaItem = {
  id?: unknown;
  kind?: unknown;
  fileId?: unknown;
  uploadToken?: unknown;
  url?: unknown;
};

type GenericMediaLayoutBlock = GenericBlock & {
  type: "mediaLayout";
  data: {
    items?: GenericMediaItem[];
    layout?: Layout;
  };
};

type SerializedMediaItem =
  | { id: string; kind: "youtube"; url: string }
  | { id: string; kind: "image"; fileId: string; url: string }
  | { id: string; kind: "image"; uploadToken: string };

const DEFAULT_ROW_HEIGHT = 8;

function isLayoutItem(value: unknown): value is LayoutItem {
  const item = value as LayoutItem | null;
  return Boolean(
    item &&
      typeof item.i === "string" &&
      typeof item.x === "number" &&
      typeof item.y === "number" &&
      typeof item.w === "number" &&
      typeof item.h === "number",
  );
}

function toFallbackLayout(items: Array<{ id: string }>): Layout {
  return items.map((item, index) => ({
    i: item.id,
    x: 0,
    y: index * DEFAULT_ROW_HEIGHT,
    w: 12,
    h: DEFAULT_ROW_HEIGHT,
  }));
}

function normalizeMediaLayoutBlock(block: GenericMediaLayoutBlock): GenericMediaLayoutBlock {
  const normalizedItems = (block.data.items ?? [])
    .map((item) => {
      const id = typeof item.id === "string" ? item.id : null;
      const kind = item.kind === "image" || item.kind === "youtube" ? item.kind : null;

      if (!id || !kind) {
        return null;
      }

      if (kind === "youtube") {
        return typeof item.url === "string" && item.url ? { id, kind, url: item.url } : null;
      }

      if (typeof item.fileId === "string" && typeof item.url === "string") {
        return {
          id,
          kind,
          fileId: item.fileId,
          url: item.url,
        };
      }

      if (typeof item.uploadToken === "string") {
        return {
          id,
          kind,
          uploadToken: item.uploadToken,
          ...(typeof item.url === "string" ? { url: item.url } : {}),
        };
      }

      return typeof item.url === "string" ? { id, kind, url: item.url } : null;
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  const itemIds = new Set(normalizedItems.map((item) => item.id));
  const normalizedLayout = Array.isArray(block.data.layout)
    ? block.data.layout.filter((entry) => isLayoutItem(entry) && itemIds.has(entry.i))
    : [];

  return {
    ...block,
    data: {
      items: normalizedItems,
      layout: normalizedLayout.length > 0 ? normalizedLayout : toFallbackLayout(normalizedItems),
    },
  };
}

export function createEmptyBlogContent(): OutputData {
  return {
    time: Date.now(),
    blocks: [
      {
        id: "blog-intro-title",
        type: "header",
        data: { text: "Blog story", level: 2 },
      },
      {
        id: "blog-intro-copy",
        type: "paragraph",
        data: {
          text: "Shape the article, add media, and prepare the final studio presentation here.",
        },
      },
    ],
  };
}

export function normalizeBlogContent(content?: OutputData | null): OutputData {
  const baseContent = content?.blocks ? content : createEmptyBlogContent();

  return {
    ...baseContent,
    blocks: baseContent.blocks.map((block) => {
      if (block.type !== "mediaLayout") {
        return block;
      }

      return normalizeMediaLayoutBlock(block as GenericMediaLayoutBlock);
    }),
  };
}

export function serializeBlogContent(content: OutputData): OutputData {
  const normalized = normalizeBlogContent(content);

  return {
    ...normalized,
    blocks: normalized.blocks.map((block) => {
      if (block.type !== "mediaLayout") {
        return block;
      }

      const mediaBlock = block as GenericMediaLayoutBlock;

      return {
        ...mediaBlock,
        data: {
          items: (mediaBlock.data.items ?? []).reduce<SerializedMediaItem[]>((accumulator, item) => {
            const id = typeof item.id === "string" ? item.id : null;
            const kind = item.kind === "image" || item.kind === "youtube" ? item.kind : null;

            if (!id || !kind) {
              return accumulator;
            }

            if (kind === "youtube" && typeof item.url === "string") {
              accumulator.push({ id, kind, url: item.url });
              return accumulator;
            }

            if (typeof item.fileId === "string" && typeof item.url === "string") {
              accumulator.push({ id, kind: "image", fileId: item.fileId, url: item.url });
              return accumulator;
            }

            if (typeof item.uploadToken === "string") {
              accumulator.push({ id, kind: "image", uploadToken: item.uploadToken });
              return accumulator;
            }

            return accumulator;
          }, []),
          layout: Array.isArray(mediaBlock.data.layout) ? mediaBlock.data.layout.filter(isLayoutItem) : [],
        },
      };
    }),
  };
}

export function getBlogContentSubmitError(content: OutputData) {
  const normalized = normalizeBlogContent(content);

  if (!normalized.blocks.length) {
    return "Add at least one content block before saving.";
  }

  for (const block of normalized.blocks) {
    if (block.type !== "mediaLayout") {
      continue;
    }

    const mediaBlock = block as GenericMediaLayoutBlock;

    for (const item of mediaBlock.data.items ?? []) {
      if (item.kind === "image" && typeof item.fileId !== "string" && typeof item.uploadToken !== "string") {
        return "One or more content images have not finished uploading yet.";
      }

      if (item.kind === "youtube" && typeof item.url !== "string") {
        return "A YouTube item is missing its URL.";
      }
    }
  }

  return null;
}
