"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import type { OutputData } from "@editorjs/editorjs";

import { ProjectCoverField } from "@/components/projects/project-cover-field";
import {
  buildProjectContentPayload,
  buildProjectEditorInitialContent,
  getProjectEditorSubmitError,
} from "@/components/projects/editor/project-editor-adapter";
import {
  ProjectGallerySelect,
  type ProjectGalleryOption,
} from "@/components/projects/project-gallery-select";
import { LocalizedNameEditor } from "@/components/shared/localized-name-editor";
import { Button } from "@/components/ui/button";
import { AppSelect } from "@/components/ui/select";
import { requestUpload } from "@/features/files/api/request-upload";
import { uploadFileToStorage } from "@/features/files/api/upload-file-to-storage";
import type { RequestUploadResult } from "@/features/files/types/files.types";
import type { ProjectMutationPayload } from "@/features/projects/types/projects-api.types";
import type { ProjectFileRecord } from "@/features/projects/types/projects.types";
import { buildProjectEditorEmptyContent } from "@/components/projects/editor/project-editor-adapter";
import { getFriendlyProjectsError } from "@/features/projects/utils/projects-errors";
import { notifyError } from "@/lib/toast";

const ProjectEditor = dynamic(
  () =>
    import("@/components/projects/editor/project-editor").then(
      (module) => module.ProjectEditor,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="rounded-2xl border border-border/70 bg-white p-6 shadow-sm">
        <div className="flex min-h-[560px] items-center justify-center rounded-xl border border-dashed border-border/60 bg-white">
          <div className="h-2.5 w-28 rounded-full bg-border/60" />
        </div>
      </div>
    ),
  },
);

type ProjectFormValues = {
  galleryId: string;
  name: {
    en: string;
    vi: string;
    cn: string;
  };
  isPublished: boolean;
  content: OutputData;
};

type ProjectFormProps = {
  mode: "create" | "edit";
  galleries: ProjectGalleryOption[];
  initialValues?: Partial<ProjectFormValues>;
  existingCoverImage?: ProjectFileRecord | null;
  submitLabel: string;
  description?: string;
  onSubmit: (payload: ProjectMutationPayload) => Promise<void>;
};

type CoverUploadState = {
  previewUrl: string | null;
  title: string | null;
  meta: string | null;
  uploadToken?: string;
  existingCoverImage?: ProjectFileRecord | null;
  changed: boolean;
};

const DEFAULT_COVER_STATE: CoverUploadState = {
  previewUrl: null,
  title: null,
  meta: null,
  changed: false,
};

function getCoverMeta(file: { mimeType: string; size: number }) {
  return `${file.mimeType} · ${Math.round(file.size / 1024)} KB`;
}

