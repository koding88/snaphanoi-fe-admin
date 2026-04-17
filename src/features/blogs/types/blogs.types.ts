import type { OutputData } from "@editorjs/editorjs";

import type { BlogLocalizedText } from "@/features/blogs/utils/blog-localization";

export type BlogFileRecord = {
  id: string;
  url: string;
  mimeType: string;
  size: number;
  originalName: string;
};

export type BlogCreator = {
  id: string;
  name: string | null;
};

export type BlogRecord = {
  id: string;
  name: BlogLocalizedText;
  coverImage: BlogFileRecord;
  isPinned: boolean;
  isPublished: boolean;
  isActive: boolean;
  deletedAt: string | null;
  createdBy: BlogCreator;
  createdAt: string;
  updatedAt: string;
};

export type BlogDetailRecord = BlogRecord & {
  content: OutputData;
};

export type BlogsListMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type BlogsListResult = {
  items: BlogRecord[];
  meta: BlogsListMeta;
};

export type BlogListQuery = {
  page: number;
  limit: number;
  keyword?: string;
  isActive?: boolean | "all";
  isPublished?: boolean | "all";
  isPinned?: boolean | "all";
};
