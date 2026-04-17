import type { OutputData } from "@editorjs/editorjs";

import {
  createEmptyBlogContent,
  getBlogContentSubmitError,
  mergeBlogEditorLocaleContent,
  normalizeBlogContent,
  projectBlogContentToEditorLocale,
  serializeBlogContent,
} from "@/features/blogs/utils/blog-content";
import type { BlogLocale } from "@/features/blogs/utils/blog-localization";

export function buildBlogEditorInitialContent(
  content?: OutputData | null,
  locale: BlogLocale = "en",
) {
  return projectBlogContentToEditorLocale(
    normalizeBlogContent(content),
    locale,
  );
}

export function buildBlogEditorEmptyContent() {
  return createEmptyBlogContent();
}

export function mergeBlogEditorContent(
  previousContent: OutputData,
  nextEditorContent: OutputData,
  locale: BlogLocale,
) {
  return mergeBlogEditorLocaleContent(
    previousContent,
    nextEditorContent,
    locale,
  );
}

export function buildBlogContentPayload(content: OutputData) {
  return serializeBlogContent(content);
}

export function getBlogEditorSubmitError(content: OutputData) {
  return getBlogContentSubmitError(content);
}
