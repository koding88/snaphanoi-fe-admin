import type { OutputData } from "@editorjs/editorjs";
import {
  createEmptyProjectContent,
  getProjectContentSubmitError,
  normalizeProjectContent,
  serializeProjectContent,
} from "@/features/projects/utils/project-content";

export function buildProjectEditorInitialContent(content?: OutputData | null) {
  return normalizeProjectContent(content);
}

export function buildProjectEditorEmptyContent() {
  return createEmptyProjectContent();
}

export function buildProjectContentPayload(content: OutputData) {
  return serializeProjectContent(content);
}

export function getProjectEditorSubmitError(content: OutputData) {
  return getProjectContentSubmitError(content);
}
