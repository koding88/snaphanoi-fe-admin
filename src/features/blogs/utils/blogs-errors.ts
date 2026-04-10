import { isApiError } from "@/lib/api/errors";

const BLOG_ERROR_MESSAGES: Record<string, string> = {
  BLOG_NOT_FOUND: "The requested blog could not be found.",
  BLOG_ALREADY_DELETED: "This blog is already archived.",
  BLOG_NOT_DELETED: "This blog is not archived, so it cannot be restored.",
  INVALID_BLOG_NAME: "The blog title is invalid. Keep it between 2 and 150 characters.",
  INVALID_BLOG_CONTENT: "The blog content is invalid. Review the editor blocks and try again.",
  BLOG_COVER_IMAGE_NOT_FOUND: "The selected cover image is no longer available. Re-upload the cover and try again.",
  INVALID_FILE_UPLOAD_TOKEN: "One or more uploaded images expired before submit. Re-upload and try again.",
  INVALID_FILE_UPLOAD_STATE: "One or more uploaded images are not ready yet. Wait for uploads to finish and try again.",
  Forbidden: "You do not have permission to perform this action.",
  Unauthorized: "Your session is no longer valid. Please sign in again.",
};

export function getFriendlyBlogsError(error: unknown) {
  if (!isApiError(error)) {
    if (error instanceof Error && error.message) {
      return error.message;
    }

    return "Something went wrong. Please try again.";
  }

  const baseMessage =
    (error.code && BLOG_ERROR_MESSAGES[error.code]) ||
    (error.statusCode === 403 && "You do not have permission to perform this action.") ||
    (error.statusCode === 401 && "Your session is no longer valid. Please sign in again.") ||
    error.message ||
    "Something went wrong. Please try again.";

  const details = [error.requestId ? `Request ID: ${error.requestId}` : null, error.path ? `Path: ${error.path}` : null]
    .filter(Boolean)
    .join(" · ");

  return details ? `${baseMessage} (${details})` : baseMessage;
}
