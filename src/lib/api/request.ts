import axios, {
  AxiosHeaders,
  type AxiosHeaderValue,
  type AxiosRequestConfig,
} from "axios";

import { useAuthStore } from "@/features/auth/store/auth.store";
import { refreshAuthSession } from "@/lib/api/auth-session";
import { ApiError } from "@/lib/api/errors";
import { env } from "@/lib/env";
import type { ApiEnvelope, ApiErrorEnvelope, ApiSuccessEnvelope } from "@/types/api-response";

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

function isApiErrorEnvelope(value: unknown): value is ApiErrorEnvelope {
  if (!value || typeof value !== "object") {
    return false;
  }

  const maybeEnvelope = value as Partial<ApiErrorEnvelope>;
  return maybeEnvelope.success === false;
}

function getFallbackErrorMessage(path: string, statusCode: number) {
  return `Unexpected API response while requesting ${path} (${statusCode}).`;
}

function toApiError(path: string, statusCode: number, payload: ApiErrorEnvelope | null) {
  return new ApiError({
    code: payload?.error ?? null,
    message:
      payload?.message ??
      payload?.error ??
      getFallbackErrorMessage(path, statusCode),
    statusCode: payload?.statusCode ?? statusCode,
    requestId: payload?.requestId,
    path: payload?.path,
    timestamp: payload?.timestamp,
    details: payload,
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
      throw toApiError(path, response.status, payload as ApiErrorEnvelope | null);
    }

    return payload as ApiSuccessEnvelope<T>;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    if (axios.isAxiosError(error)) {
      const statusCode = error.response?.status ?? 500;
      const payload = isApiErrorEnvelope(error.response?.data)
        ? error.response.data
        : null;
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
