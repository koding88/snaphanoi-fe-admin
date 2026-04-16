import { isApiError } from "@/lib/api/errors";

type ErrorMessageResolver = (params: {
  scope: string;
  code?: string | null;
  statusCode?: number;
  fallback: string;
}) => string;

const ROLE_ERROR_MESSAGES: Record<string, string> = {
  ROLE_NAME_ALREADY_EXISTS: "That role name already exists.",
  ROLE_KEY_ALREADY_EXISTS: "That role key already exists. Use a different role name.",
  ROLE_NOT_FOUND: "The requested role could not be found.",
  ROLE_IN_USE: "This role is currently in use and cannot be deleted.",
  CANNOT_DELETE_SYSTEM_ROLE: "System roles cannot be deleted.",
  Forbidden: "You do not have permission to perform this action.",
  Unauthorized: "Your session is no longer valid. Please sign in again.",
};

export function getFriendlyRolesError(error: unknown, resolve?: ErrorMessageResolver) {
  if (!isApiError(error)) {
    return resolve?.({ scope: "roles", fallback: "Something went wrong. Please try again." }) ?? "Something went wrong. Please try again.";
  }

  if (error.code && ROLE_ERROR_MESSAGES[error.code]) {
    const mapped = ROLE_ERROR_MESSAGES[error.code];
    return resolve?.({ scope: "roles", code: error.code, statusCode: error.statusCode, fallback: mapped }) ?? mapped;
  }

  if (error.statusCode === 403) {
    const message = "You do not have permission to perform this action.";
    return resolve?.({ scope: "roles", code: error.code, statusCode: error.statusCode, fallback: message }) ?? message;
  }

  if (error.statusCode === 401) {
    const message = "Your session is no longer valid. Please sign in again.";
    return resolve?.({ scope: "roles", code: error.code, statusCode: error.statusCode, fallback: message }) ?? message;
  }

  const fallback = error.message || "Something went wrong. Please try again.";
  return resolve?.({ scope: "roles", code: error.code, statusCode: error.statusCode, fallback }) ?? fallback;
}
