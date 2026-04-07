import { isApiError } from "@/lib/api/errors";

const USER_ERROR_MESSAGES: Record<string, string> = {
  USER_EMAIL_ALREADY_EXISTS: "That email is already in use.",
  USER_NOT_FOUND: "The requested user could not be found.",
  INVALID_CURRENT_PASSWORD: "Current password is incorrect.",
  Forbidden: "You do not have permission to perform this action.",
  Unauthorized: "Your session is no longer valid. Please sign in again.",
};

export function getFriendlyUsersError(error: unknown) {
  if (!isApiError(error)) {
    return "Something went wrong. Please try again.";
  }

  if (error.code && USER_ERROR_MESSAGES[error.code]) {
    return USER_ERROR_MESSAGES[error.code];
  }

  return error.message;
}
