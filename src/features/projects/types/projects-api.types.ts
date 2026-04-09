import type { OutputData } from "@editorjs/editorjs";
import type { ProjectDetailRecord, ProjectLocalizedName } from "@/features/projects/types/projects.types";

export type ProjectMutationPayload = {
  galleryId: string;
  name: ProjectLocalizedName;
  content: OutputData;
  isPublished: boolean;
  coverImageUploadToken?: string;
};

export type DeleteProjectResult = {
  message: string;
};

export type ProjectMutationResult = ProjectDetailRecord;
