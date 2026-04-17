import { createElement, type ComponentProps } from "react";
import { createRoot, type Root } from "react-dom/client";
import GridLayout, {
  WidthProvider,
  type Layout,
  type LayoutItem,
} from "react-grid-layout/legacy";

import type {
  ProjectEditorImageUploader,
  ProjectEditorMediaItem,
  ProjectEditorMediaLayoutData,
  ProjectEditorUploadResult,
} from "@/components/projects/editor/project-editor.types";
import { ProjectMediaTile } from "@/components/projects/editor/project-media-tile";

const EditableGrid = WidthProvider(GridLayout);

type ProjectMediaLayoutToolConfig = {
  onChange?: (data: ProjectEditorMediaLayoutData) => void;
  uploadImage: ProjectEditorImageUploader;
};

type PendingMediaItem = {
  id: string;
  file: File;
  url: string;
  state: "uploading" | "error";
  errorMessage?: string;
};

type VisualMediaEntry = {
  id: string;
  item: {
    id: string;
    kind: "image" | "youtube";
    url: string;
  };
  status: "ready" | "uploading" | "error";
  errorMessage?: string;
};

const ensureData = (
  data?: Partial<ProjectEditorMediaLayoutData>,
): ProjectEditorMediaLayoutData => ({
  items: Array.isArray(data?.items)
    ? (data.items as ProjectEditorMediaItem[])
    : [],
  layout: Array.isArray(data?.layout) ? (data.layout as Layout) : [],
});

const buildSafeLayout = (
  items: Array<{ id: string }>,
  layout: Layout,
): Layout => {
  const ids = new Set(items.map((item) => item.id));
  return layout.filter((entry) => ids.has(entry.i));
};

const cloneLayout = (layout: Layout): Layout =>
  layout.map((entry) => ({ ...entry }));

const getImageDimensions = (
  url: string,
): Promise<{ width: number; height: number }> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      resolve({
        width: image.naturalWidth || image.width,
        height: image.naturalHeight || image.height,
      });
    };
    image.onerror = () => reject(new Error("Cannot read image dimensions."));
    image.src = url;
  });

const pickDefaultLayout = async (
  id: string,
  url: string,
): Promise<LayoutItem> => {
  try {
    const { width, height } = await getImageDimensions(url);
    const ratio = width / Math.max(height, 1);

    if (ratio >= 1.45) {
      return { i: id, x: 0, y: Infinity, w: 7, h: 6 };
    }

    if (ratio <= 0.82) {
      return { i: id, x: 0, y: Infinity, w: 5, h: 10 };
    }

    return { i: id, x: 0, y: Infinity, w: 6, h: 8 };
  } catch {
    return { i: id, x: 0, y: Infinity, w: 6, h: 8 };
  }
};

function buildUploadedImageItem(
  id: string,
  uploaded: ProjectEditorUploadResult,
): ProjectEditorMediaItem {
  return {
    id,
    kind: "image",
    uploadToken: uploaded.uploadToken,
    url: uploaded.url,
  };
}

class ProjectMediaLayoutTool {
  private data: ProjectEditorMediaLayoutData;
  private config: ProjectMediaLayoutToolConfig;
  private pendingItems: PendingMediaItem[] = [];
  private pendingLayout: Layout = [];
  private container: HTMLDivElement | null = null;
  private fileEl: HTMLInputElement | null = null;
  private messageEl: HTMLDivElement | null = null;
  private reactMountEl: HTMLDivElement | null = null;
  private reactRoot: Root | null = null;
  private dragging = false;
  private draftLayout: Layout | null = null;

  static get toolbox() {
    return {
      title: "Media Layout",
      icon: `<svg width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M3 3h18v18H3V3m2 2v6h6V5H5m8 0v6h6V5h-6M5 13v6h6v-6H5m8 6h6v-6h-6v6Z"/></svg>`,
    };
  }

  constructor({
    data,
    config,
  }: {
    data?: Partial<ProjectEditorMediaLayoutData>;
    config: ProjectMediaLayoutToolConfig;
  }) {
    this.data = ensureData(data);
    this.config = config;
  }

