import { refreshAuthSession } from "@/lib/api/auth-session";
import { env } from "@/lib/env";
import { ApiError } from "@/lib/api/errors";
import type { ApiEnvelope, ApiErrorEnvelope, ApiSuccessEnvelope } from "@/types/api-response";

type JsonBody = RequestInit["body"] | Record<string, unknown> | unknown[] | unknown;

type ApiRequestInit = Omit<RequestInit, "body"> & {
  body?: JsonBody;
  accessToken?: string | null;
  enableAuthRefresh?: boolean;
  _retried?: boolean;
};

function toRequestBody(body: JsonBody) {
  if (body == null || typeof body === "string" || body instanceof FormData) {
    return body;
  }

  return JSON.stringify(body);
}

function getFallbackErrorMessage(path: string, response: Response) {
  return `Unexpected API response while requesting ${path} (${response.status}).`;
}

function toApiError(path: string, response: Response, payload: ApiErrorEnvelope | null) {
  return new ApiError({
    code: payload?.error ?? null,
    message:
      payload?.message ??
      payload?.error ??
      getFallbackErrorMessage(path, response),
    statusCode: payload?.statusCode ?? response.status,
    requestId: payload?.requestId,
    path: payload?.path,
    timestamp: payload?.timestamp,
    details: payload,
  });
}

export async function apiRequestEnvelope<T>(path: string, init: ApiRequestInit = {}) {
  const headers = new Headers(init.headers);

  if (init.body != null && !headers.has("Content-Type") && !(init.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  if (init.accessToken) {
    headers.set("Authorization", `Bearer ${init.accessToken}`);
  }

  const response = await fetch(`${env.NEXT_PUBLIC_API_BASE_URL}${path}`, {
    credentials: "include",
    ...init,
    headers,
    body: toRequestBody(init.body),
    cache: "no-store",
  });

  const payload = (await response.json().catch(() => null)) as ApiEnvelope<T> | null;

  if (!response.ok) {
    const errorPayload = payload as ApiErrorEnvelope | null;

    const shouldTryRefresh =
      response.status === 401 &&
      init.enableAuthRefresh !== false &&
      init._retried !== true &&
      Boolean(init.accessToken) &&
      path !== "/api/v1/auth/refresh" &&
      path !== "/api/v1/auth/login";

    if (shouldTryRefresh) {
      const refreshed = await refreshAuthSession().catch(() => null);

      if (refreshed?.accessToken) {
        return apiRequestEnvelope<T>(path, {
          ...init,
          accessToken: refreshed.accessToken,
          _retried: true,
        });
      }
    }

    throw toApiError(path, response, errorPayload);
  }

  if (!payload || payload.success !== true) {
    throw toApiError(path, response, payload as ApiErrorEnvelope | null);
  }

  return payload as ApiSuccessEnvelope<T>;
}

export async function apiRequest<T>(path: string, init: ApiRequestInit = {}) {
  const envelope = await apiRequestEnvelope<T>(path, init);
  return envelope.data;
}
