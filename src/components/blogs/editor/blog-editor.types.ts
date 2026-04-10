import type { OutputData } from "@editorjs/editorjs";
import type { Layout } from "react-grid-layout/legacy";

export type BlogEditorExistingImageItem = {
  id: string;
  kind: "image";
  fileId: string;
  url: string;
};

export type BlogEditorUploadedImageItem = {
  id: string;
  kind: "image";
  uploadToken: string;
  url: string;
};

export type BlogEditorYoutubeItem = {
  id: string;
  kind: "youtube";
  url: string;
};

export type BlogEditorMediaItem =
  | BlogEditorExistingImageItem
  | BlogEditorUploadedImageItem
  | BlogEditorYoutubeItem;

export type BlogEditorMediaLayoutData = {
  items: BlogEditorMediaItem[];
  layout: Layout;
};

export type BlogEditorDocument = OutputData;

export type BlogEditorUploadResult = {
  uploadToken: string;
  url: string;
  originalName: string;
  mimeType: string;
  size: number;
};

export type BlogEditorImageUploader = (file: File) => Promise<BlogEditorUploadResult>;
