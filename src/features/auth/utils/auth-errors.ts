import { isApiError } from "@/lib/api/errors";

type ErrorMessageResolver = (params: {
  scope: string;
  code?: string | null;
  statusCode?: number;
  fallback: string;
}) => string;

const ERROR_MESSAGES = {
  login: {
    INVALID_CREDENTIALS: "Invalid email or password.",
    UNAUTHORIZED_ACCESS: "Your session is no longer authorized. Please sign in again.",
  },
  register: {
    USER_EMAIL_ALREADY_EXISTS: "That email is already in use.",
  },
  registerConfirm: {
    REGISTRATION_TOKEN_INVALID:
      "This confirmation link is no longer valid. Request a fresh registration email if needed.",
  },
  forgotPassword: {
    UNAUTHORIZED_ACCESS: "This action is no longer authorized. Try again from the sign-in screen.",
  },
  resetPassword: {
    PASSWORD_RESET_TOKEN_INVALID:
      "This reset link is no longer valid. Request a fresh one and try again.",
  },
  refresh: {
    REFRESH_TOKEN_NOT_FOUND: "Your session is missing a refresh token. Please sign in again.",
    REFRESH_TOKEN_REVOKED: "Your session has expired and needs a fresh sign-in.",
    UNAUTHORIZED_ACCESS: "Your session is no longer authorized. Please sign in again.",
  },
} as const;

type AuthErrorContext = keyof typeof ERROR_MESSAGES;

export function getFriendlyAuthError(error: unknown, context: AuthErrorContext, resolve?: ErrorMessageResolver) {
  if (!isApiError(error)) {
    return resolve?.({ scope: `auth.${context}`, fallback: "Something went wrong. Please try again." }) ?? "Something went wrong. Please try again.";
  }

  const mappedMessage = error.code
    ? ERROR_MESSAGES[context][error.code as keyof (typeof ERROR_MESSAGES)[typeof context]]
    : null;

  if (mappedMessage) {
    return resolve?.({ scope: `auth.${context}`, code: error.code, statusCode: error.statusCode, fallback: mappedMessage }) ?? mappedMessage;
  }

  if (error.statusCode === 401) {
    const message = "Your session is no longer valid. Please sign in again.";
    return resolve?.({ scope: `auth.${context}`, code: error.code, statusCode: error.statusCode, fallback: message }) ?? message;
  }

  if (error.statusCode === 403) {
    const message = "You do not have permission to perform this action.";
    return resolve?.({ scope: `auth.${context}`, code: error.code, statusCode: error.statusCode, fallback: message }) ?? message;
  }

  if (error.statusCode >= 500) {
    const message = "The server is temporarily unavailable. Please try again in a moment.";
    return resolve?.({ scope: `auth.${context}`, code: error.code, statusCode: error.statusCode, fallback: message }) ?? message;
  }

  const fallback = error.message || "Something went wrong. Please try again.";
  return resolve?.({ scope: `auth.${context}`, code: error.code, statusCode: error.statusCode, fallback }) ?? fallback;
}
