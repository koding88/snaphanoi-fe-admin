export type FileUploadKind = "image";

export type FileUploadPurpose =
  | "project-cover"
  | "project-content"
  | "blog-cover"
  | "package-cover"
  | "gallery-cover";

export type RequestUploadPayload = {
  fileName: string;
  mimeType: string;
  size: number;
  kind: FileUploadKind;
  purpose: FileUploadPurpose;
};

export type RequestUploadResult = {
  uploadToken: string;
  key: string;
  url: string;
  uploadUrl: string;
  expiresInSeconds: number;
  headers: Record<string, string>;
};
