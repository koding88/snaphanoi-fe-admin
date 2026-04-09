export type GalleryLocalizedName = {
  en: string;
  vi: string;
  cn: string;
};

export type GalleryCreator = {
  id: string;
  name: string;
};

export type GalleryRecord = {
  id: string;
  name: GalleryLocalizedName;
  createdBy: GalleryCreator;
  isActive: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type GalleriesListMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type GalleriesListResult = {
  items: GalleryRecord[];
  meta: GalleriesListMeta;
};

export type GalleryListQuery = {
  page: number;
  limit: number;
  keyword?: string;
  isActive?: boolean | "all";
};
