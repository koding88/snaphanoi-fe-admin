import type { OutputData } from "@editorjs/editorjs";
import type { Layout, LayoutItem } from "react-grid-layout/legacy";

import {
  createEmptyBlogLocalizedText,
  isBlogLocalizedText,
  normalizeBlogLocalizedText,
  resolveBlogLocalizedText,
  type BlogLocale,
} from "@/features/blogs/utils/blog-localization";

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

type GenericListItem =
  | string
  | ReturnType<typeof createEmptyBlogLocalizedText>
  | {
      content?: unknown;
      items?: GenericListItem[];
      meta?: Record<string, unknown>;
    };

type SerializedMediaItem =
  | { id: string; kind: "youtube"; url: string }
  | { id: string; kind: "image"; fileId: string; url: string }
  | { id: string; kind: "image"; uploadToken: string };

const DEFAULT_ROW_HEIGHT = 8;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function cloneContent(content: OutputData): OutputData {
  return JSON.parse(JSON.stringify(content)) as OutputData;
}

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

function normalizeMediaLayoutBlock(
  block: GenericMediaLayoutBlock,
): GenericMediaLayoutBlock {
  const normalizedItems = (block.data.items ?? [])
    .map((item) => {
      const id = typeof item.id === "string" ? item.id : null;
      const kind =
        item.kind === "image" || item.kind === "youtube" ? item.kind : null;

      if (!id || !kind) {
        return null;
      }

      if (kind === "youtube") {
        return typeof item.url === "string" && item.url
          ? { id, kind, url: item.url }
          : null;
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
    ? block.data.layout.filter(
        (entry) => isLayoutItem(entry) && itemIds.has(entry.i),
      )
    : [];

  return {
    ...block,
    data: {
      items: normalizedItems,
      layout:
        normalizedLayout.length > 0
          ? normalizedLayout
          : toFallbackLayout(normalizedItems),
    },
  };
}

function normalizeListItemForStorage(item: unknown): GenericListItem {
  if (typeof item === "string" || isBlogLocalizedText(item)) {
    return normalizeBlogLocalizedText(item);
  }

  if (!isRecord(item)) {
    return createEmptyBlogLocalizedText();
  }

  return {
    ...item,
    content: normalizeBlogLocalizedText(item.content),
    items: Array.isArray(item.items)
      ? item.items.map(normalizeListItemForStorage)
      : [],
  };
}

function localizeListItemForEditor(item: unknown, locale: BlogLocale): unknown {
  if (typeof item === "string" || isBlogLocalizedText(item)) {
    return resolveBlogLocalizedText(item, locale);
  }

  if (!isRecord(item)) {
    return "";
  }

  return {
    ...item,
    content: resolveBlogLocalizedText(item.content, locale),
    items: Array.isArray(item.items)
      ? item.items.map((child) => localizeListItemForEditor(child, locale))
      : [],
  };
}

function mergeLocalizedValue(
  previous: unknown,
  next: unknown,
  locale: BlogLocale,
) {
  const merged = normalizeBlogLocalizedText(previous);

  if (typeof next === "string") {
    merged[locale] = next;
    return merged;
  }

  if (isBlogLocalizedText(next)) {
    return normalizeBlogLocalizedText(next);
  }

  return merged;
}

function mergeListItems(
  previousItems: unknown[] | undefined,
  nextItems: unknown[],
  locale: BlogLocale,
): unknown[] {
  return nextItems.map((item, index) => {
    const previousItem = previousItems?.[index];

    if (typeof item === "string" || isBlogLocalizedText(item)) {
      return mergeLocalizedValue(previousItem, item, locale);
    }

    if (!isRecord(item)) {
      return item;
    }

    const previousRecord = isRecord(previousItem) ? previousItem : {};

    return {
      ...item,
      content: mergeLocalizedValue(
        previousRecord.content,
        item.content,
        locale,
      ),
      items: Array.isArray(item.items)
        ? mergeListItems(
            Array.isArray(previousRecord.items) ? previousRecord.items : [],
            item.items,
            locale,
          )
        : [],
    };
  });
}

function findMatchingPreviousBlock(
  previousBlocks: GenericBlock[],
  nextBlock: GenericBlock,
  index: number,
) {
  if (nextBlock.id) {
    const matched = previousBlocks.find(
      (candidate) =>
        candidate.id === nextBlock.id && candidate.type === nextBlock.type,
    );

    if (matched) {
      return matched;
    }
  }

  const candidate = previousBlocks[index];
  return candidate?.type === nextBlock.type ? candidate : undefined;
}

export function createEmptyBlogContent(): OutputData {
  return {
    time: Date.now(),
    blocks: [
      {
        id: "blog-intro-title",
        type: "header",
        data: { text: createEmptyBlogLocalizedText("Blog story"), level: 2 },
      },
      {
        id: "blog-intro-copy",
        type: "paragraph",
        data: {
          text: createEmptyBlogLocalizedText(
            "Shape the article, add media, and prepare the final studio presentation here.",
          ),
        },
      },
    ],
  };
}

export function normalizeBlogContent(content?: OutputData | null): OutputData {
  const baseContent = content?.blocks
    ? cloneContent(content)
    : createEmptyBlogContent();

  return {
    ...baseContent,
    blocks: baseContent.blocks.map((block) => {
      if (block.type === "mediaLayout") {
        return normalizeMediaLayoutBlock(block as GenericMediaLayoutBlock);
      }

      if (block.type === "header" || block.type === "paragraph") {
        return {
          ...block,
          data: {
            ...block.data,
            text: normalizeBlogLocalizedText(
              (block.data as { text?: unknown }).text,
            ),
          },
        };
      }

      if (block.type === "list") {
        return {
          ...block,
          data: {
            ...block.data,
            items: Array.isArray((block.data as { items?: unknown[] }).items)
              ? ((block.data as { items?: unknown[] }).items ?? []).map(
                  normalizeListItemForStorage,
                )
              : [],
          },
        };
      }

      return block;
    }),
  };
}

export function projectBlogContentToEditorLocale(
  content: OutputData,
  locale: BlogLocale,
): OutputData {
  const normalized = normalizeBlogContent(content);

  return {
    ...normalized,
    blocks: normalized.blocks.map((block) => {
      if (block.type === "header" || block.type === "paragraph") {
        return {
          ...block,
          data: {
            ...block.data,
            text: resolveBlogLocalizedText(
              (block.data as { text?: unknown }).text,
              locale,
            ),
          },
        };
      }

      if (block.type === "list") {
        return {
          ...block,
          data: {
            ...block.data,
            items: ((block.data as { items?: unknown[] }).items ?? []).map(
              (item) => localizeListItemForEditor(item, locale),
            ),
          },
        };
      }

      return block;
    }),
  };
}

export function mergeBlogEditorLocaleContent(
  previousContent: OutputData,
  nextEditorContent: OutputData,
  locale: BlogLocale,
): OutputData {
  const normalizedPrevious = normalizeBlogContent(previousContent);
  const clonedNext = cloneContent(nextEditorContent);

  return normalizeBlogContent({
    ...clonedNext,
    blocks: clonedNext.blocks.map((block, index) => {
      const nextBlock = block as GenericBlock;
      const previousBlock = findMatchingPreviousBlock(
        normalizedPrevious.blocks as GenericBlock[],
        nextBlock,
        index,
      );

      if (nextBlock.type === "header" || nextBlock.type === "paragraph") {
        return {
          ...nextBlock,
          data: {
            ...nextBlock.data,
            text: mergeLocalizedValue(
              (previousBlock?.data as { text?: unknown } | undefined)?.text,
              (nextBlock.data as { text?: unknown }).text,
              locale,
            ),
          },
        };
      }

      if (nextBlock.type === "list") {
        return {
          ...nextBlock,
          data: {
            ...nextBlock.data,
            items: mergeListItems(
              (previousBlock?.data as { items?: unknown[] } | undefined)?.items,
              Array.isArray((nextBlock.data as { items?: unknown[] }).items)
                ? ((nextBlock.data as { items?: unknown[] }).items ?? [])
                : [],
              locale,
            ),
          },
        };
      }

      if (nextBlock.type === "mediaLayout") {
        return normalizeMediaLayoutBlock(nextBlock as GenericMediaLayoutBlock);
      }

      return nextBlock;
    }),
  });
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
          items: (mediaBlock.data.items ?? []).reduce<SerializedMediaItem[]>(
            (accumulator, item) => {
              const id = typeof item.id === "string" ? item.id : null;
              const kind =
                item.kind === "image" || item.kind === "youtube"
                  ? item.kind
                  : null;

              if (!id || !kind) {
                return accumulator;
              }

              if (kind === "youtube" && typeof item.url === "string") {
                accumulator.push({ id, kind, url: item.url });
                return accumulator;
              }

              if (
                typeof item.fileId === "string" &&
                typeof item.url === "string"
              ) {
                accumulator.push({
                  id,
                  kind: "image",
                  fileId: item.fileId,
                  url: item.url,
                });
                return accumulator;
              }

              if (typeof item.uploadToken === "string") {
                accumulator.push({
                  id,
                  kind: "image",
                  uploadToken: item.uploadToken,
                });
                return accumulator;
              }

              return accumulator;
            },
            [],
          ),
          layout: Array.isArray(mediaBlock.data.layout)
            ? mediaBlock.data.layout.filter(isLayoutItem)
            : [],
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
      if (
        item.kind === "image" &&
        typeof item.fileId !== "string" &&
        typeof item.uploadToken !== "string"
      ) {
        return "One or more content images have not finished uploading yet.";
      }

      if (item.kind === "youtube" && typeof item.url !== "string") {
        return "A YouTube item is missing its URL.";
      }
    }
  }

  return null;
}
