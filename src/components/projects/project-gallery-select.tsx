import { useTranslations } from "next-intl";

import { AppSelect } from "@/components/ui/select";

export type ProjectGalleryOption = {
  id: string;
  name: string;
};

type ProjectGallerySelectProps = {
  value: string;
  onChange: (value: string) => void;
  galleries: ProjectGalleryOption[];
  disabled?: boolean;
};

export function ProjectGallerySelect({
  value,
  onChange,
  galleries,
  disabled = false,
}: ProjectGallerySelectProps) {
  const t = useTranslations("projects.gallerySelect");

  return (
    <AppSelect
      value={value}
      onChange={onChange}
      disabled={disabled}
      options={galleries.map((gallery) => ({
        value: gallery.id,
        label: gallery.name,
        description: gallery.id,
      }))}
      placeholder={t("placeholder")}
    />
  );
}
