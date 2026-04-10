import type {
  PackageDetailRecord,
  PackageLocalizedText,
  PackagePricing,
} from "@/features/packages/types/packages.types";

export type PackageMutationPayload = {
  name: PackageLocalizedText;
  bestFor: PackageLocalizedText;
  duration: number;
  photoCount: number;
  pricing: PackagePricing;
  coverImageUploadToken?: string;
};

export type DeletePackageResult = {
  message: string;
};

export type PackageMutationResult = PackageDetailRecord;
