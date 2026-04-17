"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import type { OutputData } from "@editorjs/editorjs";

import { BlogCoverField } from "@/components/blogs/blog-cover-field";
import { BlogLocaleSwitch } from "@/components/blogs/blog-locale-switch";
import {
  buildBlogContentPayload,
  buildBlogEditorEmptyContent,
  buildBlogEditorInitialContent,
  getBlogEditorSubmitError,
  mergeBlogEditorContent,
} from "@/components/blogs/editor/blog-editor-adapter";
import { LocalizedNameEditor } from "@/components/shared/localized-name-editor";
import { Button } from "@/components/ui/button";
import { AppSelect } from "@/components/ui/select";
import { requestUpload } from "@/features/files/api/request-upload";
import { uploadFileToStorage } from "@/features/files/api/upload-file-to-storage";
import type { RequestUploadResult } from "@/features/files/types/files.types";
import type { BlogMutationPayload } from "@/features/blogs/types/blogs-api.types";
import type { BlogFileRecord } from "@/features/blogs/types/blogs.types";
import { normalizeBlogContent } from "@/features/blogs/utils/blog-content";
import {
  createEmptyBlogLocalizedText,
  type BlogLocale,
  type BlogLocalizedText,
} from "@/features/blogs/utils/blog-localization";
import { getFriendlyBlogsError } from "@/features/blogs/utils/blogs-errors";
import { notifyError } from "@/lib/toast";

