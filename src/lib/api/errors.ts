export class ApiError extends Error {
  code: string | null;
  statusCode: number;
  details?: unknown;

  constructor({
    code,
    message,
    statusCode,
    details,
  }: {
    code: string | null;
    message: string;
    statusCode: number;
    details?: unknown;
  }) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}
