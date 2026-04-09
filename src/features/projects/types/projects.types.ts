import type { OutputData } from "@editorjs/editorjs";

export type ProjectLocalizedName = {
  en: string;
  vi: string;
  cn: string;
};

export type ProjectGalleryRef = {
  id: string;
  name: string;
};

export type ProjectFileRecord = {
  id: string;
  url: string;
  mimeType: string;
  size: number;
  originalName: string;
};

export type ProjectCreator = {
  id: string;
  name: string;
};

export type ProjectRecord = {
  id: string;
  gallery: ProjectGalleryRef;
  name: ProjectLocalizedName;
  coverImage: ProjectFileRecord;
  isPublished: boolean;
  isActive: boolean;
  deletedAt: string | null;
  createdBy: ProjectCreator;
  createdAt: string;
  updatedAt: string;
};

export type ProjectDetailRecord = ProjectRecord & {
  content: OutputData;
};

export type ProjectsListMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type ProjectsListResult = {
  items: ProjectRecord[];
  meta: ProjectsListMeta;
};

export type ProjectListQuery = {
  page: number;
  limit: number;
  keyword?: string;
  isActive?: boolean | "all";
  isPublished?: boolean | "all";
};
