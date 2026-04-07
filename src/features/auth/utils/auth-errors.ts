import { isApiError } from "@/lib/api/errors";

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

export function getFriendlyAuthError(error: unknown, context: AuthErrorContext) {
  if (!isApiError(error)) {
    return "Something went wrong. Please try again.";
  }

  const mappedMessage = error.code
    ? ERROR_MESSAGES[context][error.code as keyof (typeof ERROR_MESSAGES)[typeof context]]
    : null;

  if (mappedMessage) {
    return mappedMessage;
  }

  if (error.statusCode === 401) {
    return "Your session is no longer valid. Please sign in again.";
  }

  if (error.statusCode === 403) {
    return "You do not have permission to perform this action.";
  }

  return error.message || "Something went wrong. Please try again.";
}
