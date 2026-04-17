import type { OutputData } from "@editorjs/editorjs";

import type { BlogDetailRecord } from "@/features/blogs/types/blogs.types";
import type { BlogLocalizedText } from "@/features/blogs/utils/blog-localization";

export type BlogMutationPayload = {
  name: BlogLocalizedText;
  content: OutputData;
  isPinned: boolean;
  isPublished: boolean;
  coverImageUploadToken?: string;
};

export type DeleteBlogResult = {
  message: string;
};

export type BlogMutationResult = BlogDetailRecord;