export function ProjectForm({
  mode,
  galleries,
  initialValues,
  existingCoverImage = null,
  submitLabel,
  description,
  onSubmit,
}: ProjectFormProps) {
  const t = useTranslations("projects.form");
  const [values, setValues] = useState<ProjectFormValues>({
    galleryId: initialValues?.galleryId ?? galleries[0]?.id ?? "",
    name: {
      en: initialValues?.name?.en ?? "",
      vi: initialValues?.name?.vi ?? "",
      cn: initialValues?.name?.cn ?? "",
    },
    isPublished: initialValues?.isPublished ?? false,
    content: buildProjectEditorInitialContent(
      initialValues?.content ?? buildProjectEditorEmptyContent(),
    ),
  });
  const [cover, setCover] = useState<CoverUploadState>(() =>
    existingCoverImage
      ? {
          previewUrl: existingCoverImage.url,
          title: existingCoverImage.originalName,
          meta: getCoverMeta(existingCoverImage),
          existingCoverImage,
          changed: false,
        }
      : DEFAULT_COVER_STATE,
  );
  const [fieldErrors, setFieldErrors] = useState<{
    galleryId?: string;
    nameEn?: string;
    nameVi?: string;
    nameCn?: string;
    cover?: string;
    content?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);

  function errorKeyByLocale(locale: "en" | "vi" | "cn") {
    if (locale === "en") {
      return "nameEn";
    }

    if (locale === "vi") {
      return "nameVi";
    }

    return "nameCn";
  }

  useEffect(() => {
    if (!existingCoverImage) {
      return;
    }

    setCover({
      previewUrl: existingCoverImage.url,
      title: existingCoverImage.originalName,
      meta: getCoverMeta(existingCoverImage),
      existingCoverImage,
      changed: false,
    });
  }, [existingCoverImage]);

  async function uploadProjectFile(
    file: File,
    purpose: "project-cover" | "project-content",
  ) {
    const requested = await requestUpload({
      fileName: file.name,
      mimeType: file.type,
      size: file.size,
      kind: "image",
      purpose,
    });

    const uploadInfo: RequestUploadResult = requested.data;

    await uploadFileToStorage({
      uploadUrl: uploadInfo.uploadUrl,
      file,
      headers: uploadInfo.headers,
    });

    return {
      uploadToken: uploadInfo.uploadToken,
      url: uploadInfo.url,
      originalName: file.name,
      mimeType: file.type,
      size: file.size,
    };
  }

  async function handleCoverUpload(file: File) {
    setIsUploadingCover(true);
    setFieldErrors((current) => ({ ...current, cover: undefined }));

    try {
      const uploaded = await uploadProjectFile(file, "project-cover");
      setCover({
        previewUrl: uploaded.url,
        title: uploaded.originalName,
        meta: `${uploaded.mimeType} · ${Math.round(uploaded.size / 1024)} KB`,
        uploadToken: uploaded.uploadToken,
        existingCoverImage,
        changed: true,
      });
    } catch (error) {
      notifyError(getFriendlyProjectsError(error));
      setFieldErrors((current) => ({
        ...current,
        cover: t("errors.coverUploadFailed"),
      }));
    } finally {
      setIsUploadingCover(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextFieldErrors: typeof fieldErrors = {};

    if (mode === "create" && !values.galleryId) {
      nextFieldErrors.galleryId = t("errors.galleryRequired");
    }

    if (!values.name.en.trim()) {
      nextFieldErrors.nameEn = t("errors.nameEnRequired");
    }

    if (!values.name.vi.trim()) {
      nextFieldErrors.nameVi = t("errors.nameViRequired");
    }

    if (!values.name.cn.trim()) {
      nextFieldErrors.nameCn = t("errors.nameCnRequired");
    }

    if (mode === "create" && !cover.uploadToken) {
      nextFieldErrors.cover = t("errors.coverRequired");
    }

    const contentError = getProjectEditorSubmitError(values.content);
    if (contentError) {
      nextFieldErrors.content = contentError;
    }

    setFieldErrors(nextFieldErrors);

    if (Object.keys(nextFieldErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit({
        ...(values.galleryId ? { galleryId: values.galleryId } : {}),
        name: {
          en: values.name.en.trim(),
          vi: values.name.vi.trim(),
          cn: values.name.cn.trim(),
        },
        content: buildProjectContentPayload(values.content),
        isPublished: values.isPublished,
        ...(cover.changed && cover.uploadToken
          ? { coverImageUploadToken: cover.uploadToken }
          : {}),
      });
    } catch (submissionError) {
      notifyError(getFriendlyProjectsError(submissionError));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="space-y-8" noValidate onSubmit={handleSubmit}>
      {description ? (
        <p className="text-sm leading-7 text-muted-foreground">{description}</p>
      ) : null}
      <section className="rounded-[2rem] border border-border/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(247,243,236,0.86))] p-5 shadow-[0_28px_80px_-56px_rgba(15,23,42,0.38)] md:p-7">
        <div className="mb-6 flex flex-col gap-2 border-b border-border/60 pb-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-semibold tracking-[0.2em] text-[--color-brand-muted] uppercase">
              {t("sections.metadata.eyebrow")}
            </p>
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-foreground">
                {t("sections.metadata.title")}
              </h2>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
                {t("sections.metadata.description")}
              </p>
            </div>
          </div>
          <div className="rounded-full border border-border/70 bg-white/80 px-4 py-2 text-xs font-medium text-muted-foreground shadow-sm">
            {mode === "create"
              ? t("sections.metadata.createChip")
              : t("sections.metadata.editChip")}
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <span className="text-sm font-medium text-foreground">
                {t("fields.gallery")}
              </span>
              <ProjectGallerySelect
                value={values.galleryId}
                onChange={(galleryId) => {
                  setValues((current) => ({ ...current, galleryId }));
                  setFieldErrors((current) => ({
                    ...current,
                    galleryId: undefined,
                  }));
                }}
                galleries={galleries}
                disabled={isSubmitting}
              />
              {fieldErrors.galleryId ? (
                <p className="text-sm text-red-600">{fieldErrors.galleryId}</p>
              ) : null}
            </div>
            <div className="md:col-span-2">
              <LocalizedNameEditor
                value={values.name}
                errors={{
                  en: fieldErrors.nameEn,
                  vi: fieldErrors.nameVi,
                  cn: fieldErrors.nameCn,
                }}
                sectionEyebrow={t("fields.namesEyebrow")}
                sectionTitle={t("fields.localizedTitle")}
                sectionDescription={t("fields.localizedDescription")}
                fieldLabel={t("fields.projectName")}
                placeholders={{
                  en: t("fields.placeholders.en"),
                  vi: t("fields.placeholders.vi"),
                  cn: t("fields.placeholders.cn"),
                }}
                onChange={(locale, nextValue) => {
                  setValues((current) => ({
                    ...current,
                    name: { ...current.name, [locale]: nextValue },
                  }));
                  setFieldErrors((current) => ({
                    ...current,
                    [errorKeyByLocale(locale)]: undefined,
                  }));
                }}
              />
            </div>
            <label className="space-y-2 md:col-span-2">
              <span className="text-sm font-medium text-foreground">
                {t("fields.publishingState")}
              </span>
              <AppSelect
                value={String(values.isPublished)}
                onChange={(nextValue) =>
                  setValues((current) => ({
                    ...current,
                    isPublished: nextValue === "true",
                  }))
                }
                options={[
                  {
                    value: "false",
                    label: t("fields.publishOptions.draft.label"),
                    description: t("fields.publishOptions.draft.description"),
                  },
                  {
                    value: "true",
                    label: t("fields.publishOptions.published.label"),
                    description: t("fields.publishOptions.published.description"),
                  },
                ]}
              />
            </label>
          </div>

          <div className="rounded-[1.75rem] border border-border/70 bg-white/72 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.78)] md:p-5">
            <div className="mb-4 space-y-1">
              <p className="text-sm font-medium text-foreground">{t("fields.cover")}</p>
              <p className="text-sm leading-6 text-muted-foreground">
                {mode === "create"
                  ? t("fields.coverCreateHint")
                  : t("fields.coverEditHint")}
              </p>
            </div>
            <ProjectCoverField
              previewUrl={cover.previewUrl}
              title={cover.title}
              meta={cover.meta}
              required={mode === "create"}
              isUploading={isUploadingCover}
              error={fieldErrors.cover}
              onSelectFile={(file) => {
                void handleCoverUpload(file);
              }}
              onRemove={() => {
                if (existingCoverImage) {
                  setCover({
                    previewUrl: existingCoverImage.url,
                    title: existingCoverImage.originalName,
                    meta: getCoverMeta(existingCoverImage),
                    existingCoverImage,
                    changed: false,
                  });
                  return;
                }

                setCover(DEFAULT_COVER_STATE);
              }}
            />
          </div>
        </div>
      </section>

      <section className="space-y-5 rounded-[2rem] border border-border/70 bg-white p-5 shadow-sm md:p-7">
        <div className="flex flex-col gap-2 pb-1 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-semibold tracking-[0.2em] text-[--color-brand-muted] uppercase">
              {t("sections.story.eyebrow")}
            </p>
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-foreground">
                {t("sections.story.title")}
              </h2>
              <p className="mt-1 max-w-3xl text-sm leading-6 text-muted-foreground">
                {t("sections.story.description")}
              </p>
            </div>
          </div>
          <div className="rounded-full border border-border/70 bg-white/80 px-4 py-2 text-xs font-medium text-muted-foreground shadow-sm">
            {t("sections.story.chip")}
          </div>
        </div>

        <ProjectEditor
          value={values.content}
          onChange={(content) => {
            setValues((current) => ({ ...current, content }));
            setFieldErrors((current) => ({ ...current, content: undefined }));
          }}
          uploadImage={(file) => uploadProjectFile(file, "project-content")}
        />
        {fieldErrors.content ? (
          <p className="text-sm text-red-600">{fieldErrors.content}</p>
        ) : null}
      </section>
      <div className="flex justify-end pt-2">
        <Button
          type="submit"
          size="lg"
          className="min-w-44 rounded-full"
          disabled={isSubmitting || isUploadingCover}
        >
          {isSubmitting ? t("actions.saving") : submitLabel}
        </Button>
      </div>
    </form>
  );
}

export function getProjectFormInitialValues(project: {
  gallery?: { id: string } | null;
  name: { en: string; vi: string; cn: string };
  isPublished: boolean;
  content: OutputData;
}) {
  return {
    galleryId: project.gallery?.id ?? "",
    name: {
      en: project.name.en,
      vi: project.name.vi,
      cn: project.name.cn,
    },
    isPublished: project.isPublished,
    content: buildProjectEditorInitialContent(project.content),
  };
}
