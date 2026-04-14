import axios, {
  AxiosHeaders,
  type AxiosHeaderValue,
  type AxiosRequestConfig,
} from "axios";

import { useAuthStore } from "@/features/auth/store/auth.store";
import { refreshAuthSession } from "@/lib/api/auth-session";
import { ApiError } from "@/lib/api/errors";
import { env } from "@/lib/env";
import type { ApiEnvelope, ApiSuccessEnvelope } from "@/types/api-response";

type JsonBody = Record<string, unknown> | unknown[] | unknown;

export type ApiRequestInit = Omit<AxiosRequestConfig, "url" | "data"> & {
  url?: string;
  body?: JsonBody;
  accessToken?: string | null;
  enableAuthRefresh?: boolean;
  _retried?: boolean;
  _hadAuth?: boolean;
};

const AUTH_RETRY_EXCLUDED_PATHS = new Set([
  "/api/v1/auth/refresh",
  "/api/v1/auth/login",
]);

const apiHttp = axios.create({
  baseURL: env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
});

function normalizePath(url?: string) {
  if (!url) {
    return "";
  }

  try {
    return new URL(url, env.NEXT_PUBLIC_API_BASE_URL).pathname;
  } catch {
    return url.split("?")[0] ?? url;
  }
}

function toRequestData(body: JsonBody | undefined) {
  if (body == null || typeof body === "string" || body instanceof FormData) {
    return body;
  }

  return body;
}

function toAxiosHeaders(headers: AxiosRequestConfig["headers"]) {
  if (headers instanceof AxiosHeaders) {
    return headers;
  }

  if (typeof headers === "string") {
    return AxiosHeaders.from(headers);
  }

  const normalized: Record<string, AxiosHeaderValue> = {};

  if (headers && typeof headers === "object") {
    for (const [key, value] of Object.entries(headers)) {
      if (value !== undefined) {
        normalized[key] = value as AxiosHeaderValue;
      }
    }
  }

  return AxiosHeaders.from(normalized);
}

type ParsedApiErrorPayload = {
  message: string | null;
  error: string | null;
  statusCode: number | null;
  requestId: string | null;
  path: string | null;
  timestamp: string | null;
  raw: unknown;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return value != null && typeof value === "object";
}

function readString(value: unknown) {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
}

function readMessage(value: unknown) {
  if (Array.isArray(value)) {
    const normalized = value
      .map((item) => readString(item))
      .filter((item): item is string => item != null)
      .join(", ")
      .trim();

    return normalized.length > 0 ? normalized : null;
  }

  return readString(value);
}

function parseApiErrorPayload(value: unknown): ParsedApiErrorPayload | null {
  if (!isRecord(value)) {
    return null;
  }

  const message = readMessage(value.message);
  const error = readString(value.error);
  const statusCode = typeof value.statusCode === "number" ? value.statusCode : null;
  const requestId = readString(value.requestId);
  const path = readString(value.path);
  const timestamp = readString(value.timestamp);

  const hasKnownShape =
    value.success === false ||
    message != null ||
    error != null ||
    statusCode != null ||
    requestId != null ||
    path != null ||
    timestamp != null;

  if (!hasKnownShape) {
    return null;
  }

  return {
    message,
    error,
    statusCode,
    requestId,
    path,
    timestamp,
    raw: value,
  };
}

function getFallbackErrorMessage(statusCode: number) {
  if (statusCode === 401) {
    return "Your session is no longer valid. Please sign in again.";
  }

  if (statusCode === 403) {
    return "You do not have permission to perform this action.";
  }

  if (statusCode >= 500) {
    return "The server is temporarily unavailable. Please try again in a moment.";
  }

  return "We couldn't complete your request. Please try again.";
}

function toSecondaryErrorMessage(errorValue: string | null) {
  if (!errorValue) {
    return null;
  }

  return /^[A-Z0-9_]+$/.test(errorValue) ? null : errorValue;
}

function toApiError(path: string, statusCode: number, payload: ParsedApiErrorPayload | null) {
  return new ApiError({
    code: payload?.error ?? null,
    message:
      payload?.message ??
      toSecondaryErrorMessage(payload?.error ?? null) ??
      getFallbackErrorMessage(statusCode),
    statusCode: payload?.statusCode ?? statusCode,
    requestId: payload?.requestId ?? undefined,
    path: payload?.path ?? path,
    timestamp: payload?.timestamp ?? undefined,
    details: payload?.raw ?? null,
  });
}

apiHttp.interceptors.request.use((rawConfig) => {
  const config = rawConfig as AxiosRequestConfig & ApiRequestInit;
  const headers = toAxiosHeaders(rawConfig.headers);

  const token = config.accessToken ?? useAuthStore.getState().session.accessToken;
  const hadAuth = headers.has("Authorization") || Boolean(token);

  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  config._hadAuth = hadAuth;
  rawConfig.headers = headers;

  return rawConfig;
});

apiHttp.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (!axios.isAxiosError(error)) {
      return Promise.reject(error);
    }

    const config = error.config as (AxiosRequestConfig & ApiRequestInit) | undefined;
    const path = normalizePath(config?.url);
    const shouldTryRefresh =
      error.response?.status === 401 &&
      config != null &&
      config.enableAuthRefresh !== false &&
      config._retried !== true &&
      config._hadAuth === true &&
      !AUTH_RETRY_EXCLUDED_PATHS.has(path);

    if (shouldTryRefresh) {
      const refreshed = await refreshAuthSession().catch(() => null);

      if (refreshed?.accessToken) {
        config._retried = true;
        config.accessToken = refreshed.accessToken;
        const headers = toAxiosHeaders(config.headers);
        headers.delete("Authorization");
        config.headers = headers;
        return apiHttp.request(config);
      }
    }

    return Promise.reject(error);
  },
);

export async function apiRequestEnvelope<T>(path: string, init: ApiRequestInit = {}) {
  try {
    const response = await apiHttp.request<ApiEnvelope<T>>({
      ...init,
      method: init.method ?? "GET",
      url: path,
      data: toRequestData(init.body),
    });

    const payload = response.data;

    if (!payload || payload.success !== true) {
      throw toApiError(path, response.status, parseApiErrorPayload(payload));
    }

    return payload as ApiSuccessEnvelope<T>;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    if (axios.isAxiosError(error)) {
      const statusCode = error.response?.status ?? 500;
      const payload = parseApiErrorPayload(error.response?.data);
      const resolvedPath =
        normalizePath((error.config as ApiRequestInit | undefined)?.url) || path;

      throw toApiError(resolvedPath, statusCode, payload);
    }

    throw error;
  }
}

export async function apiRequest<T>(path: string, init: ApiRequestInit = {}) {
  const envelope = await apiRequestEnvelope<T>(path, init);
  return envelope.data;
}