  render() {
    this.container = document.createElement("div");
    this.container.className = "ce-media-layout";

    this.fileEl = document.createElement("input");
    this.fileEl.type = "file";
    this.fileEl.accept = "image/*";
    this.fileEl.multiple = true;
    this.fileEl.className = "ce-media-layout__file";
    this.fileEl.hidden = true;
    this.fileEl.onchange = () => {
      void this.handleUpload(Array.from(this.fileEl?.files ?? []));
    };

    this.messageEl = document.createElement("div");
    this.messageEl.className = "ce-media-layout__message";

    this.reactMountEl = document.createElement("div");
    this.reactMountEl.className = "ce-media-layout__react";

    this.container.appendChild(this.fileEl);
    this.container.appendChild(this.messageEl);
    this.container.appendChild(this.reactMountEl);
    this.renderReact();
    return this.container;
  }

  private setMessage(text: string) {
    if (this.messageEl) {
      this.messageEl.textContent = text;
    }
  }

  private publishChange() {
    this.data.layout = buildSafeLayout(this.data.items, this.data.layout);
    this.draftLayout = null;
    this.config.onChange?.(this.data);
  }

  private async createLayoutItem(id: string, url: string) {
    return pickDefaultLayout(id, url);
  }

  private async handleUpload(files: File[]) {
    if (!files.length) {
      return;
    }

    this.setMessage(
      files.length === 1
        ? "Uploading image..."
        : `Uploading ${files.length} images...`,
    );

    for (const file of files) {
      const id = `media-${Date.now()}-${Math.floor(Math.random() * 99999)}`;
      const objectUrl = URL.createObjectURL(file);
      const layoutItem = await this.createLayoutItem(id, objectUrl);
      const pendingItem: PendingMediaItem = {
        id,
        file,
        url: objectUrl,
        state: "uploading",
      };

      this.pendingItems = [...this.pendingItems, pendingItem];
      this.pendingLayout = [...this.pendingLayout, layoutItem];
      this.renderReact();

      try {
        const uploaded = await this.config.uploadImage(file);
        this.pendingItems = this.pendingItems.filter((item) => item.id !== id);
        this.pendingLayout = this.pendingLayout.filter(
          (entry) => entry.i !== id,
        );
        this.data.items = [
          ...this.data.items,
          buildUploadedImageItem(id, uploaded),
        ];
        this.data.layout = [...this.data.layout, layoutItem];
        this.publishChange();
      } catch (error) {
        this.pendingItems = this.pendingItems.map((item) =>
          item.id === id
            ? {
                ...item,
                state: "error",
                errorMessage:
                  error instanceof Error
                    ? error.message
                    : "Image upload failed.",
              }
            : item,
        );
      } finally {
        this.renderReact();
      }
    }

    this.setMessage("Media layout is ready.");

    if (this.fileEl) {
      this.fileEl.value = "";
    }
  }

  private remove(id: string) {
    const pending = this.pendingItems.find((item) => item.id === id);

    if (pending) {
      URL.revokeObjectURL(pending.url);
      this.pendingItems = this.pendingItems.filter((item) => item.id !== id);
      this.pendingLayout = this.pendingLayout.filter((entry) => entry.i !== id);
      this.renderReact();
      return;
    }

    this.data.items = this.data.items.filter((item) => item.id !== id);
    this.data.layout = this.data.layout.filter((entry) => entry.i !== id);
    this.renderReact();
    this.publishChange();
  }

  private retry(id: string) {
    const pending = this.pendingItems.find((item) => item.id === id);
    if (!pending) {
      return;
    }

    this.pendingItems = this.pendingItems.filter((item) => item.id !== id);
    this.pendingLayout = this.pendingLayout.filter((entry) => entry.i !== id);
    void this.handleUpload([pending.file]);
  }

  private buildVisualItems(): VisualMediaEntry[] {
    return [
      ...this.data.items.map((item) => ({
        id: item.id,
        item: {
          id: item.id,
          kind: item.kind,
          url: item.url,
        },
        status: "ready" as const,
      })),
      ...this.pendingItems.map((item) => ({
        id: item.id,
        item: {
          id: item.id,
          kind: "image" as const,
          url: item.url,
        },
        status: item.state,
        errorMessage: item.errorMessage,
      })),
    ];
  }

  private renderGridItem(entry: VisualMediaEntry) {
    return createElement(
      "div",
      { key: entry.id, className: "ce-grid-item" },
      createElement(ProjectMediaTile, {
        item: entry.item,
        className: "ce-grid-media-frame",
        mediaClassName: "ce-grid-media",
      }),
      createElement(
        "div",
        { className: "ce-grid-overlay" },
        createElement(
          "button",
          {
            type: "button",
            className: "ce-grid-remove",
            onClick: () => this.remove(entry.id),
          },
          "×",
        ),
        entry.status === "uploading"
          ? createElement(
              "div",
              { className: "ce-grid-status ce-grid-status--loading" },
              createElement("span", { className: "ce-grid-spinner" }),
              createElement("span", null, "Uploading"),
            )
          : null,
        entry.status === "error"
          ? createElement(
              "div",
              { className: "ce-grid-status ce-grid-status--error" },
              createElement(
                "span",
                null,
                entry.errorMessage ?? "Upload failed",
              ),
              createElement(
                "button",
                {
                  type: "button",
                  className: "ce-grid-retry",
                  onClick: () => this.retry(entry.id),
                },
                "Retry",
              ),
            )
          : null,
      ),
    );
  }

