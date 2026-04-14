import { isApiError } from "@/lib/api/errors";

const ORDER_ERROR_MESSAGES: Record<string, string> = {
  ORDER_NOT_FOUND: "The requested order could not be found.",
  INVALID_ORDER_REQUEST: "The request payload is invalid. Review the form and try again.",
  INVALID_ORDER_DISCOVERY_SOURCE:
    "Discovery source is not valid. Choose another source and try again.",
  INVALID_ORDER_REQUEST_TOKEN:
    "This confirmation link is invalid or expired. Submit a new request to get another email.",
  INVALID_ORDER_STATUS_TRANSITION:
    "That status update is not allowed from the current lifecycle state.",
  INVALID_ORDER_PAYMENT_STATUS_TRANSITION:
    "That payment status update is not allowed from the current payment state.",
  INVALID_ORDER_UPDATE_PAYLOAD:
    "Select at least one field to update before saving.",
  Forbidden: "You do not have permission to perform this action.",
  Unauthorized: "Your session is no longer valid. Please sign in again.",
};

export function getFriendlyOrdersError(error: unknown) {
  if (!isApiError(error)) {
    if (error instanceof Error && error.message) {
      return error.message;
    }

    return "Something went wrong. Please try again.";
  }

  const isDiscoverySourceValidationError =
    error.code === "INVALID_ORDER_DISCOVERY_SOURCE" ||
    (error.code === "Bad Request Exception" &&
      /discovery\s*source/i.test(error.message));

  const baseMessage =
    (isDiscoverySourceValidationError &&
      "Please choose a valid discovery source.") ||
    (error.code && ORDER_ERROR_MESSAGES[error.code]) ||
    (error.statusCode === 403 &&
      "You do not have permission to perform this action.") ||
    (error.statusCode === 401 &&
      "Your session is no longer valid. Please sign in again.") ||
    error.message ||
    "Something went wrong. Please try again.";

  return baseMessage;
}
