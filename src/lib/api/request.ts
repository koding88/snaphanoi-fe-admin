import { env } from "@/lib/env";
import { ApiError } from "@/lib/api/errors";
import type { ApiErrorEnvelope, ApiSuccessEnvelope } from "@/types/api-response";

type JsonBody = RequestInit["body"] | Record<string, unknown> | unknown[] | unknown;

type ApiRequestInit = Omit<RequestInit, "body"> & {
  body?: JsonBody;
  accessToken?: string | null;
};

function toRequestBody(body: JsonBody) {
  if (body == null || typeof body === "string" || body instanceof FormData) {
    return body;
  }

  return JSON.stringify(body);
}

export async function apiRequest<T>(path: string, init: ApiRequestInit = {}) {
  const headers = new Headers(init.headers);

  if (init.body != null && !headers.has("Content-Type") && !(init.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  if (init.accessToken) {
    headers.set("Authorization", `Bearer ${init.accessToken}`);
  }

  const response = await fetch(`${env.NEXT_PUBLIC_API_BASE_URL}${path}`, {
    ...init,
    headers,
    body: toRequestBody(init.body),
    cache: "no-store",
  });

  const payload = (await response.json().catch(() => null)) as
    | ApiSuccessEnvelope<T>
    | ApiErrorEnvelope
    | null;

  if (!response.ok) {
    const errorPayload = payload as ApiErrorEnvelope | null;

    throw new ApiError({
      code: errorPayload?.error ?? null,
      message:
        errorPayload?.message ??
        errorPayload?.error ??
        "Unexpected API response from the server.",
      statusCode: errorPayload?.statusCode ?? response.status,
      details: errorPayload,
    });
  }

  return (payload as ApiSuccessEnvelope<T> | null)?.data as T;
}
