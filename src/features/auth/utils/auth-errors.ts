import { isApiError } from "@/lib/api/errors";

const ERROR_MESSAGES = {
  login: {
    INVALID_CREDENTIALS: "Invalid email or password.",
  },
  register: {
    USER_EMAIL_ALREADY_EXISTS: "That email is already registered.",
  },
  registerConfirm: {
    REGISTRATION_TOKEN_INVALID:
      "Registration token is invalid or expired. Request a new registration email if needed.",
  },
  forgotPassword: {},
  resetPassword: {
    PASSWORD_RESET_TOKEN_INVALID:
      "Password reset token is invalid or expired. Request a fresh reset email.",
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

  return mappedMessage ?? error.message;
}
