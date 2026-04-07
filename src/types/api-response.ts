export type ApiEnvelopeMeta = {
  message?: string | null;
  statusCode: number;
  timestamp?: string;
  path?: string;
  requestId?: string;
};

export type ApiSuccessEnvelope<T> = ApiEnvelopeMeta & {
  success: true;
  error: null;
  data: T;
};

export type ApiErrorEnvelope = ApiEnvelopeMeta & {
  success: false;
  error: string | null;
  data: null;
};

export type ApiEnvelope<T> = ApiSuccessEnvelope<T> | ApiErrorEnvelope;
