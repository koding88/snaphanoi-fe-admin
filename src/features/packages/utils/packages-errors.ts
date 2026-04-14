import { isApiError } from "@/lib/api/errors";

const PACKAGE_ERROR_MESSAGES: Record<string, string> = {
  PACKAGE_NOT_FOUND: "The requested package could not be found.",
  PACKAGE_ALREADY_DELETED: "This package is already archived.",
  PACKAGE_NOT_DELETED: "This package is not archived, so it cannot be restored.",
  INVALID_PACKAGE_DURATION: "Duration must be a positive number of seconds.",
  INVALID_PACKAGE_PHOTO_COUNT: "Photo count must be zero or greater.",
  INVALID_PACKAGE_PRICING: "Pricing is invalid. Check the amount and currency fields.",
  INVALID_PACKAGE_NAME: "Review the package name fields and try again.",
  INVALID_PACKAGE_BEST_FOR: "Review the best-for copy and try again.",
  PACKAGE_NAME_EN_ALREADY_EXISTS: "The English package name is already in use.",
  PACKAGE_NAME_VI_ALREADY_EXISTS: "The Vietnamese package name is already in use.",
  PACKAGE_NAME_CN_ALREADY_EXISTS: "The Chinese package name is already in use.",
  PACKAGE_COVER_IMAGE_NOT_FOUND:
    "The selected cover image is no longer available. Re-upload the cover and try again.",
  INVALID_FILE_UPLOAD_TOKEN:
    "The uploaded cover expired before submit. Re-upload the cover and try again.",
  INVALID_FILE_UPLOAD_STATE:
    "The uploaded cover is not ready yet. Wait for the upload to finish and try again.",
  Forbidden: "You do not have permission to perform this action.",
  Unauthorized: "Your session is no longer valid. Please sign in again.",
};

export function getFriendlyPackagesError(error: unknown) {
  if (!isApiError(error)) {
    if (error instanceof Error && error.message) {
      return error.message;
    }

    return "Something went wrong. Please try again.";
  }

  const baseMessage =
    (error.code && PACKAGE_ERROR_MESSAGES[error.code]) ||
    (error.statusCode === 403 &&
      "You do not have permission to perform this action.") ||
    (error.statusCode === 401 &&
      "Your session is no longer valid. Please sign in again.") ||
    error.message ||
    "Something went wrong. Please try again.";

  return baseMessage;
}
