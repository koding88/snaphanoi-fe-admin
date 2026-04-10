import type { OutputData } from "@editorjs/editorjs";

import type { BlogDetailRecord } from "@/features/blogs/types/blogs.types";

export type BlogMutationPayload = {
  name: string;
  content: OutputData;
  isPinned: boolean;
  isPublished: boolean;
  coverImageUploadToken?: string;
};

export type DeleteBlogResult = {
  message: string;
};

export type BlogMutationResult = BlogDetailRecord;
