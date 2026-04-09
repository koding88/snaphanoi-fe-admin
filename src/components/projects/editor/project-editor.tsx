"use client";

import { useEffect, useRef, useState } from "react";
import { useEffectEvent } from "react";
import type EditorJS from "@editorjs/editorjs";
import type { OutputData } from "@editorjs/editorjs";

import type { ProjectEditorImageUploader } from "@/components/projects/editor/project-editor.types";
import styles from "@/components/projects/editor/project-editor.module.css";
import { buildProjectEditorInitialContent } from "@/components/projects/editor/project-editor-adapter";

function createProjectYouTubeEmbedTool(EmbedBase: new (...args: unknown[]) => {
  render(): HTMLElement;
  save(block: HTMLElement): {
    service: string;
    source: string;
    embed: string;
    width?: number;
    height?: number;
    caption?: string;
  };
}) {
  return class ProjectYouTubeEmbedTool extends EmbedBase {
    static get toolbox() {
      return {
        title: "YouTube",
        icon: `<svg width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M21.8 8.001a2.75 2.75 0 0 0-1.94-1.945C18.14 5.6 12 5.6 12 5.6s-6.14 0-7.86.456A2.75 2.75 0 0 0 2.2 8.001 28.27 28.27 0 0 0 1.75 12c0 1.35.15 2.686.45 3.999a2.75 2.75 0 0 0 1.94 1.945C5.86 18.4 12 18.4 12 18.4s6.14 0 7.86-.456a2.75 2.75 0 0 0 1.94-1.945c.3-1.313.45-2.649.45-3.999 0-1.35-.15-2.686-.45-3.999ZM10.1 14.9V9.1L15.2 12l-5.1 2.9Z"/></svg>`,
      };
    }

    render() {
      const element = super.render();
      const caption = element.querySelector(".embed-tool__caption");
      caption?.remove();
      return element;
    }

    save(block: HTMLElement) {
      const data = super.save(block);

      return {
        ...data,
        caption: "",
      };
    }
  };
}

function destroyEditor(instance: EditorJS | null) {
  if (!instance) {
    return;
  }

  try {
    instance.destroy?.();
  } catch {
    // EditorJS may already be torn down.
  }
}

type ProjectEditorProps = {
  value: OutputData;
  onChange: (value: OutputData) => void;
  uploadImage: ProjectEditorImageUploader;
};

export function ProjectEditor({ value, onChange, uploadImage }: ProjectEditorProps) {
  const holderRef = useRef<HTMLDivElement | null>(null);
  const editorRef = useRef<EditorJS | null>(null);
  const latestValueRef = useRef<OutputData>(buildProjectEditorInitialContent(value));
  const latestUploadImageRef = useRef(uploadImage);
  const [editorError, setEditorError] = useState<string | null>(null);
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const handleEditorChange = useEffectEvent((nextData: OutputData) => {
    onChange(nextData);
  });

  useEffect(() => {
    latestValueRef.current = buildProjectEditorInitialContent(value);
  }, [value]);

  useEffect(() => {
    latestUploadImageRef.current = uploadImage;
  }, [uploadImage]);

  useEffect(() => {
    if (!holderRef.current) {
      return;
    }

    let detached = false;
    let activeEditor: EditorJS | null = null;

    async function mountEditor() {
      setIsBootstrapping(true);
      holderRef.current!.innerHTML = "";

      try {
        const [
          { default: EditorJSClass },
          { default: Header },
          { default: List },
          { default: Embed },
          { default: ProjectMediaLayoutTool },
          inlineToolsModule,
        ] = await Promise.all([
          import("@editorjs/editorjs"),
          import("@editorjs/header"),
          import("@editorjs/list"),
          import("@editorjs/embed"),
          import("@/components/projects/editor/project-media-layout-tool"),
          import("@/components/projects/editor/project-text-color-inline-tool"),
        ]);

        if (detached || !holderRef.current) {
          return;
        }

        const ProjectYouTubeEmbedTool = createProjectYouTubeEmbedTool(Embed);

        const editor = new EditorJSClass({
          holder: holderRef.current,
          data: latestValueRef.current,
          autofocus: false,
          tools: {
            header: Header as unknown as EditorJS.ToolConstructable,
            list: List as unknown as EditorJS.ToolConstructable,
            textColor: inlineToolsModule.default as unknown as EditorJS.ToolConstructable,
            highlight: inlineToolsModule.ProjectHighlightInlineTool as unknown as EditorJS.ToolConstructable,
            youtube: {
              class: ProjectYouTubeEmbedTool as unknown as EditorJS.ToolConstructable,
              config: {
                services: {
                  youtube: true,
                },
              },
            },
            mediaLayout: {
              class: ProjectMediaLayoutTool as unknown as EditorJS.ToolConstructable,
              config: {
                uploadImage: (file: File) => latestUploadImageRef.current(file),
              },
            },
          },
          onChange: async () => {
            if (!activeEditor) {
              return;
            }

            const nextData = await activeEditor.save();
            latestValueRef.current = nextData;
            handleEditorChange(nextData);
          },
        });

        activeEditor = editor;

        await editor.isReady;

        if (detached) {
          destroyEditor(editor);
          return;
        }

        setEditorError(null);
        setIsBootstrapping(false);
        editorRef.current = editor;
      } catch (error) {
        if (activeEditor) {
          destroyEditor(activeEditor);
        }

        editorRef.current = null;

        if (!detached) {
          setIsBootstrapping(false);
          setEditorError(
            error instanceof Error && error.message
              ? `The content editor could not be started. ${error.message}`
              : "The content editor could not be started. Refresh and try again.",
          );
        }

        return;
      }
    }

    void mountEditor();

    return () => {
      detached = true;
      destroyEditor(activeEditor);
      editorRef.current = null;
    };
  }, []);

  return (
    <div className="space-y-4">
      {editorError ? (
        <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {editorError}
        </p>
      ) : null}
      <div className="relative rounded-[28px] border border-border/80 bg-gradient-to-b from-white to-slate-50 p-3 shadow-inner shadow-slate-200/60 sm:p-4 lg:p-5">
        <div ref={holderRef} className={`${styles.editorCanvas} min-h-[560px]`} />
        {isBootstrapping ? (
          <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-center px-6 pt-6">
            <div className="rounded-full border border-border/80 bg-white/88 px-4 py-2 text-xs font-semibold tracking-[0.18em] text-[--color-brand-muted] uppercase shadow-soft">
              Loading editor
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
