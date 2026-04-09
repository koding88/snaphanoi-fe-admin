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
      placeholder="Choose a gallery"
    />
  );
}
