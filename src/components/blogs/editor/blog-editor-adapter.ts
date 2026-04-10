import type { OutputData } from "@editorjs/editorjs";

import {
  createEmptyBlogContent,
  getBlogContentSubmitError,
  normalizeBlogContent,
  serializeBlogContent,
} from "@/features/blogs/utils/blog-content";

export function buildBlogEditorInitialContent(content?: OutputData | null) {
  return normalizeBlogContent(content);
}

export function buildBlogEditorEmptyContent() {
  return createEmptyBlogContent();
}

export function buildBlogContentPayload(content: OutputData) {
  return serializeBlogContent(content);
}

export function getBlogEditorSubmitError(content: OutputData) {
  return getBlogContentSubmitError(content);
}
