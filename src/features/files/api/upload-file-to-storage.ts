type UploadFileToStorageParams = {
  uploadUrl: string;
  file: File;
  headers?: Record<string, string>;
};

export async function uploadFileToStorage({
  uploadUrl,
  file,
  headers = {},
}: UploadFileToStorageParams) {
  const response = await fetch(uploadUrl, {
    method: "PUT",
    headers,
    body: file,
  });

  if (!response.ok) {
    throw new Error(`Storage upload failed (${response.status}).`);
  }
}
