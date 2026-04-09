import type { GalleryLocalizedName, GalleryRecord } from "@/features/galleries/types/galleries.types";

export type GalleryPayload = {
  name: GalleryLocalizedName;
};

export type DeleteGalleryResult = {
  message: string;
};

export type GalleryMutationResult = GalleryRecord;
