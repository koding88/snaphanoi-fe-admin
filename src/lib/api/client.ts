import { apiRequest } from "@/lib/api/request";

type ApiClientRequestInit = RequestInit & {
  accessToken?: string | null;
};

export const apiClient = {
  get: <T>(path: string, init?: ApiClientRequestInit) =>
    apiRequest<T>(path, { ...init, method: "GET" }),
  post: <T>(path: string, body?: unknown, init?: ApiClientRequestInit) =>
    apiRequest<T>(path, { ...init, method: "POST", body }),
  patch: <T>(path: string, body?: unknown, init?: ApiClientRequestInit) =>
    apiRequest<T>(path, { ...init, method: "PATCH", body }),
  delete: <T>(path: string, init?: ApiClientRequestInit) =>
    apiRequest<T>(path, { ...init, method: "DELETE" }),
};
