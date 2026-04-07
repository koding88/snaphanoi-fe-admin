export type ApiSuccessEnvelope<T> = {
  success: true;
  error: null;
  statusCode: number;
  data: T;
};

export type ApiErrorEnvelope = {
  success: false;
  error: string;
  statusCode: number;
  message?: string;
};
