export type PackageLocalizedText = {
  en: string;
  vi: string;
  cn: string;
};

export type PackagePricing = {
  amount: number;
  currency: string;
};

export type PackageFileRecord = {
  id: string;
  url: string;
  mimeType: string;
  size: number;
  originalName: string;
};

export type PackageCreator = {
  id: string;
  name: string;
};

export type PackageRecord = {
  id: string;
  name: PackageLocalizedText;
  bestFor: PackageLocalizedText;
  duration: number;
  photoCount: number;
  pricing: PackagePricing;
  coverImage: PackageFileRecord;
  isActive: boolean;
  deletedAt: string | null;
  createdBy: PackageCreator;
  createdAt: string;
  updatedAt: string;
};

export type PackageDetailRecord = PackageRecord;

export type PackagesListMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type PackagesListResult = {
  items: PackageRecord[];
  meta: PackagesListMeta;
};

export type PackageListQuery = {
  page: number;
  limit: number;
  keyword?: string;
  isActive?: boolean | "all";
};