const BlogEditor = dynamic(
  () =>
    import("@/components/blogs/editor/blog-editor").then(
      (module) => module.BlogEditor,
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

type BlogFormValues = {
  name: BlogLocalizedText;
  isPinned: boolean;
  isPublished: boolean;
  content: OutputData;
};

type BlogFormProps = {
  mode: "create" | "edit";
  initialValues?: Partial<BlogFormValues>;
  existingCoverImage?: BlogFileRecord | null;
  submitLabel: string;
  description?: string;
  onSubmit: (payload: BlogMutationPayload) => Promise<void>;
};

type CoverUploadState = {
  previewUrl: string | null;
  title: string | null;
  meta: string | null;
  uploadToken?: string;
  existingCoverImage?: BlogFileRecord | null;
  changed: boolean;
};

const DEFAULT_COVER_STATE: CoverUploadState = {
  previewUrl: null,
  title: null,
  meta: null,
  changed: false,
};

function getCoverMeta(file: { mimeType: string; size: number }) {
  return `${file.mimeType} · ${Math.max(1, Math.round(file.size / 1024))} KB`;
}

export function BlogForm({
  mode,
  initialValues,
  existingCoverImage = null,
  submitLabel,
  description,
  onSubmit,
}: BlogFormProps) {
  const t = useTranslations("blogs.form");
  const [values, setValues] = useState<BlogFormValues>({
    name: initialValues?.name ?? createEmptyBlogLocalizedText(),
    isPinned: initialValues?.isPinned ?? false,
    isPublished: initialValues?.isPublished ?? false,
    content: normalizeBlogContent(
      initialValues?.content ?? buildBlogEditorEmptyContent(),
    ),
  });
  const [activeContentLocale, setActiveContentLocale] =
    useState<BlogLocale>("en");
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
    nameEn?: string;
    nameVi?: string;
    nameCn?: string;
    cover?: string;
    content?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [isCoverPreviewPending, setIsCoverPreviewPending] = useState(false);
  const isCoverBusy = isUploadingCover || isCoverPreviewPending;

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
    setIsCoverPreviewPending(false);
  }, [existingCoverImage]);

  async function uploadBlogFile(
    file: File,
    purpose: "blog-cover" | "blog-content",
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
    setIsCoverPreviewPending(true);
    setFieldErrors((current) => ({ ...current, cover: undefined }));

    try {
      const uploaded = await uploadBlogFile(file, "blog-cover");
      setCover({
        previewUrl: uploaded.url,
        title: uploaded.originalName,
        meta: `${uploaded.mimeType} · ${Math.max(1, Math.round(uploaded.size / 1024))} KB`,
        uploadToken: uploaded.uploadToken,
        existingCoverImage,
        changed: true,
      });
    } catch (error) {
      notifyError(getFriendlyBlogsError(error));
      setIsCoverPreviewPending(false);
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

    if (!values.name.en.trim())
      nextFieldErrors.nameEn = t("errors.titleRequired");
    if (!values.name.vi.trim())
      nextFieldErrors.nameVi = t("errors.titleRequired");
    if (!values.name.cn.trim())
      nextFieldErrors.nameCn = t("errors.titleRequired");

    if (mode === "create" && !cover.uploadToken) {
      nextFieldErrors.cover = t("errors.coverRequired");
    }

    const contentError = getBlogEditorSubmitError(values.content);
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
        name: {
          en: values.name.en.trim(),
          vi: values.name.vi.trim(),
          cn: values.name.cn.trim(),
        },
        content: buildBlogContentPayload(values.content),
        isPinned: values.isPinned,
        isPublished: values.isPublished,
        ...(cover.changed && cover.uploadToken
          ? { coverImageUploadToken: cover.uploadToken }
          : {}),
      });
    } catch (submissionError) {
      notifyError(getFriendlyBlogsError(submissionError));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="space-y-8" noValidate onSubmit={handleSubmit}>
      {description ? (
        <div className="rounded-[1.4rem] border border-border/70 bg-white/76 px-4 py-3 text-sm leading-6 text-foreground/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.74)]">
          {description}
        </div>
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
              <p className="mt-1 max-w-2xl text-sm leading-6 text-foreground/75">
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

        <div className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.08fr)_minmax(300px,0.92fr)] lg:items-start">
            <div className="space-y-5">
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
                fieldLabel={t("fields.title")}
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
                    ...(locale === "en" ? { nameEn: undefined } : {}),
                    ...(locale === "vi" ? { nameVi: undefined } : {}),
                    ...(locale === "cn" ? { nameCn: undefined } : {}),
                  }));
                }}
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-2 rounded-[1.35rem] border border-border/70 bg-white/78 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.78)]">
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
                        description: t(
                          "fields.publishOptions.draft.description",
                        ),
                      },
                      {
                        value: "true",
                        label: t("fields.publishOptions.published.label"),
                        description: t(
                          "fields.publishOptions.published.description",
                        ),
                      },
                    ]}
                  />
                </label>
                <label className="space-y-2 rounded-[1.35rem] border border-border/70 bg-white/78 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.78)]">
                  <span className="text-sm font-medium text-foreground">
                    {t("fields.pinnedState")}
                  </span>
                  <AppSelect
                    value={String(values.isPinned)}
                    onChange={(nextValue) =>
                      setValues((current) => ({
                        ...current,
                        isPinned: nextValue === "true",
                      }))
                    }
                    options={[
                      {
                        value: "false",
                        label: t("fields.pinOptions.standard.label"),
                        description: t(
                          "fields.pinOptions.standard.description",
                        ),
                      },
                      {
                        value: "true",
                        label: t("fields.pinOptions.pinned.label"),
                        description: t("fields.pinOptions.pinned.description"),
                      },
                    ]}
                  />
                </label>
              </div>
            </div>

            <div className="rounded-[1.55rem] border border-border/70 bg-white/78 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.78)] md:p-5">
              <div className="mb-4 space-y-1">
                <p className="text-sm font-semibold text-foreground">
                  {t("fields.cover")}
                </p>
                <p className="text-sm leading-6 text-foreground/75">
                  {mode === "create"
                    ? t("fields.coverCreateHint")
                    : t("fields.coverEditHint")}
                </p>
              </div>
              <BlogCoverField
                previewUrl={cover.previewUrl}
                title={cover.title}
                meta={cover.meta}
                required={mode === "create"}
                isUploading={isUploadingCover}
                isPreviewPending={isCoverPreviewPending}
                error={fieldErrors.cover}
                onSelectFile={(file) => {
                  void handleCoverUpload(file);
                }}
                onPreviewReady={() => {
                  setIsCoverPreviewPending(false);
                }}
                onPreviewError={() => {
                  setIsCoverPreviewPending(false);
                  setFieldErrors((current) => ({
                    ...current,
                    cover: t("errors.coverUploadFailed"),
                  }));
                }}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-5 rounded-[2rem] border border-border/70 bg-white p-5 shadow-sm md:p-7">
        <div className="flex flex-col gap-2 pb-1 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-semibold tracking-[0.2em] text-[--color-brand-muted] uppercase">
              {t("sections.content.eyebrow")}
            </p>
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-foreground">
                {t("sections.content.title")}
              </h2>
              <p className="mt-1 max-w-3xl text-sm leading-6 text-foreground/75">
                {t("sections.content.description")}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-full border border-border/70 bg-white/80 px-4 py-2 text-xs font-medium text-muted-foreground shadow-sm">
              {t("sections.content.chip")}
            </div>
            <BlogLocaleSwitch
              activeLocale={activeContentLocale}
              onChange={setActiveContentLocale}
              getStatus={(locale) => {
                const contentByLocale = buildBlogEditorInitialContent(
                  values.content,
                  locale,
                );
                const hasTextBlock = contentByLocale.blocks.some((block) => {
                  if (block.type === "header" || block.type === "paragraph") {
                    return (
                      String(
                        (block.data as { text?: string }).text ?? "",
                      ).trim().length > 0
                    );
                  }

                  if (block.type === "list") {
                    return (
                      JSON.stringify(
                        (block.data as { items?: unknown[] }).items ?? [],
                      ).trim().length > 2
                    );
                  }

                  return false;
                });

                return hasTextBlock ? "complete" : "incomplete";
              }}
            />
          </div>
        </div>

        <div className="rounded-[1.35rem] border border-border/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.86),rgba(249,245,238,0.92))] px-4 py-3 text-sm leading-6 text-muted-foreground">
          {t("sections.content.localeHint", {
            locale: activeContentLocale.toUpperCase(),
          })}
        </div>

        <BlogEditor
          key={activeContentLocale}
          value={buildBlogEditorInitialContent(
            values.content,
            activeContentLocale,
          )}
          onChange={(content) => {
            setValues((current) => ({
              ...current,
              content: mergeBlogEditorContent(
                current.content,
                content,
                activeContentLocale,
              ),
            }));
            setFieldErrors((current) => ({ ...current, content: undefined }));
          }}
          uploadImage={(file) => uploadBlogFile(file, "blog-content")}
        />
        {fieldErrors.content ? (
          <p className="text-sm text-red-600">{fieldErrors.content}</p>
        ) : null}
      </section>

      <div className="rounded-[1.4rem] border border-border/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(248,244,237,0.9))] p-4 shadow-[0_22px_48px_-40px_rgba(15,23,42,0.45)]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm leading-6 text-foreground/75">
            {isUploadingCover || isCoverPreviewPending
              ? t("actions.helperUploading")
              : mode === "create"
                ? t("actions.helperCreate")
                : t("actions.helperEdit")}
          </p>
          <Button
            type="submit"
            size="lg"
            className="w-full min-w-52 rounded-full sm:w-auto"
            disabled={isSubmitting || isCoverBusy}
          >
            {isSubmitting ? t("actions.saving") : submitLabel}
          </Button>
        </div>
      </div>
    </form>
  );
}

export function getBlogFormInitialValues(blog: {
  name: BlogLocalizedText;
  isPinned: boolean;
  isPublished: boolean;
  content: OutputData;
}) {
  return {
    name: blog.name,
    isPinned: blog.isPinned,
    isPublished: blog.isPublished,
    content: normalizeBlogContent(blog.content),
  };
}