  private renderReact() {
    if (!this.reactMountEl) {
      return;
    }

    if (!this.reactRoot) {
      this.reactRoot = createRoot(this.reactMountEl);
    }

    const visualItems = this.buildVisualItems();
    const visualLayout = [
      ...(this.draftLayout ?? this.data.layout),
      ...this.pendingLayout,
    ];

    const uploadBox = createElement(
      "button",
      {
        type: "button",
        className: `ce-dropzone ${this.dragging ? "ce-dropzone--active" : ""}`,
        onClick: () => this.fileEl?.click(),
        onDragOver: (event: unknown) => {
          const e = event as DragEvent;
          e.preventDefault();
          if (!this.dragging) {
            this.dragging = true;
            this.renderReact();
          }
        },
        onDragLeave: (event: unknown) => {
          const e = event as DragEvent;
          e.preventDefault();
          if (this.dragging) {
            this.dragging = false;
            this.renderReact();
          }
        },
        onDrop: (event: unknown) => {
          const e = event as DragEvent;
          e.preventDefault();
          this.dragging = false;
          void this.handleUpload(Array.from(e.dataTransfer?.files ?? []));
          this.renderReact();
        },
      },
      createElement(
        "span",
        { className: "ce-dropzone__title" },
        "Add project media",
      ),
      createElement(
        "span",
        { className: "ce-dropzone__sub" },
        "Upload to storage first, then keep tokens in the editor document.",
      ),
    );

    const gridChildren = visualItems.map((entry) => this.renderGridItem(entry));

    const gridProps = {
      layout: visualLayout,
      cols: 12,
      rowHeight: 26,
      margin: [12, 12] as [number, number],
      containerPadding: [0, 0] as [number, number],
      compactType: "vertical" as const,
      preventCollision: false,
      onLayoutChange: (nextLayout: Layout) => {
        this.draftLayout = nextLayout.filter((entry) =>
          this.data.items.some((item) => item.id === entry.i),
        );
        this.pendingLayout = nextLayout.filter((entry) =>
          this.pendingItems.some((item) => item.id === entry.i),
        );
      },
      onDragStart: () => {
        this.draftLayout = cloneLayout(this.data.layout);
      },
      onDragStop: (nextLayout: Layout) => {
        this.data.layout = nextLayout.filter((entry) =>
          this.data.items.some((item) => item.id === entry.i),
        );
        this.pendingLayout = nextLayout.filter((entry) =>
          this.pendingItems.some((item) => item.id === entry.i),
        );
        this.publishChange();
        this.renderReact();
      },
      onResizeStart: () => {
        this.draftLayout = cloneLayout(this.data.layout);
      },
      onResizeStop: (nextLayout: Layout) => {
        this.data.layout = nextLayout.filter((entry) =>
          this.data.items.some((item) => item.id === entry.i),
        );
        this.pendingLayout = nextLayout.filter((entry) =>
          this.pendingItems.some((item) => item.id === entry.i),
        );
        this.publishChange();
        this.renderReact();
      },
      draggableCancel: ".ce-grid-remove,.ce-grid-retry",
      resizeHandles: ["nw", "ne", "sw", "se"] as Array<
        "nw" | "ne" | "sw" | "se"
      >,
      children: gridChildren,
    } as ComponentProps<typeof EditableGrid>;

    this.reactRoot.render(
      createElement(
        "div",
        { className: "ce-media-layout__content" },
        uploadBox,
        createElement(EditableGrid, gridProps),
      ),
    );
  }

  save(): ProjectEditorMediaLayoutData {
    return {
      items: this.data.items,
      layout: buildSafeLayout(this.data.items, this.data.layout),
    };
  }

  destroy() {
    this.pendingItems.forEach((item) => URL.revokeObjectURL(item.url));
    const root = this.reactRoot;
    this.reactRoot = null;

    if (root) {
      setTimeout(() => {
        root.unmount();
      }, 0);
    }
  }
}

export default ProjectMediaLayoutTool;
