import type { AuthenticatedUser } from "@/features/auth/types/auth.types";

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  countryCode: string;
};

export type RegisterConfirmPayload = {
  token: string;
};

export type ForgotPasswordPayload = {
  email: string;
};

export type ResetPasswordPayload = {
  token: string;
  newPassword: string;
  confirmNewPassword: string;
};

export type AuthSuccessPayload = {
  accessToken: string;
  user: AuthenticatedUser;
};

export type RequestAcceptedPayload = {
  requested: true;
};

export type RegisterConfirmedPayload = {
  registered: true;
};

export type ResetPasswordSuccessPayload = {
  reset: true;
};
