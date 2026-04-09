import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { RequestUploadPayload, RequestUploadResult } from "@/features/files/types/files.types";

export async function requestUpload(payload: RequestUploadPayload) {
  return apiClient.postEnvelope<RequestUploadResult>(API_ENDPOINTS.files.requestUpload, payload, {
    enableAuthRefresh: false,
  });
}
