import type { API } from "@editorjs/editorjs";
import type { MenuConfig } from "@editorjs/editorjs/types/tools";
import type { PopoverItemHtmlParams } from "@editorjs/editorjs/types/utils/popover/popover-item";

type InlineToolConstructor = {
  api: API;
};

type ColorOption = {
  label: string;
  value: string;
};

type StyleMode = "color" | "backgroundColor";

const TEXT_COLOR_CLASS = "ce-inline-text-color";
const HIGHLIGHT_CLASS = "ce-inline-highlight";

const TEXT_COLORS: ColorOption[] = [
  { label: "Ink", value: "#171d28" },
  { label: "Bronze", value: "#9f6a34" },
  { label: "Cobalt", value: "#2555d9" },
  { label: "Forest", value: "#0f766e" },
  { label: "Crimson", value: "#be123c" },
];

const HIGHLIGHT_COLORS: ColorOption[] = [
  { label: "Gold wash", value: "#f8e7b0" },
  { label: "Blue wash", value: "#dbeafe" },
  { label: "Rose wash", value: "#ffe4e6" },
  { label: "Mint wash", value: "#d1fae5" },
  { label: "Stone wash", value: "#ece7e1" },
];

class BaseInlineColorTool {
  public static isInline = true;
  public static sanitize = {
    span: {
      class: true,
      style: true,
      "data-text-color": true,
      "data-highlight-color": true,
    },
  };

  protected api: API;
  protected mode: StyleMode;
  protected toolClass: string;
  protected title: string;
  protected icon: string;
  protected colors: ColorOption[];

  constructor({
    api,
    mode,
    toolClass,
    title,
    icon,
    colors,
  }: InlineToolConstructor & {
    mode: StyleMode;
    toolClass: string;
    title: string;
    icon: string;
    colors: ColorOption[];
  }) {
    this.api = api;
    this.mode = mode;
    this.toolClass = toolClass;
    this.title = title;
    this.icon = icon;
    this.colors = colors;
  }

  render(): MenuConfig {
    return {
      icon: this.icon,
      title: this.title,
      isActive: () => Boolean(this.findWrapper()),
      closeOnActivate: false,
      children: {
        items: [
          {
            type: "html",
            element: this.createPanel(),
          } as unknown as PopoverItemHtmlParams,
        ],
      },
    };
  }

  protected createPanel() {
    const panel = document.createElement("div");
    panel.className = "ce-inline-color-panel";
    panel.onmousedown = (event) => {
      event.preventDefault();
    };

    const title = document.createElement("div");
    title.className = "ce-inline-color-panel__title";
    title.textContent = this.title;

    const presets = document.createElement("div");
    presets.className = "ce-inline-color-panel__presets";

    this.colors.forEach((option) => {
      presets.appendChild(this.createSwatch(option));
    });

    const custom = document.createElement("div");
    custom.className = "ce-inline-color-panel__custom";

    const pickerLabel = document.createElement("label");
    pickerLabel.className = "ce-inline-color-panel__field";
    pickerLabel.textContent = "Custom color";

    const picker = document.createElement("input");
    picker.type = "color";
    picker.className = "ce-inline-color-panel__picker";
    picker.value = this.colors[0]?.value ?? "#000000";
    picker.oninput = () => {
      this.applyStyle(picker.value);
    };
    pickerLabel.appendChild(picker);
    custom.append(pickerLabel);
    panel.append(title, presets, custom);
    return panel;
  }

  protected createSwatch(option: ColorOption) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "ce-inline-color-panel__swatch";
    button.title = option.label;
    button.style.setProperty("--swatch-color", option.value);

    const dot = document.createElement("span");
    dot.className = "ce-inline-color-panel__swatch-dot";
    dot.style.setProperty("--swatch-color", option.value);

    const label = document.createElement("span");
    label.className = "ce-inline-color-panel__swatch-label";
    label.textContent = option.label;

    button.append(dot, label);
    button.onclick = (event) => {
      event.preventDefault();
      this.applyStyle(option.value);
    };
    return button;
  }

  protected applyStyle(value: string) {
    this.api.selection.restore();
    this.api.selection.removeFakeBackground();

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      return;
    }

    const range = selection.getRangeAt(0);
    if (range.collapsed) {
      return;
    }

    const parent = this.findWrapper();
    if (parent) {
      this.applyWrapperStyle(parent, value);
      return;
    }

    const wrapper = document.createElement("span");
    wrapper.className = this.toolClass;
    this.applyWrapperStyle(wrapper, value);
    wrapper.appendChild(range.extractContents());
    range.insertNode(wrapper);

    selection.removeAllRanges();
    const nextRange = document.createRange();
    nextRange.selectNodeContents(wrapper);
    selection.addRange(nextRange);
  }

  protected findWrapper() {
    return this.api.selection.findParentTag("SPAN", this.toolClass);
  }

  protected applyWrapperStyle(wrapper: HTMLElement, value: string) {
    if (this.mode === "color") {
      wrapper.dataset.textColor = value;
      wrapper.style.color = value;
      return;
    }

    wrapper.dataset.highlightColor = value;
    wrapper.style.backgroundColor = value;
    wrapper.style.borderRadius = "0.28em";
    wrapper.style.padding = "0.04em 0.08em";
    wrapper.style.boxDecorationBreak = "clone";
    wrapper.style.setProperty("-webkit-box-decoration-break", "clone");
  }
}

export default class ProjectTextColorInlineTool extends BaseInlineColorTool {
  constructor({ api }: InlineToolConstructor) {
    super({
      api,
      mode: "color",
      toolClass: TEXT_COLOR_CLASS,
      title: "Text color",
      icon: `<span style="font-weight:700;color:#9f6a34">A</span>`,
      colors: TEXT_COLORS,
    });
  }
}

export class ProjectHighlightInlineTool extends BaseInlineColorTool {
  constructor({ api }: InlineToolConstructor) {
    super({
      api,
      mode: "backgroundColor",
      toolClass: HIGHLIGHT_CLASS,
      title: "Highlight",
      icon: `<span style="font-weight:700;color:#171d28;background:#f8e7b0;border-radius:4px;padding:0 4px">A</span>`,
      colors: HIGHLIGHT_COLORS,
    });
  }
}
