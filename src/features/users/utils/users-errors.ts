import { isApiError } from "@/lib/api/errors";

type ErrorMessageResolver = (params: {
  scope: string;
  code?: string | null;
  statusCode?: number;
  fallback: string;
}) => string;

const USER_ERROR_MESSAGES: Record<string, string> = {
  USER_EMAIL_ALREADY_EXISTS: "That email is already in use.",
  USER_NOT_FOUND: "The requested user could not be found.",
  INVALID_USER_ROLE: "The selected role is no longer valid. Refresh the role list and try again.",
  INVALID_CURRENT_PASSWORD: "Current password is incorrect.",
  USER_NOT_DELETED: "This account is not archived, so it cannot be restored.",
  EMAIL_CHANGE_SAME_AS_CURRENT: "Use a different email from the one already on your account.",
  EMAIL_CHANGE_COOLDOWN_ACTIVE: "A code was sent recently. Please wait a moment before requesting another one.",
  EMAIL_CHANGE_REQUEST_NOT_FOUND: "No pending email change was found. Request a new verification code.",
  EMAIL_CHANGE_PENDING_EMAIL_MISMATCH: "This code belongs to a different pending email. Request a new code for this address.",
  EMAIL_CHANGE_OTP_INVALID: "The verification code is incorrect.",
  EMAIL_CHANGE_OTP_EXPIRED: "The verification code has expired. Request a new one.",
  EMAIL_CHANGE_OTP_ATTEMPTS_EXCEEDED: "Too many incorrect attempts. Request a new verification code.",
  Forbidden: "You do not have permission to perform this action.",
  Unauthorized: "Your session is no longer valid. Please sign in again.",
};

export function getFriendlyUsersError(error: unknown, resolve?: ErrorMessageResolver) {
  if (!isApiError(error)) {
    return resolve?.({ scope: "users", fallback: "Something went wrong. Please try again." }) ?? "Something went wrong. Please try again.";
  }

  if (error.code && USER_ERROR_MESSAGES[error.code]) {
    const mapped = USER_ERROR_MESSAGES[error.code];
    return resolve?.({ scope: "users", code: error.code, statusCode: error.statusCode, fallback: mapped }) ?? mapped;
  }

  if (error.statusCode === 403) {
    const message = "You do not have permission to perform this action.";
    return resolve?.({ scope: "users", code: error.code, statusCode: error.statusCode, fallback: message }) ?? message;
  }

  if (error.statusCode === 401) {
    const message = "Your session is no longer valid. Please sign in again.";
    return resolve?.({ scope: "users", code: error.code, statusCode: error.statusCode, fallback: message }) ?? message;
  }

  const fallback = error.message || "Something went wrong. Please try again.";
  return resolve?.({ scope: "users", code: error.code, statusCode: error.statusCode, fallback }) ?? fallback;
}
