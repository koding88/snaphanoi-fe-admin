import { isApiError } from "@/lib/api/errors";

const ROLE_ERROR_MESSAGES: Record<string, string> = {
  ROLE_NAME_ALREADY_EXISTS: "That role name already exists.",
  ROLE_KEY_ALREADY_EXISTS: "That role key already exists. Use a different role name.",
  ROLE_NOT_FOUND: "The requested role could not be found.",
  ROLE_IN_USE: "This role is currently in use and cannot be deleted.",
  CANNOT_DELETE_SYSTEM_ROLE: "System roles cannot be deleted.",
  Forbidden: "You do not have permission to perform this action.",
  Unauthorized: "Your session is no longer valid. Please sign in again.",
};

export function getFriendlyRolesError(error: unknown) {
  if (!isApiError(error)) {
    return "Something went wrong. Please try again.";
  }

  if (error.code && ROLE_ERROR_MESSAGES[error.code]) {
    return ROLE_ERROR_MESSAGES[error.code];
  }

  if (error.statusCode === 403) {
    return "You do not have permission to perform this action.";
  }

  if (error.statusCode === 401) {
    return "Your session is no longer valid. Please sign in again.";
  }

  return error.message || "Something went wrong. Please try again.";
}
