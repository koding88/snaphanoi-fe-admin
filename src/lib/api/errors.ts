export class ApiError extends Error {
  code: string | null;
  statusCode: number;
  requestId?: string;
  path?: string;
  timestamp?: string;
  details?: unknown;

  constructor({
    code,
    message,
    statusCode,
    requestId,
    path,
    timestamp,
    details,
  }: {
    code: string | null;
    message: string;
    statusCode: number;
    requestId?: string;
    path?: string;
    timestamp?: string;
    details?: unknown;
  }) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.statusCode = statusCode;
    this.requestId = requestId;
    this.path = path;
    this.timestamp = timestamp;
    this.details = details;
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}
