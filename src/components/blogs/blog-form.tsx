"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, type FormEvent } from "react";
import type { OutputData } from "@editorjs/editorjs";

import { BlogCoverField } from "@/components/blogs/blog-cover-field";
import {
  buildBlogContentPayload,
  buildBlogEditorEmptyContent,
  buildBlogEditorInitialContent,
  getBlogEditorSubmitError,
} from "@/components/blogs/editor/blog-editor-adapter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AppSelect } from "@/components/ui/select";
import { requestUpload } from "@/features/files/api/request-upload";
import { uploadFileToStorage } from "@/features/files/api/upload-file-to-storage";
import type { RequestUploadResult } from "@/features/files/types/files.types";
import type { BlogMutationPayload } from "@/features/blogs/types/blogs-api.types";
import type { BlogFileRecord } from "@/features/blogs/types/blogs.types";
import { getFriendlyBlogsError } from "@/features/blogs/utils/blogs-errors";
import { notifyError } from "@/lib/toast";

const BlogEditor = dynamic(
  () => import("@/components/blogs/editor/blog-editor").then((module) => module.BlogEditor),
  {
    ssr: false,
    loading: () => (
      <div className="rounded-2xl border border-border/70 bg-white p-6 shadow-sm">
        <div className="flex min-h-[560px] items-center justify-center rounded-xl border border-dashed border-border/60 bg-white">
          <p className="text-xs font-semibold tracking-[0.18em] text-[--color-brand-muted] uppercase">
            Loading editor
          </p>
        </div>
      </div>
    ),
  },
);

type BlogFormValues = {
  name: string;
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
  const [values, setValues] = useState<BlogFormValues>({
    name: initialValues?.name ?? "",
    isPinned: initialValues?.isPinned ?? false,
    isPublished: initialValues?.isPublished ?? false,
    content: buildBlogEditorInitialContent(initialValues?.content ?? buildBlogEditorEmptyContent()),
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
    name?: string;
    cover?: string;
    content?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);

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

  async function uploadBlogFile(file: File, purpose: "blog-cover" | "blog-content") {
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
      setFieldErrors((current) => ({
        ...current,
        cover: "The cover image could not be uploaded. Please try again.",
      }));
    } finally {
      setIsUploadingCover(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextFieldErrors: typeof fieldErrors = {};

    if (!values.name.trim()) {
      nextFieldErrors.name = "Blog title is required.";
    }

    if (mode === "create" && !cover.uploadToken) {
      nextFieldErrors.cover = "Upload a blog cover before saving.";
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
        name: values.name.trim(),
        content: buildBlogContentPayload(values.content),
        isPinned: values.isPinned,
        isPublished: values.isPublished,
        ...(cover.changed && cover.uploadToken ? { coverImageUploadToken: cover.uploadToken } : {}),
      });
    } catch (submissionError) {
      notifyError(getFriendlyBlogsError(submissionError));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="space-y-8" noValidate onSubmit={handleSubmit}>
      {description ? <p className="text-sm leading-7 text-muted-foreground">{description}</p> : null}

      <section className="rounded-[2rem] border border-border/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(247,243,236,0.86))] p-5 shadow-[0_28px_80px_-56px_rgba(15,23,42,0.38)] md:p-7">
        <div className="mb-6 flex flex-col gap-2 border-b border-border/60 pb-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-semibold tracking-[0.2em] text-[--color-brand-muted] uppercase">
              Blog metadata
            </p>
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-foreground">
                Core details and cover
              </h2>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
                Keep the journal record clean and easy to scan before moving into the writing workspace.
              </p>
            </div>
          </div>
          <div className="rounded-full border border-border/70 bg-white/80 px-4 py-2 text-xs font-medium text-muted-foreground shadow-sm">
            {mode === "create"
              ? "Create keeps the backend payload intact."
              : "Edit keeps the current blog semantics intact."}
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
          <div className="grid gap-5 md:grid-cols-2">
            <label className="space-y-2 md:col-span-2">
              <span className="text-sm font-medium text-foreground">Blog title</span>
              <Input
                value={values.name}
                onChange={(event) => {
                  setValues((current) => ({ ...current, name: event.target.value }));
                  setFieldErrors((current) => ({ ...current, name: undefined }));
                }}
                placeholder="Studio notes from a mountain wedding"
                aria-invalid={Boolean(fieldErrors.name)}
              />
              {fieldErrors.name ? <p className="text-sm text-red-600">{fieldErrors.name}</p> : null}
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-foreground">Publishing state</span>
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
                    label: "Draft",
                    description: "Visible only in admin until you publish it",
                  },
                  {
                    value: "true",
                    label: "Published",
                    description: "Ready for published blog surfaces and editorial promotion",
                  },
                ]}
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-foreground">Pinned state</span>
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
                    label: "Standard placement",
                    description: "Ordered naturally by the published timeline",
                  },
                  {
                    value: "true",
                    label: "Pinned feature",
                    description: "Floats to the top of public blog collections",
                  },
                ]}
              />
            </label>
          </div>

          <div className="rounded-[1.75rem] border border-border/70 bg-white/72 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.78)] md:p-5">
            <div className="mb-4 space-y-1">
              <p className="text-sm font-medium text-foreground">Cover image</p>
              <p className="text-sm leading-6 text-muted-foreground">
                {mode === "create"
                  ? "Upload the lead image before saving. Replacements still use the same upload-token flow."
                  : "Keep the current cover or replace it without changing the existing update behavior."}
              </p>
            </div>
            <BlogCoverField
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
              Blog content
            </p>
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-foreground">
                Build the full editorial entry
              </h2>
              <p className="mt-1 max-w-3xl text-sm leading-6 text-muted-foreground">
                Add text, YouTube embeds, and media layout blocks. New images still upload first and submit as upload tokens.
              </p>
            </div>
          </div>
          <div className="rounded-full border border-border/70 bg-white/80 px-4 py-2 text-xs font-medium text-muted-foreground shadow-sm">
            Full-width editor for writing, layout, and image sequencing.
          </div>
        </div>

        <BlogEditor
          value={values.content}
          onChange={(content) => {
            setValues((current) => ({ ...current, content }));
            setFieldErrors((current) => ({ ...current, content: undefined }));
          }}
          uploadImage={(file) => uploadBlogFile(file, "blog-content")}
        />
        {fieldErrors.content ? <p className="text-sm text-red-600">{fieldErrors.content}</p> : null}
      </section>

      <div className="flex justify-end pt-2">
        <Button type="submit" size="lg" className="min-w-44 rounded-full" disabled={isSubmitting || isUploadingCover}>
          {isSubmitting ? "Saving..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}

export function getBlogFormInitialValues(blog: {
  name: string;
  isPinned: boolean;
  isPublished: boolean;
  content: OutputData;
}) {
  return {
    name: blog.name,
    isPinned: blog.isPinned,
    isPublished: blog.isPublished,
    content: buildBlogEditorInitialContent(blog.content),
  };
}
