import { apiRequest, apiRequestEnvelope } from "@/lib/api/request";
import type { ApiRequestInit } from "@/lib/api/request";
import type { ApiSuccessEnvelope } from "@/types/api-response";

type ApiClientRequestInit = ApiRequestInit;

export const apiClient = {
  getEnvelope: <T>(path: string, init?: ApiClientRequestInit): Promise<ApiSuccessEnvelope<T>> =>
    apiRequestEnvelope<T>(path, { ...init, method: "GET" }),
  postEnvelope: <T>(path: string, body?: unknown, init?: ApiClientRequestInit): Promise<ApiSuccessEnvelope<T>> =>
    apiRequestEnvelope<T>(path, { ...init, method: "POST", body }),
  patchEnvelope: <T>(path: string, body?: unknown, init?: ApiClientRequestInit): Promise<ApiSuccessEnvelope<T>> =>
    apiRequestEnvelope<T>(path, { ...init, method: "PATCH", body }),
  deleteEnvelope: <T>(path: string, init?: ApiClientRequestInit): Promise<ApiSuccessEnvelope<T>> =>
    apiRequestEnvelope<T>(path, { ...init, method: "DELETE" }),
  get: <T>(path: string, init?: ApiClientRequestInit) =>
    apiRequest<T>(path, { ...init, method: "GET" }),
  post: <T>(path: string, body?: unknown, init?: ApiClientRequestInit) =>
    apiRequest<T>(path, { ...init, method: "POST", body }),
  patch: <T>(path: string, body?: unknown, init?: ApiClientRequestInit) =>
    apiRequest<T>(path, { ...init, method: "PATCH", body }),
  delete: <T>(path: string, init?: ApiClientRequestInit) =>
    apiRequest<T>(path, { ...init, method: "DELETE" }),
};
