import type { OutputData } from "@editorjs/editorjs";
import type { Layout } from "react-grid-layout/legacy";

export type ProjectEditorExistingImageItem = {
  id: string;
  kind: "image";
  fileId: string;
  url: string;
};

export type ProjectEditorUploadedImageItem = {
  id: string;
  kind: "image";
  uploadToken: string;
  url: string;
};

export type ProjectEditorYoutubeItem = {
  id: string;
  kind: "youtube";
  url: string;
};

export type ProjectEditorMediaItem =
  | ProjectEditorExistingImageItem
  | ProjectEditorUploadedImageItem
  | ProjectEditorYoutubeItem;

export type ProjectEditorMediaLayoutData = {
  items: ProjectEditorMediaItem[];
  layout: Layout;
};

export type ProjectEditorDocument = OutputData;

export type ProjectEditorUploadResult = {
  uploadToken: string;
  url: string;
  originalName: string;
  mimeType: string;
  size: number;
};

export type ProjectEditorImageUploader = (file: File) => Promise<ProjectEditorUploadResult>;
