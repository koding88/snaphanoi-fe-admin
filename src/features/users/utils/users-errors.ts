import { isApiError } from "@/lib/api/errors";

const USER_ERROR_MESSAGES: Record<string, string> = {
  USER_EMAIL_ALREADY_EXISTS: "That email is already in use.",
  USER_NOT_FOUND: "The requested user could not be found.",
  INVALID_USER_ROLE: "The selected role is no longer valid. Refresh the role list and try again.",
  INVALID_CURRENT_PASSWORD: "Current password is incorrect.",
  USER_NOT_DELETED: "This account is not archived, so it cannot be restored.",
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

  if (error.statusCode === 403) {
    return "You do not have permission to perform this action.";
  }

  if (error.statusCode === 401) {
    return "Your session is no longer valid. Please sign in again.";
  }

  return error.message || "Something went wrong. Please try again.";
}
