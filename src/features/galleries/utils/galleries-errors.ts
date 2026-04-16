import { isApiError } from "@/lib/api/errors";

type ErrorMessageResolver = (params: {
  scope: string;
  code?: string | null;
  statusCode?: number;
  fallback: string;
}) => string;

const GALLERY_ERROR_MESSAGES: Record<string, string> = {
  GALLERY_NOT_FOUND: "The requested gallery could not be found.",
  GALLERY_NAME_EN_ALREADY_EXISTS: "That English gallery name already exists.",
  GALLERY_NAME_VI_ALREADY_EXISTS: "That Vietnamese gallery name already exists.",
  GALLERY_NAME_CN_ALREADY_EXISTS: "That Chinese gallery name already exists.",
  GALLERY_ALREADY_DELETED: "This gallery is already archived.",
  GALLERY_NOT_DELETED: "This gallery is not archived, so it cannot be restored.",
  Forbidden: "You do not have permission to perform this action.",
  Unauthorized: "Your session is no longer valid. Please sign in again.",
};

export function getFriendlyGalleriesError(error: unknown, resolve?: ErrorMessageResolver) {
  if (!isApiError(error)) {
    return resolve?.({ scope: "galleries", fallback: "Something went wrong. Please try again." }) ?? "Something went wrong. Please try again.";
  }

  const baseMessage =
    (error.code && GALLERY_ERROR_MESSAGES[error.code]) ||
    (error.statusCode === 403 && "You do not have permission to perform this action.") ||
    (error.statusCode === 401 && "Your session is no longer valid. Please sign in again.") ||
    error.message ||
    "Something went wrong. Please try again.";

  return resolve?.({ scope: "galleries", code: error.code, statusCode: error.statusCode, fallback: baseMessage }) ?? baseMessage;
}
