import { isApiError } from "@/lib/api/errors";

const PROJECT_ERROR_MESSAGES: Record<string, string> = {
  PROJECT_NOT_FOUND: "The requested project could not be found.",
  INVALID_PROJECT_GALLERY: "The selected gallery is invalid or inactive.",
  PROJECT_NAME_EN_ALREADY_EXISTS: "That English project name already exists.",
  PROJECT_NAME_VI_ALREADY_EXISTS: "That Vietnamese project name already exists.",
  PROJECT_NAME_CN_ALREADY_EXISTS: "That Chinese project name already exists.",
  PROJECT_ALREADY_DELETED: "This project is already archived.",
  PROJECT_NOT_DELETED: "This project is not archived, so it cannot be restored.",
  INVALID_PROJECT_CONTENT: "The project content is invalid. Review the media blocks and try again.",
  PROJECT_COVER_IMAGE_NOT_FOUND: "The selected cover image is no longer available. Re-upload the cover and try again.",
  INVALID_FILE_UPLOAD_TOKEN: "One or more uploaded images expired before submit. Re-upload and try again.",
  INVALID_FILE_UPLOAD_STATE: "One or more uploaded images are not ready yet. Wait for uploads to finish and try again.",
  Forbidden: "You do not have permission to perform this action.",
  Unauthorized: "Your session is no longer valid. Please sign in again.",
};

export function getFriendlyProjectsError(error: unknown) {
  if (!isApiError(error)) {
    if (error instanceof Error && error.message) {
      return error.message;
    }

    return "Something went wrong. Please try again.";
  }

  const baseMessage =
    (error.code && PROJECT_ERROR_MESSAGES[error.code]) ||
    (error.statusCode === 403 && "You do not have permission to perform this action.") ||
    (error.statusCode === 401 && "Your session is no longer valid. Please sign in again.") ||
    error.message ||
    "Something went wrong. Please try again.";

  const details = [error.requestId ? `Request ID: ${error.requestId}` : null, error.path ? `Path: ${error.path}` : null]
    .filter(Boolean)
    .join(" · ");

  return details ? `${baseMessage} (${details})` : baseMessage;
}
